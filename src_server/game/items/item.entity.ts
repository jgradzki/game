import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { ItemCategory } from './interfaces/item-category.enum';

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

	maxStack = 1;
}
