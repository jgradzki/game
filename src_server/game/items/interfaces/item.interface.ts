import { Item } from '../item.entity';

export abstract class IItem {
	abstract data: Item;

	constructor(item: Item) {
		this.data = item;
	}

	get id() {
		return this.data.id;
	}

	get type() {
		return this.data.type;
	}
}
