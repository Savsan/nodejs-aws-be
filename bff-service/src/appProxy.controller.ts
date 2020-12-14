import { Controller, All, Request } from '@nestjs/common';
import { AppProxyService } from './appProxy.service';

@Controller()
export class AppProxyController {
  constructor(
    private readonly appProxyService: AppProxyService
  ) {}

  @All()
  getResource(@Request() req): Promise<object> {
    return this.appProxyService.getResource(req);
  }
}
