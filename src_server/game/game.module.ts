import { Module  } from '@nestjs/common';
import { log } from '../logger';

import { ConfigModule } from './config/config.module';
import { PlayerModule } from './player/player.module';
import { EventsModule } from './events/events.module';
import { MapModule } from './map/map.module';
import { TasksModule } from './tasks/tasks.module';

import { GameController } from './game.controller';
import { ApiController } from './api/api.controller';
import { RequestController } from './request/request.controller';

import { TasksService } from './tasks/tasks.service';
import { PlayersService } from './player/players.service';
import { MapService } from './map/map.service';

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
	constructor(
		private readonly tasksService: TasksService,
		private readonly playersService: PlayersService,
		private readonly mapService: MapService
	) {
		this.catchProcessExit();
		this.tasksService.startTasks();
	}

	private catchProcessExit() {
		process.on('exit', code => this.handleExit(code));
		process.on('SIGINT', () => this.handleExit(null));
		process.on('uncaughtException', err => this.handleUncaughtException(err));
	}

	private async onExit() {
		log('info', 'Server closing.');

		await this.tasksService.stopTasks();

		Promise.all([
			this.mapService.unloadAllMapElements(),
			this.playersService.unloadAllPlayers()
		])
			.then( () => {
				log('info', 'Goodbye.');
				setTimeout(() => process.exit(3), 500); // To give logger time for save last logs.
			})
			.catch( error => {
				log('error', 'Server close error!');
				log('error', error);
				setTimeout(() => process.exit(3), 500); // To give logger time for save last logs.
			});
	}

	private handleExit(code) {
		if (code !== 3) {
			this.onExit();
		}
	}

	handleUncaughtException(error) {
		log('error', error);
		this.onExit();
	}
}
