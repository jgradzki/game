import { Item } from '../item.entity';

export interface IItemController {
	maxStack: number,
	rarity: number
}

export abstract class ItemController implements IItemController {
	abstract data: Item;

	static maxStack = 1;
	static rarity = 20;

	constructor(item: Item) {
		this.data = item;
	}

	get id() {
		return this.data.id;
	}

	get type() {
		return this.data.type;
	}

	get category() {
		return this.data.category;
	}

	get count() {
		return this.data.count;
	}

	set count(count: number) {
		this.data.count = count;
	}

	get maxStack(): number {
		return ItemController.maxStack;
	}

	get rarity(): number {
		return ItemController.rarity;
	}
}
