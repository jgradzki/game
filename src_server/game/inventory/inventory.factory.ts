import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { log } from '../../logger';

import { Inventory } from './inventory.entity';
import { ItemController } from '../items';

@Component()
export class InventoryFactory {
	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(Inventory)
		private readonly inventoryRepository: Repository<Inventory>
	) {}

	create(size: number, items?: ItemController[]): Inventory {
		const inventory = this.inventoryRepository.create({
			size
		});

		if (items) {
			inventory.setItems(items);
		}

		return inventory;
	}
}
