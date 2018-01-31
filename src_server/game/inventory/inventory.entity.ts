import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { map, isArray, forEach , findIndex} from 'lodash';

import { Item } from '../items/item.entity';
import { ItemTypes } from '../items';
import { IItemController, ItemController } from '../items/interfaces/item.interface';

@Entity({ name: 'Inventories' })
export class Inventory {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({nullable: false})
	size: number;

	@OneToMany(type => Item, item => item.inventory)
	itemsData: Item[];

	items: ItemController[] = [];

	setItems(items: ItemController[]) {
		this.items = items;
		this.itemsData = map(items, item => item.data);
	}

	addItem(item: ItemController) {
		this.items.push(item);
		this.itemsData.push(item.data);
	}

	removeItem(item: ItemController) {
		let index = findIndex(this.items, pa => pa.id === item.id);

		if (index > -1) {
			this.items.splice(index, 1);
		}

		index = findIndex(this.itemsData, pa => pa.id === item.id);

		if (index > -1) {
			this.itemsData.splice(index, 1);
		}
	}

	getSlot(slot: number): ItemController {
		return this.items[slot];
	}

	filtreItems() {
		return map(this.items, item => item.getItemData());
	}

	has(items: Array<{type: string, count: number}>) {
		if (!isArray(items)) {
			return false;
		}

		let has = true;

		items.forEach(item => {
			let count = 0;

			forEach(this.items, inventoryItem => {
				if (item.type === inventoryItem.type) {
					count += inventoryItem.count;
				}
			});
			if (count < item.count) {
				has = false;
			}
		});

		return has;
	}
}
