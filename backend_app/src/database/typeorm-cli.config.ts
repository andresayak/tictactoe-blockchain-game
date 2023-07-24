import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmConfigService } from "./typeorm-config.service";

const configModule = ConfigModule.forRoot();

// @ts-ignore
const configService = new configModule.exports[0]();
if (!(configService instanceof ConfigService)) {
  throw Error("not found configService");
}
const typeOrmConfigService = new TypeOrmConfigService(configService);

export default new DataSource(typeOrmConfigService.createConnectionOptions());
