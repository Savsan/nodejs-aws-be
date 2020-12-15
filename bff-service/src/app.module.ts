import { Module } from '@nestjs/common';
import { AppProxyController } from './appProxy.controller';
import { AppProxyService } from './appProxy.service';

@Module({
  imports: [],
  controllers: [AppProxyController],
  providers: [AppProxyService],
})
export class AppModule {}
