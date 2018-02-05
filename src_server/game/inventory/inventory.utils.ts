import { Component } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { forEach } from 'lodash';
import { log } from '../../logger';

import { Inventory } from './inventory.entity';
import { ItemsService, ItemController, Item, ItemTypes } from '../items';

@Component()
export class InventoryUtils {
	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(Inventory)
		private readonly inventoryRepository: Repository<Inventory>,
		private readonly itemsService: ItemsService
	) {}

	async removeItems(inventory: Inventory, items: ItemController[]) {
		for (const item of items) {
			await this.removeItem(inventory, item);
		}
	}

	async removeItem(inventory: Inventory, item: ItemController) {
		if (inventory.has([{type: item.type, count: 0}])) {
			inventory.removeItem(item);
			await this.itemsService.removeItem(item);
		}
	}

	async takeCount(inventory: Inventory, type: ItemTypes, count: number): Promise<boolean> {
		if (!this.checkType(inventory.items, type, count)){
			return false;
		}

		let taken = 0;

		for (const item of inventory.items) {
			if ((item.type === type) && (taken < count)) {
				if (item.count > (count - taken)) {
					const itemCount = item.count;

					item.count -= (count - taken);
					taken += itemCount;
				} else {
					taken += item.count;
					await this.removeItem(inventory, item);
				}
			}
		}

		return true;
	}

	async takeMany(inventory: Inventory, items: Array<{ type: ItemTypes, count: number}>): Promise<boolean> {
		if (!this.checkTypeArray(inventory.items, items)){
			return false;
		}

		for (const item of items) {
			await this.takeCount(inventory, item.type, item.count);
		}

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

	countType(items: ItemController[], search: ItemTypes): number {
		let count = 0;

		forEach(items, itemSlot => {
			if (itemSlot.type === search) {
				count += itemSlot.count;
			}
		});

		return count;
	}

	checkType(items: ItemController[], search: ItemTypes, count: number): boolean {
		return (this.countType(items, search) >= count);
	}

	checkTypeArray(items: ItemController[], check: Array<{type: ItemTypes, count: number}>): boolean {
		let valid = true;

		forEach(check, item => {
			if (!this.checkType(items, item.type, item.count)) {
				valid = false;
			}
		});

		return valid;
	}
}
