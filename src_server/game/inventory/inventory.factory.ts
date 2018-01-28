import { Component } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '../../db';
import { EntityManager, Repository } from 'typeorm';

import { log } from '../../logger';

import { Inventory } from './inventory.entity';

@Component()
export class InventoryFactory {
	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(Inventory)
		private readonly inventoryRepository: Repository<Inventory>
	) {}

	async create(size: number): Promise<Inventory> {
		const inventory = await this.inventoryRepository.create({
			size
		});

		await this.entityManager.save(inventory);

		return inventory;
	}
}
