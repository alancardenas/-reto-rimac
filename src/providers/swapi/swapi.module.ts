import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ApisProvider } from './swapi.provider';

@Global()
@Module({
  imports: [HttpModule],
  providers: [ApisProvider],
  exports: [ApisProvider],
})
export class SWAPIModule {}
