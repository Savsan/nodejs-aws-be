import { Test, TestingModule } from '@nestjs/testing';
import { AppProxyController } from './appProxy.controller';
import { AppProxyService } from './appProxy.service';

describe('AppProxyController', () => {
  let appController: AppProxyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppProxyController],
      providers: [AppProxyService],
    }).compile();

    appController = app.get<AppProxyController>(AppProxyController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
