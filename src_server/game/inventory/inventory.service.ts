import { Component } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '../../db';
import { find, findIndex } from 'lodash';
import { log } from '../../logger';

import { InventoryFactory } from './inventory.factory';
import { Inventory } from './inventory.entity';
import { ItemsService, ItemController, Item } from '../items';

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

	async create(size = 10, items?: ItemController[]): Promise<Inventory> {
		const inventory = this.inventoryFactory.create(size, items);

		await this.saveInventory(inventory);

		this.loadInventory(inventory);

		return inventory;
	}

	build(size = 10, items?: ItemController[]) {
		return this.inventoryFactory.create(size, items);
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

		for(const item of inventory.items) {
			await this.itemsService.unloadItem(item);
		}

		const index = findIndex(this.inventories, pa => pa.id === toUnload.id);

		if (index > -1) {
			this.inventories.splice(index, 1);
		}
		log('debug', `Inventory ${inventory.id} unloaded.`);

		return true;
	}

	async unloadAllInventories() {
		for (const inventory of this.inventories) {
			await this.unloadInventory(inventory);
		}

		log('debug', 'Invetories unloaded.');
	}

	async saveInventory(inventory: Inventory): Promise<boolean> {
		if (inventory.constructor.name !== Inventory.name) {
			log('error', `'${inventory}' is not Inventory instance:`);
			log('error', inventory);
			return false;
		}

		inventory.setItems(inventory.items);

		await this.entityManager.save(inventory);
		log('debug', `Inventory ${inventory.id} saved.`);

		return true;
	}

	async transferItem(inventory: ItemController[], inventoryLimit: number, newItem: ItemController, newItemMaxStack: number): Promise<{
		newItems: ItemController[]
		countTaken: number
	}> {
		let itemCount = newItem.count;

		if (inventory.length > 0) {
			inventory.forEach(itemSlot => {
				if (itemCount > 0) {
					if (itemSlot.type === newItem.type) {
						if (itemSlot.count < newItemMaxStack) {
							let count = newItemMaxStack - itemSlot.count;

							if (count > itemCount) {
								count = itemCount;
							}

							itemSlot.count += count;
							itemCount -= count;
						}
					}
				}
			});
		}

		const newItems: ItemController[] = [];

		while ( ( itemCount > 0 ) && ( inventory.length < inventoryLimit ) ) {
			let count;

			if (itemCount >= newItemMaxStack) {
				count = newItemMaxStack;
			} else {
				count = itemCount;
			}

			const item = await this.itemsService.create(newItem.type, count);
			inventory.push(item);
			newItems.push(item);
			itemCount -= count;
		}

		return {
			newItems,
			countTaken: -(itemCount - newItem.count)
		};
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
