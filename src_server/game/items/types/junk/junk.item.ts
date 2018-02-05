import { Item } from '../../item.entity';
import { IItemController, ItemController } from '../../interfaces/item.interface';

export class JunkItem extends ItemController implements IItemController {
	data: Item;

	static maxStack = 10;
	static rarity = 70;

	constructor(item: Item) {
		super(item);
	}

	get maxStack() {
		return JunkItem.maxStack;
	}

	get rarity() {
		return JunkItem.rarity;
	}
}
