import { Component } from '@nestjs/common';
import { log } from '../logger';

import { TasksService } from './tasks/tasks.service';
import { ItemsService } from './items';
import { InventoryService } from './inventory';
import { PlayersService } from './player/players.service';
import { MapService } from './map/map.service';
import { LocationsService } from './locations/locations.service';

@Component()
export class GameService {

	constructor(
		private readonly tasksService: TasksService,
		private readonly itemsService: ItemsService,
		private readonly inventoryService: InventoryService,
		private readonly playersService: PlayersService,
		private readonly mapService: MapService,
		private readonly locationsService: LocationsService
	) {
		this.tasksService.startTasks();
		this.checkAdminAccount();
	}

	async close() {
		log('info', 'Stopping...');

		await this.tasksService.stopTasks();

		try {
			await Promise.all([
				this.inventoryService.unloadAllInventories(),
				this.itemsService.unloadAllItems(),
				this.mapService.unloadAllMapElements(),
				this.playersService.unloadAllPlayers(),
				this.locationsService.unloadAll()
			]);
		} catch(error) {
			log('error', 'Error:');
			log('error', error);
			return false;
		}

		return true;
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
