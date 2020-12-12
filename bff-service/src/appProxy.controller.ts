import { Controller, Get } from '@nestjs/common';
import { AppProxyService } from './appProxy.service';

@Controller()
export class AppProxyController {
  constructor(
    private readonly appProxyService: AppProxyService
  ) {}

  @Get()
  getResource(): string {
    return this.appProxyService.getResource();
  }
}
