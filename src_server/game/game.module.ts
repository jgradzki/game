import { Module  } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { PlayerModule } from './player/player.module';
import { EventsModule } from './events/events.module';
import { MapModule } from './map/map.module';
import { TasksModule } from './tasks/tasks.module';

import { GameController } from './game.controller';
import { ApiController } from './api/api.controller';
import { RequestController } from './request/request.controller';

import { TasksService } from './tasks/tasks.service';

@Module({
	imports: [
		ConfigModule,
		PlayerModule,
		EventsModule,
		MapModule,
		TasksModule
	],
	controllers: [GameController, ApiController, RequestController],
	components: [],
	exports: []
})
export class GameModule {
	constructor(private readonly tasksService: TasksService) {
		this.tasksService.startTasks();
	}
}
