import { Item } from '../../item.entity';
import { IItem } from '../../interfaces/item.interface';

export class WoodItem extends IItem {
	data: Item;

	static maxStack = 8;
	static rarity = 40;

	constructor(item: Item) {
		super(item);
	}
}
