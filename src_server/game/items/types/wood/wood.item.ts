import { Item } from '../../item.entity';
import { IItemController, ItemController } from '../../interfaces/item.interface';

export class WoodItem extends ItemController implements IItemController {
	data: Item;

	static maxStack = 5;
	static rarity = 40;

	constructor(item: Item) {
		super(item);
	}

	get maxStack() {
		return WoodItem.maxStack;
	}

	get rarity() {
		return WoodItem.rarity;
	}
}
