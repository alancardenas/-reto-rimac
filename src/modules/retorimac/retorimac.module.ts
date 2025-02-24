import { Module } from '@nestjs/common';
import { SWAPIModule } from '../../providers/swapi/swapi.module';
import { StarshipController } from './retorimac.controller';
import { StarshipService } from './retorimac.service';

@Module({
  imports: [SWAPIModule],
  controllers: [StarshipController],
  providers: [StarshipService],
})
export class StarshipModule {}
