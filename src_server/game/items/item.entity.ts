import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { ItemCategory } from './interfaces/item-category.enum';
import { Inventory } from '../inventory/inventory.entity';

@Entity({ name: 'Items' })
export class Item {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({nullable: false})
	type: string;

	@Column('varchar', {nullable: false})
	category: ItemCategory;

	@Column({nullable: false})
	count: number = 1;

	@Column('real')
	durability = 100;

	@Column('json')
	extraData = {};

	@ManyToOne(type => Inventory, inventory => inventory.itemsData)
    inventory: Inventory;

	maxStack = 1;
}
