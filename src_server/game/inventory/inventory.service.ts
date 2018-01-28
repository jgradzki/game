import { Component } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '../../db';
import { find, findIndex } from 'lodash';
import { log } from '../../logger';

import { InventoryFactory } from './inventory.factory';
import { Inventory } from './inventory.entity';
import { ItemsService } from '../items';

@Component()
export class InventoryService {
	readonly inventories: Array<Inventory> = [];

	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(Inventory)
		private readonly inventoryRepository: Repository<Inventory>,
		private readonly inventoryFactory: InventoryFactory,
		private readonly itemsService: ItemsService,
	) {}

	async create(size = 10): Promise<Inventory> {
		const inventory = await this.inventoryFactory.create(size);

		await this.saveInventory(inventory);

		this.loadInventory(inventory);

		return inventory;
	}

	async getInventory(id: string): Promise<Inventory> {
		const inventory = find(this.inventories, loadedInventories => loadedInventories.id === id);

		if (inventory) {
			return inventory;
		}

		const inventoryToLoad = await this.findById(id);
		const items = await this.itemsService.getOrLoadArray(inventoryToLoad.itemsData);
		inventoryToLoad.setItems(items);

		if (inventoryToLoad) {
			this.loadInventory(inventoryToLoad);
			return inventoryToLoad;
		}

		return null;
	}

	async unloadInventory(inventory: Inventory, save = true): Promise<boolean> {
		if (inventory.constructor.name !== Inventory.name) {
			log('error', `'${inventory}' is not Inventory instance:`);
			log('error', inventory);
			return false;
		}

		const toUnload = find(this.inventories, tu => tu.id === inventory.id);

		if (!toUnload) {
			log('debug', `@unloadInventory: Inventory ${inventory.id} not loaded.`);
			return false;
		}

		if (save) {
			await this.saveInventory(toUnload);
		}

		const index = findIndex(this.inventories, pa => pa.id === inventory.id);

		if (index > -1) {
			this.inventories.splice(index, 1);
		} else {
			log('error', `@unloadInventory: Error finding index in Inventories of ${inventory.id}`);
		}
		log('debug', `Inventory ${inventory.id} unloaded.`);

		return true;
	}

	async unloadAllInventories() {
		for (const inventory of this.inventories) {
			await this.unloadInventory(inventory);
		}
	}

	async saveInventory(inventory: Inventory): Promise<boolean> {
		if (inventory.constructor.name !== Inventory.name) {
			log('error', `'${inventory}' is not Inventory instance:`);
			log('error', inventory);
			return false;
		}

		await this.entityManager.save(inventory);
		log('debug', `Inventory ${inventory.id} saved.`);

		return true;
	}

	private loadInventory(inventory: Inventory) {
		if (inventory.constructor.name !== Inventory.name) {
			log('error', `'${inventory}' is not Inventory instance:`);
			log('error', inventory);
			return false;
		}

		if (find(this.inventories, pa => pa.id === inventory.id)) {
			log('debug', `Inventory ${inventory.id} already loaded.`);
			return true;
		}

		this.inventories.push(inventory);
		log('debug', `Inventory ${inventory.id} loaded.`);

		return true;
	}

	private async findById(id: string): Promise<Inventory> {
		return await this.inventoryRepository.findOne({
			where: {
				id
			},
			relations: ['itemsData']
		});
	}

}
