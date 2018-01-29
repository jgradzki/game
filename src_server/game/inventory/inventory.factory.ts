import { Component } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '../../db';
import { EntityManager, Repository } from 'typeorm';

import { log } from '../../logger';

import { Inventory } from './inventory.entity';
import { IItem } from '../items';

@Component()
export class InventoryFactory {
	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(Inventory)
		private readonly inventoryRepository: Repository<Inventory>
	) {}

	create(size: number, items?: IItem[]): Inventory {
		const inventory = this.inventoryRepository.create({
			size
		});

		if (items) {
			inventory.setItems(items);
		}

		return inventory;
	}
}
