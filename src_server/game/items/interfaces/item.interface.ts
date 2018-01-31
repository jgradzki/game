import { Item } from '../item.entity';
import { IEatable, EatEffects } from './attributes/eatable';

export interface IItemController {
	maxStack: number;
	rarity: number;
	type: string;
	count: number;
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

	get eatable(): boolean {
		return ((!!(this as any).eat) && (!!(this as any).eatEffects));
	}

	getItemData() {
		let data: {
			type: string;
			count: number;
			eat?: EatEffects
		} = {
			type: this.type,
			count: this.count
		};

		if (this.eatable) {
			data.eat = (this as any).eatEffects;
		}

		return data;
	}
}
