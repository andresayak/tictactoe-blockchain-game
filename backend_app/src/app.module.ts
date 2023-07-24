import { Module } from "@nestjs/common";
import { EnvModule } from "./env/env.module";
import { GameModule } from "./game/game.module";
import { Logger } from "@nestjs/common";
import { CommandModule } from "nestjs-command";

@Module({
  imports: [EnvModule, GameModule, CommandModule],
  providers: [Logger],
})
export class AppModule {}
