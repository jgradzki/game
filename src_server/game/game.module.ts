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

import { TasksService } from './tasks/tasks.service';
import { ItemsService } from './items';
import { InventoryService } from './inventory';
import { PlayersService } from './player/players.service';
import { MapService } from './map/map.service';
import { LocationsService } from './locations/locations.service';

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
	components: [],
	exports: []
})
export class GameModule {
	constructor(
		private readonly tasksService: TasksService,
		private readonly itemsService: ItemsService,
		private readonly inventoryService: InventoryService,
		private readonly playersService: PlayersService,
		private readonly mapService: MapService,
		private readonly locationsService: LocationsService
	) {
		this.catchProcessExit();
		this.tasksService.startTasks();
		this.checkAdminAccount();
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
			this.inventoryService.unloadAllInventories(),
			this.itemsService.unloadAllItems(),
			this.mapService.unloadAllMapElements(),
			this.playersService.unloadAllPlayers(),
			this.locationsService.unloadAll()
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

	private handleUncaughtException(error) {
		log('error', error);
		this.onExit();
	}

	private async checkAdminAccount() {
		let admin = await this.playersService.getPlayerByLogin('Admin');

		if (!admin) {
			admin = await this.playersService.create('Admin', '123456');
			log('info', 'Admin account created.');
		} else {
			await this.playersService.unloadPlayer(admin);
		}
	}
}
