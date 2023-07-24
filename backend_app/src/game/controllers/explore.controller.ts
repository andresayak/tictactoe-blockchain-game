import { Controller, Get, Inject, Param, ParseIntPipe } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { GameEntity, Statuses } from "../entities";

@Controller("explore/:chainId")
export class ExploreController {
  constructor(
    @Inject("GAME_REPOSITORY")
    private readonly gameRepository: Repository<GameEntity>,
  ) {}

  getItems(chainId: number, status: Statuses | Statuses[]) {
    return this.gameRepository.find({
      where: {
        chainId,
        status: Array.isArray(status) ? In(status) : status,
      },
    });
  }

  @Get("wait")
  async wait(@Param("chainId", ParseIntPipe) chainId: number) {
    const items = await this.getItems(chainId, Statuses.WAIT);
    return {
      items,
    };
  }

  @Get("progress")
  async progress(@Param("chainId", ParseIntPipe) chainId: number) {
    const items = await this.getItems(chainId, Statuses.PROGRESS);
    return {
      items,
    };
  }

  @Get("closed")
  async closed(@Param("chainId", ParseIntPipe) chainId: number) {
    const items = await this.getItems(chainId, [Statuses.FINISHED, Statuses.CANCELED]);
    return {
      items,
    };
  }

  @Get("details/:address")
  async details(@Param("chainId", ParseIntPipe) chainId: number, @Param("address") address: string) {
    const game = await this.gameRepository.findOne({
      where: {
        chainId,
        address,
      },
    });
    return {
      game,
    };
  }
}
