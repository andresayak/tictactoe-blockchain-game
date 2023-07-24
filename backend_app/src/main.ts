import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { useContainer } from "class-validator";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("APP")
    .setDescription("The API description").setVersion("1.0").addTag("APP").build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup("/api", app, document);

  await app.listen(5000);
}

bootstrap();
