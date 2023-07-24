import { Module } from "@nestjs/common";
import controllers from "./controllers";
import commands from "./commands";
import { EnvModule } from "../env/env.module";
import { ProviderFactoryService } from "./provider-factory.service";
import { Connection } from "typeorm";
import { GameEntity, GamePlayerEntity } from "./entities";
import { DatabaseModule } from "../database/database.module";
import { TypeOrmModule } from "@nestjs/typeorm";

const entities = TypeOrmModule.forFeature([GameEntity, GamePlayerEntity]);

@Module({
  imports: [entities, EnvModule, DatabaseModule],
  controllers,
  providers: [
    ...commands,
    ProviderFactoryService,
    {
      provide: "GAME_REPOSITORY",
      useFactory: (connection: Connection) => connection.getRepository(GameEntity),
      inject: ["DATABASE_CONNECTION"],
    },
    {
      provide: "GAME_PLAYER_REPOSITORY",
      useFactory: (connection: Connection) => connection.getRepository(GamePlayerEntity),
      inject: ["DATABASE_CONNECTION"],
    },
  ],
  exports: [entities],
})
export class GameModule {}
