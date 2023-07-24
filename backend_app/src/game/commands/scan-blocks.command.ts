import { Command, Positional } from "nestjs-command";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ProviderFactoryService } from "../provider-factory.service";
import { Contract, EventLog, Provider } from "ethers";
import * as TicTacToeERC20 from "../../contracts/TicTacToeERC20.sol/TicTacToeERC20.json";
import * as Factory from "../../contracts/Factory.sol/Factory.json";
import { In, Repository } from "typeorm";
import { GameEntity, GamePlayerEntity, Statuses } from "../entities";
import { RedisClientType } from "redis";

type PropsType = {
  factoryAddress: string;
  factoryContract: Contract;
  provider: Provider;
  chainId: number;
};

@Injectable()
export class ScanBlocksCommand {
  constructor(
    private readonly configService: ConfigService,
    @Inject("GAME_REPOSITORY")
    private readonly gameRepository: Repository<GameEntity>,
    @Inject("GAME_PLAYER_REPOSITORY")
    private readonly gamePlayerRepository: Repository<GamePlayerEntity>,
    private readonly providerFactoryService: ProviderFactoryService,
    @Inject("REDIS_CLIENT")
    private readonly redisClient: RedisClientType,
  ) {}

  @Command({
    command: "scan:games <chainId>",
  })
  async create(
    @Positional({
      name: "chainId",
      type: "number",
    })
    chainId: number,
  ) {
    const provider = this.providerFactoryService.create(chainId);
    const factoryAddress = this.providerFactoryService.chains[chainId].publicConfig.FACTORY_ADDRESS;

    const factoryContract = new Contract(factoryAddress, Factory.abi, provider);
    const lastBlock = await this.lastBlock(factoryContract.birthdayBlock());
    const currentBlock = await provider.getBlockNumber();
    for (let blockNumber = lastBlock; blockNumber <= currentBlock; blockNumber++) {
      console.log("blockNumber", blockNumber);
      await this.processBlock(blockNumber, { factoryAddress, factoryContract, chainId, provider });
    }
    console.log("Done!");
  }

  async processBlock(blockNumber: number, props: PropsType) {
    const { factoryContract } = props;
    const events = await factoryContract.queryFilter("GameCreated", blockNumber, blockNumber);
    for (const event of events) {
      if (event instanceof EventLog) {
        await this.saveNewGame(event.args[0], event.args[1], props);
      }
    }

    await this.updateActiveGames(blockNumber, props);
  }

  async updateActiveGames(blockNumber: number, props: PropsType) {
    const { chainId } = props;
    const games = await this.gameRepository.find({
      where: {
        chainId,
        status: In([Statuses.WAIT, Statuses.PROGRESS]),
      },
    });
    await Promise.all(games.map(game => this.updateActiveGame(game, props)));
  }

  async updateActiveGame(game: GameEntity, props: PropsType) {
    const { provider, chainId } = props;
    const gameContract = new Contract(game.address, TicTacToeERC20.abi, provider);

    const newStatus = Number(await gameContract.status());
    if (game.status == Statuses.WAIT && newStatus == Statuses.PROGRESS) {
      const player2 = await gameContract.player2();
      if (!player2) {
        throw Error(`player2 not set in game [address=${game.address}, chainId=${chainId}]`);
      }
      try {
        await this.gamePlayerRepository.save({
          gameId: game.id,
          address: player2,
        });
      } catch (e) {
        if (e && e.toString().match(/duplicate key value violates unique constraint/)) {
          return;
        } else {
          throw e;
        }
      }
    }
    await this.gameRepository.update(
      {
        id: game.id,
      },
      {
        status: newStatus,
      },
    );
  }

  async lastBlock(defaultValue: Promise<bigint>) {
    const reply = await this.redisClient.get("lastBlock");
    const number = parseInt(reply);
    if (number) {
      return number;
    }
    return Number(await defaultValue);
  }

  async saveNewGame(gameAddress: string, creatorAddress: string, props: PropsType) {
    const { provider, factoryAddress, chainId } = props;
    const gameContract = new Contract(gameAddress, TicTacToeERC20.abi, provider);

    const tokenAddress = await gameContract.token();
    const timeoutTime = await gameContract.timeoutTime();
    const coins = await gameContract.coins();
    const size = await gameContract.size();
    const createdTime: bigint = await gameContract.createdTime();

    console.log("createdTime", createdTime);
    try {
      const game = await this.gameRepository.save({
        type: "0",
        factoryAddress: factoryAddress,
        chainId,
        address: gameAddress,
        tokenAddress,
        creatorAddress,
        status: Statuses.WAIT,
        params: {
          timeoutTime: timeoutTime.toString(),
          coins: coins.toString(),
          size: size.toString(),
        },
        createdAt: new Date(Number(createdTime) * 1000),
      });

      console.log("game", game);
      await this.gamePlayerRepository.save({
        gameId: game.id,
        address: creatorAddress,
      });
    } catch (e) {
      if (e && e.toString().match(/duplicate key value violates unique constraint/)) {
        return;
      } else {
        throw e;
      }
    }

    console.log("game", {
      tokenAddress,
      timeoutTime,
      coins,
      size,
      createdTime,
    });
  }
}
