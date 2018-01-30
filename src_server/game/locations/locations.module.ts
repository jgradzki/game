import { Module  } from '@nestjs/common';
import { log } from '../../logger';

import { ConfigModule } from '../config/config.module';
import { MapModule } from '../map/map.module';
import { PlayerModule } from '../player/player.module';

import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';

import { locationsModules } from './entities';

@Module({
	imports: [ConfigModule, PlayerModule, MapModule, ...locationsModules],
	controllers: [LocationsController],
	components: [LocationsService],
	exports: [LocationsService]
})
export class LocationsModule {}
