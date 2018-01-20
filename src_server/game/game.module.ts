import { Module  } from '@nestjs/common';

import { ConfigService } from './config/config.service';

import { PlayerModule } from './player/player.module';
import { EventsModule } from './events/events.module';
import { MapModule } from './map/map.module';

import { GameController } from './game.controller';
import { ApiController } from './api/api.controller';
import { RequestController } from './request/request.controller';

@Module({
	imports: [
		PlayerModule,
		EventsModule,
		MapModule
	],
	controllers: [GameController, ApiController, RequestController],
	components: [ConfigService],
	exports: [ConfigService]
})
export class GameModule {}
