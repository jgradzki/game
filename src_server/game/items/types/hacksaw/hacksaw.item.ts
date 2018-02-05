import { Item } from '../../item.entity';
import { IItemController, ItemController } from '../../interfaces/item.interface';

export class HacksawItem extends ItemController implements IItemController {
	data: Item;

	static maxStack = 1;
	static rarity = 8;

	constructor(item: Item) {
		super(item);
	}

	get maxStack() {
		return HacksawItem.maxStack;
	}

	get rarity() {
		return HacksawItem.rarity;
	}
}
