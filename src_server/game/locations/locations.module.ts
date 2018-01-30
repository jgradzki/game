import { Module  } from '@nestjs/common';
import { log } from '../../logger';

import { ConfigModule } from '../config/config.module';
import { MapModule } from '../map/map.module';
import { PlayerModule } from '../player/player.module';

import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';

import { providers, services, locationsControllers, dependecies } from './entities';

@Module({
	imports: [ConfigModule, PlayerModule, MapModule, providers, ...dependecies],
	controllers: [LocationsController],
	components: [...services,  ...locationsControllers, LocationsService],
	exports: [...services, LocationsService]
})
export class LocationsModule {}
