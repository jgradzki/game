import { Item } from '../../item.entity';
import { IItemController, ItemController } from '../../interfaces/item.interface';
import { IMeleeWeapon, MeleeCombatEffects } from '../../interfaces/attributes/melee-wepon';

export class AxeItem extends ItemController implements IItemController, IMeleeWeapon {
	data: Item;

	static maxStack = 1;
	static rarity = 50;

	combat: MeleeCombatEffects = {
		attack: 10,
		speed: 3
	};

	constructor(item: Item) {
		super(item);
	}

	get maxStack() {
		return AxeItem.maxStack;
	}

	get rarity() {
		return AxeItem.rarity;
	}
}
