import { Item } from '../../item.entity';
import { IItem } from '../../interfaces/item.interface';

export class WoodItem extends IItem {
	data: Item;

	constructor(item: Item) {
		super(item);
	}
}
