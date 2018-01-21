import { Module  } from '@nestjs/common';
import { log } from '../../logger';

import { MapModule } from '../map/map.module';

import { LocationsService } from './locations.service';

import { providers, services, dependecies } from './entities';

@Module({
	imports: [MapModule, providers, ...dependecies],
	controllers: [],
	components: [...services, LocationsService],
	exports: [...services, LocationsService]
})
export class LocationsModule {}
