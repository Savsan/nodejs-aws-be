import { Injectable } from '@nestjs/common';

@Injectable()
export class AppProxyService {
  getResource(): string {
    return 'Hello World!';
  }
}
