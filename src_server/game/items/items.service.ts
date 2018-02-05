import { Component } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { find, findIndex, forEach, map } from 'lodash';
import { log } from '../../logger';

import { ItemsServiceError } from './items.service.error';
import { Item } from './item.entity';
import { ItemController } from './interfaces/item.interface';
import { ItemFactory } from './interfaces/item-factory.interface';
import factories from './types';

@Component()
export class ItemsService {
	readonly items: Array<ItemController> = [];
	readonly factories: { [s: string]: ItemFactory } = {};

	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(Item)
		private readonly itemRepository: Repository<Item>
	) {
		forEach(factories, (Factory, name) => this.factories[name] = new Factory(this.itemRepository));
	}

	async create(type: string, count = 1): Promise<ItemController> {
		if (!this.factories[type]) {
			throw new ItemsServiceError('item-not-valid-type', `Type '${type} is not valid type of item.`);
		}

		const item = this.factories[type].create(count);

		await this.saveItem(item);

		this.loadItem(item);

		return item;
	}

	build(type: string, count = 1): ItemController {
		if (!this.factories[type]) {
			throw new ItemsServiceError('item-not-valid-type', `Type '${type} is not valid type of item.`);
		}

		return this.factories[type].create(count);
	}

	async getItem(id: string): Promise<ItemController> {
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

	async getOrLoad(itemToLoad: Item|ItemController): Promise<ItemController> {
		let item = find(this.items, loadedItems => loadedItems.id === itemToLoad.id);

		if (item) {
			return item;
		}

		if (!(itemToLoad instanceof ItemController)) {
			item = this.loadToModel(itemToLoad);
		}

		this.loadItem(item);

		return item;
	}

	async getOrLoadArray(itemsToLoad: (Item|ItemController)[]): Promise<ItemController[]> {
		return Promise.all([...map(itemsToLoad, async (item) => await this.getOrLoad(item))]);
	}

	async unloadItem(item: ItemController, save = true): Promise<boolean> {
		if (!(item instanceof ItemController)) {
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


		const index = findIndex(this.items, pa => pa.id === toUnload.id);

		if (index > -1) {
			this.items.splice(index, 1);
		}
		log('debug', `Item ${item.type}(${item.id}) unloaded.`);

		return true;
	}

	async unloadAllItems() {
		for (const item of this.items) {
			await this.unloadItem(item);
		}

		log('debug', 'Items unloaded.');
	}

	async saveItem(item: ItemController): Promise<boolean> {
		if (!(item instanceof ItemController)) {
			log('error', `'${item}' is not Item instance:`);
			log('error', item);
			return false;
		}

		await this.entityManager.save(item.data);
		log('debug', `Item ${item.type}(${item.id}) saved.`);

		return true;
	}

	async removeItem(item: ItemController): Promise<boolean> {
		if (!(item instanceof ItemController)) {
			log('error', `'${item}' is not Item instance:`);
			log('error', item);
			return false;
		}

		const id = item.id;
		const index = findIndex(this.items, pa => pa.id === item.id);

		if (index > -1) {
			this.items.splice(index, 1);
		}

		await this.entityManager.remove(item.data);
		log('debug', `Item ${item.type}(${id}) removed.`);

		return true;
	}

	private loadItem(item: ItemController) {
		if (!(item instanceof ItemController)) {
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

	private async findById(id: string): Promise<ItemController> {
		const itemData = await this.itemRepository.findOne({
			where: {
				id
			}
		});

		return this.loadToModel(itemData);
	}

	private loadToModel(item: Item): ItemController {
		return this.factories[item.type].load(item);
	}
}
