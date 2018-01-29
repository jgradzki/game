import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { map } from 'lodash';

import { Item } from '../items/item.entity';
import { IItem } from '../items/interfaces/item.interface';

@Entity({ name: 'Inventories' })
export class Inventory {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({nullable: false})
	size: number;

	@OneToMany(type => Item, item => item.inventory)
    itemsData: Item[];

    items: IItem[] = [];

    setItems(items: IItem[]) {
    	this.items = items;
    	this.itemsData = map(items, item => item.data);
    }

    addItem(item: IItem) {
    	this.items.push(item);
    	this.itemsData.push(item.data);
    }

    filtreItems() {
    	return map(this.items, item => ({
			type: item.type,
			count: item.count
		}));
    }
}
