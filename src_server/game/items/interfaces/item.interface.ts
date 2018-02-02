import { Item } from '../item.entity';
import { EatEffects } from './attributes/eatable';
import { MeleeCombatEffects } from './attributes/melee-wepon';

export interface IItemController {
	maxStack: number;
	rarity: number;
	type: string;
	count: number;
}

export abstract class ItemController implements IItemController {
	data: Item;

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

	get durability(): number {
		return this.data.durability;
	}

	set durability(count: number) {
		this.data.durability = count;
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

	get isMeleeWepon(): boolean {
		return (!!(this as any).combat);
	}

	getItemData() {
		let data: {
			id: string;
			type: string;
			count: number;
			eat?: EatEffects;
			combat?: MeleeCombatEffects;
		} = {
			id: this.id,
			type: this.type,
			count: this.count
		};

		if (this.eatable) {
			data.eat = (this as any).eatEffects;
		}
		if (this.isMeleeWepon) {
			data.combat = (this as any).combat;
		}

		return data;
	}
}
