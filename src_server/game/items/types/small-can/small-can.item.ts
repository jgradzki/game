import { Item } from '../../item.entity';
import { IItemController, ItemController } from '../../interfaces/item.interface';
import { IEatable, EatEffects } from '../../interfaces/attributes/eatable';
import { Player } from '../../../player';

export class SmallCanItem extends ItemController implements IItemController, IEatable {
	data: Item;

	static maxStack = 4;
	static rarity = 20;

	eatEffects = {
		hunger: 30
	};

	constructor(item: Item) {
		super(item);
	}

	get maxStack() {
		return SmallCanItem.maxStack;
	}

	get rarity() {
		return SmallCanItem.rarity;
	}

	eat(player: Player): boolean {
		player.affect(this.eatEffects);

		return true;
	}
}
