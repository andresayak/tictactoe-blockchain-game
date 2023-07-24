import "pg";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./typeorm-config.service";
import { createConnection } from "typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: "default",
      imports: [],
      inject: [TypeOrmConfigService],
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [
    TypeOrmConfigService,
    {
      provide: "DATABASE_CONNECTION",
      useFactory: async (typeOrmConfigService: TypeOrmConfigService) => {
        return await createConnection(typeOrmConfigService.createConnectionOptions());
      },
      inject: [TypeOrmConfigService],
    },
  ],
  exports: ["DATABASE_CONNECTION"],
})
export class DatabaseModule {}
