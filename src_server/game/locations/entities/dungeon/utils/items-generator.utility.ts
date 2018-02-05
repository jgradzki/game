import { map, forEach } from 'lodash';

import { roll } from './';

import { ItemsService } from '../../../../items';
import { IRoom } from '../interfaces/room.interface';
import { ItemController } from '../../../../items';
import { items, ItemTypes } from '../../../../items/types';

class ItemsGenerator {
	itemTypesNames: Array<string> = [];

	constructor(
		private readonly itemsService: ItemsService,
		private readonly rooms: {[s: number]: {[s: number]: IRoom }}
	) {
		this.itemTypesNames = map(ItemTypes, v => v);
	}

	async generate(): Promise<{[s: number]: {[s: number]: IRoom }}> {
		for (const x in this.rooms) {
			if (this.rooms.hasOwnProperty(x)) {
				const row = this.rooms[x];

				for (const y in row) {
					if (row.hasOwnProperty(y)) {
						const room = this.rooms[x][y];
						room.items = await this.generateItems();
					}
				}
			}
		}

		return this.rooms;
	}

	private async generateItems(): Promise<ItemController[]> {
		const itemsForRoom: ItemController[] = [];

		for (const itemName of this.itemTypesNames) {
			const item = await this.generateItem(itemName);

			if (item) {
				itemsForRoom.push(item);
			}
		}

		return itemsForRoom;
	}

	private async generateItem(itemName: string): Promise<ItemController> {
		const itemModel = items[itemName];
		const itemCount = this.rollItemCount(itemModel);

		if (itemCount > 0) {
			return await this.itemsService.create(itemName, itemCount);
		}

		return null;
	}

	private rollItemCount(itemModel: typeof ItemController): number {
		let count = 0;

		while ((roll(0, 100) < itemModel.rarity)) {
			count++;
		}

		return count;
	}
}

export default (itemsService: ItemsService, rooms: {[s: number]: {[s: number]: IRoom }}):
	Promise<{[s: number]: {[s: number]: IRoom }}> =>
		(new ItemsGenerator(itemsService, rooms)).generate();
