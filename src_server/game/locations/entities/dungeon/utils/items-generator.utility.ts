import { map, forEach } from 'lodash';

import { roll } from './';

import { ItemsService } from '../../../../items';
import { IRoom } from '../interfaces/room.interface';
import { IItem } from '../../../../items';
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

	private async generateItems(): Promise<IItem[]> {
		const itemsForRoom: IItem[] = [];

		for (let i = 0; i < 5; i++) {
			const item = await this.generateItem();

			if (item) {
				itemsForRoom.push(item);
			}
		}

		return itemsForRoom;
	}

	private async generateItem(): Promise<IItem> {
		const itemName = this.itemTypesNames[roll(0, this.itemTypesNames.length - 1)];
		const itemModel = items[itemName];
		const itemCount = this.rollItemCount(itemModel);

		if (itemCount > 0) {
			return await this.itemsService.create(itemName, itemCount);
		}

		return null;
	}

	private rollItemCount(itemModel: typeof IItem): number {
		let count = 0;

		while ((roll(0, 100) < itemModel.rarity) && (count < itemModel.maxStack)) {
			count++;
		}

		return count;
	}
}

export default (itemsService: ItemsService, rooms: {[s: number]: {[s: number]: IRoom }}):
	Promise<{[s: number]: {[s: number]: IRoom }}> =>
		(new ItemsGenerator(itemsService, rooms)).generate();