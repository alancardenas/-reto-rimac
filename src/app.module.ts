import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApisProvider } from './providers/swapi/swapi.provider';

@Module({
  controllers: [AppController],
  providers: [AppService, ApisProvider],
})
export class AppModule {}
