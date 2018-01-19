import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../../db';

//import { Map } from './Map.entity';

import { LoggedInGuard } from '../guards/loggedin.guard';

import { PlayerModule } from '../player/player.module';

import { MapService } from './map.service';

import { MapController } from './map.controller';

@Module({
  imports: [PlayerModule],
  controllers: [MapController],
  components: [MapService],
  exports: [MapService]
})
export class MapModule {

}
