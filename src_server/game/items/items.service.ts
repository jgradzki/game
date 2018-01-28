import { Component } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '../../db';
import { find, findIndex, forEach } from 'lodash';
import { log } from '../../logger';

import { ItemsServiceError } from './items.service.error';
import { Item } from './item.entity';
import { IItem } from './interfaces/item.interface';
import { ItemFactory } from './interfaces/item-factory.interface';
import factories from './types';

@Component()
export class ItemsService {
	readonly items: Array<IItem> = [];
	readonly factories: { [s: string]: ItemFactory } = {};

	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(Item)
		private readonly itemRepository: Repository<Item>
	) {
		forEach(factories, (Factory, name) => this.factories[name] = new Factory(this.itemRepository));
	}

	async create(type: string, count = 1): Promise<IItem> {
		if (!this.factories[type]) {
			throw new ItemsServiceError('item-not-valid-type', `Type '${type} is not valid type of item.`);
		}

		const item = this.factories[type].create(count);

		await this.saveItem(item);

		this.loadItem(item);

		return item;
	}

	async getItem(id: string): Promise<IItem> {
		const item = find(this.items, loadedItems => loadedItems.id === id);

		if (item) {
			return item;
		}

		const itemToLoad = await this.findById(id);

		if (itemToLoad) {
			this.loadItem(itemToLoad);
			return itemToLoad;
		}

		return null;
	}

	async unloadItem(item: IItem, save = true): Promise<boolean> {
		if (!(item instanceof IItem)) {
			log('error', `'${item}' is not Item instance:`);
			log('error', item);
			return false;
		}

		const toUnload = find(this.items, tu => tu.id === item.id);

		if (!toUnload) {
			log('debug', `@unloadItem: Item ${item.type}(${item.id}) not loaded.`);
			return false;
		}

		if (save) {
			await this.saveItem(toUnload);
		}

		const index = findIndex(this.items, pa => pa.id === item.id);

		if (index > -1) {
			this.items.splice(index, 1);
		} else {
			log('error', `@unloadItem: Error finding index in Items of ${item.type}(${item.id})`);
		}
		log('debug', `Item ${item.type}(${item.id}) unloaded.`);

		return true;
	}

	async unloadAllItems() {
		for (const item of this.items) {
			await this.unloadItem(item);
		}
	}

	async saveItem(item: IItem): Promise<boolean> {
		if (!(item instanceof IItem)) {
			log('error', `'${item}' is not Item instance:`);
			log('error', item);
			return false;
		}

		await this.entityManager.save(item.data);
		log('debug', `Item ${item.type}(${item.id}) saved.`);

		return true;
	}

	private loadItem(item: IItem) {
		if (!(item instanceof IItem)) {
			log('error', `'${item}' is not Item instance:`);
			log('error', item);
			return false;
		}

		if (find(this.items, pa => pa.id === item.id)) {
			log('debug', `Item ${item.type}(${item.id}) already loaded.`);
			return true;
		}

		this.items.push(item);
		log('debug', `Item ${item.type}(${item.id}) loaded.`);

		return true;
	}

	private async findById(id: string): Promise<IItem> {
		const itemData = await this.itemRepository.findOne({
			where: {
				id
			}
		});

		return this.factories[itemData.type].load(itemData);
	}
}
