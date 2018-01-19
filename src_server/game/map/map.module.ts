import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../../db';

import { MapElement } from './MapElement.entity';

import { LoggedInGuard } from '../guards/loggedin.guard';

import { PlayerModule } from '../player/player.module';

import { MapService } from './map.service';

import { MapController } from './map.controller';

@Module({
  imports: [PlayerModule, TypeOrmModule.forFeature([MapElement])],
  controllers: [MapController],
  components: [MapService],
  exports: [TypeOrmModule.forFeature([MapElement]), MapService]
})
export class MapModule {

}
