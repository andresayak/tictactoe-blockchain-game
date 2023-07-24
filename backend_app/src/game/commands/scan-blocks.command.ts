import { Command, Positional } from "nestjs-command";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ProviderFactoryService } from "../provider-factory.service";
import { Contract, EventLog } from "ethers";

import * as TicTacToeERC20 from "../../contracts/TicTacToeERC20.sol/TicTacToeERC20.json";
import * as Factory from "../../contracts/Factory.sol/Factory.json";
import { Repository } from "typeorm";
import { GameEntity, GamePlayerEntity, Statuses } from "../entities";

@Injectable()
export class ScanBlocksCommand {
  constructor(
    private readonly configService: ConfigService,
    @Inject("GAME_REPOSITORY")
    private readonly gameRepository: Repository<GameEntity>,
    @Inject("GAME_PLAYER_REPOSITORY")
    private readonly gamePlayerRepository: Repository<GamePlayerEntity>,
    private readonly providerFactoryService: ProviderFactoryService,
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

    const contract = new Contract(factoryAddress, Factory.abi, provider);
    const events = await contract.queryFilter("GameCreated", 31799980, 31799983);
    console.log("factoryAddress", factoryAddress, events);

    for (const event of events) {
      if (event instanceof EventLog) {
        console.log("event", event.args);
        await this.fetchGame(factoryAddress, chainId, event.args[0], provider);
      }
    }
  }

  async fetchGame(factoryAddress: string, chainId: number, address: string, provider) {
    const contract = new Contract(address, TicTacToeERC20.abi, provider);

    const tokenAddress = await contract.token();
    const creatorAddress = await contract.player1();
    const timeoutTime = await contract.timeoutTime();
    const coins = await contract.coins();
    const size = await contract.size();
    const createdTime: bigint = await contract.createdTime();

    console.log("createdTime", createdTime);
    const game = await this.gameRepository.save({
      type: "0",
      factoryAddress,
      chainId,
      address,
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

    console.log("game", {
      tokenAddress,
      timeoutTime,
      coins,
      size,
      createdTime,
    });
  }
}
