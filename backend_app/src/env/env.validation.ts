import { Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from "class-validator";

enum Environment {
  Development = "development",
  Staging = "staging",
  Production = "production",
}

class EnvironmentVariables {
  @IsEnum(Environment)
  APP_ENV: Environment;

  @IsNumber()
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_HOST: string;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsString()
  @IsOptional()
  MAIL_HOST: string;

  @IsString()
  APP_ORIGIN: string;

  @IsString()
  @IsOptional()
  SENTRY_ORG: string;

  @IsString()
  @IsOptional()
  SENTRY_API_DSN: string;

  @IsString()
  @IsOptional()
  SENTRY_AUTH_TOKEN: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    Logger.error(errors.toString());
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
