import { ItemFactory } from '../../interfaces/item-factory.interface';
import { ItemCategory } from '../../interfaces/item-category.enum';
import { Item } from '../../item.entity';
import { LargeCanItem } from './large-can.item';

export class LargeCanItemFactory extends ItemFactory {
	create(count = 1): LargeCanItem {
		const item = this.itemRepository.create({
			type: 'largeCan',
			category: ItemCategory.FOOD,
			count
		});

		const smallCan = new LargeCanItem(item);

		return smallCan;
	}

	load(item: Item): LargeCanItem {
		return new LargeCanItem(item);
	}
}
