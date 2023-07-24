import { Module } from "@nestjs/common";
import controllers from "./controllers";
import commands from "./commands";
import { EnvModule } from "../env/env.module";
import { ProviderFactoryService } from "./provider-factory.service";
import { Connection } from "typeorm";
import { GameEntity, GamePlayerEntity } from "./entities";
import { DatabaseModule } from "../database/database.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";

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
    {
      provide: "REDIS_CLIENT",
      useFactory: async (configService: ConfigService) => {
        const redisClient = createClient({
          url: `redis://:${configService.get("REDIS_PASSWORD")}@${configService.get("REDIS_HOST")}:${configService.get("REDIS_PORT")}`,
        });
        await redisClient.connect();
        return redisClient;
      },
      inject: [ConfigService],
    },
  ],
  exports: [entities],
})
export class GameModule {}
