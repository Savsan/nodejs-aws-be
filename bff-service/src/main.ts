import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
require('dotenv').config();
const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // @ts-ignore
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());
  await app.listen(port);
}

bootstrap().then(() => {
  console.log(`APP started on port ${port}`);
});
