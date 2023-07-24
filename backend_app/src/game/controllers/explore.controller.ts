import { Controller, Get, Inject, Param } from "@nestjs/common";
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
  async wait(@Param("chainId") chainId: number) {
    const items = await this.getItems(chainId, Statuses.WAIT);
    return {
      items,
    };
  }

  @Get("progress")
  async progress(@Param("chainId") chainId: number) {
    const items = await this.getItems(chainId, Statuses.PROGRESS);
    return {
      items,
    };
  }

  @Get("closed")
  async closed(@Param("chainId") chainId: number) {
    const items = await this.getItems(chainId, [Statuses.FINISHED, Statuses.CANCELED]);
    return {
      items,
    };
  }
}
