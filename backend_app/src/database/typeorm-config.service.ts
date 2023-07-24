import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConnectionOptions } from "typeorm";
import { join } from "path";
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createConnectionOptions(): ConnectionOptions {
    return {
      type: "postgres",
      host: this.configService.get("POSTGRES_HOST"),
      port: this.configService.get("POSTGRES_PORT"),
      username: this.configService.get("POSTGRES_USER"),
      password: this.configService.get("POSTGRES_PASSWORD"),
      database: this.configService.get("POSTGRES_DB"),
      synchronize: false,
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      migrationsTableName: "custom_migration_table",
      migrations: [join(__dirname, "migrations/*{.ts,.js}")],
      logging: true,
    };
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.configService.get("POSTGRES_HOST"),
      port: this.configService.get("POSTGRES_PORT"),
      username: this.configService.get("POSTGRES_USER"),
      password: this.configService.get("POSTGRES_PASSWORD"),
      database: this.configService.get("POSTGRES_DB"),
      autoLoadEntities: true,
      synchronize: false,
    };
  }
}
