import { Module  } from '@nestjs/common';
import { log } from '../logger';

import { ConfigModule } from './config/config.module';
import { ItemsModule } from './items';
import { InventoryModule } from './inventory';
import { PlayerModule } from './player/player.module';
import { EventsModule } from './events/events.module';
import { MapModule } from './map/map.module';
import { LocationsModule } from './locations/locations.module';
import { TasksModule } from './tasks/tasks.module';

import { GameController } from './game.controller';
import { ApiController } from './api/api.controller';
import { RequestController } from './request/request.controller';

import { GameService } from './game.service';

@Module({
	imports: [
		ConfigModule,
		ItemsModule,
		InventoryModule,
		PlayerModule,
		EventsModule,
		MapModule,
		LocationsModule,
		TasksModule
	],
	controllers: [GameController, ApiController, RequestController],
	components: [GameService],
	exports: [GameService]
})
export class GameModule {}
