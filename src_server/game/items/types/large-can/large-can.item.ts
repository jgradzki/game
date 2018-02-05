import { Item } from '../../item.entity';
import { IItemController, ItemController } from '../../interfaces/item.interface';
import { IEatable, EatEffects } from '../../interfaces/attributes/eatable';
import { Player } from '../../../player/player.entity';

export class LargeCanItem extends ItemController implements IItemController, IEatable {
	data: Item;

	static maxStack = 4;
	static rarity = 10;

	eatEffects = {
		hunger: 65
	};

	constructor(item: Item) {
		super(item);
	}

	get maxStack() {
		return LargeCanItem.maxStack;
	}

	get rarity() {
		return LargeCanItem.rarity;
	}

	eat(player: Player): boolean {
		player.affect(this.eatEffects);

		return true;
	}
}
