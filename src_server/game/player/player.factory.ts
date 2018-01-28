import { Component } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '../../db';
import {  EntityManager, Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { log } from '../../logger';

import { Player } from './player.entity';
import { LocationsService } from '../locations/locations.service';
import { ItemsService, ItemTypes } from '../items';
import { InventoryService } from '../inventory';

import { MapIcon } from '../map/interfaces/map-icon.enum';
import { LocationType } from '../locations/entities';

@Component()
export class PlayerFactory {
	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(Player)
		private readonly playerRepository: Repository<Player>,
		private readonly locationsService: LocationsService,
		private readonly itemsService: ItemsService,
		private readonly inventoryService: InventoryService
	) {}

	async create(login: string, password: string, options?: object): Promise<Player> {
		const item = await this.itemsService.create(ItemTypes.wood);
		const inventory = await this.inventoryService.create(10);
		inventory.itemsData = [item.data];
		await this.inventoryService.saveInventory(inventory);

		const player = await this.playerRepository.create({
			login,
			password: await this.generateHash(password),
			mapPosition: { x: 50, y: 50 },
			inventory
		});

		await this.entityManager.save(player);

		await this.locationsService.createLocation(
			LocationType.PlayerBase,
			{x: 50, y: 50},
			{width: 20, height: 20},
			{owner: player.id},
			{player},
			MapIcon.HOME,
			true
		);

		await this.locationsService.createLocation(
			LocationType.Dungeon,
			{x: 100, y: 100},
			{width: 20, height: 20},
			{for: player.id},
			{player},
			MapIcon.BUILDING,
			true
		);

		log('info', `Player ${player.login} registered`);
		return player;
	}

	private async generateHash(password: string): Promise<string> {
		return await hash(password, 10);
	}
}
