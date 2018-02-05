import { ItemFactory } from '../../interfaces/item-factory.interface';
import { ItemCategory } from '../../interfaces/item-category.enum';
import { Item } from '../../item.entity';
import { SmallCanItem } from './small-can.item';

export class SmallCanItemFactory extends ItemFactory {
	create(count = 1): SmallCanItem {
		const item = this.itemRepository.create({
			type: 'smallCan',
			category: ItemCategory.FOOD,
			count
		});

		const smallCan = new SmallCanItem(item);

		return smallCan;
	}

	load(item: Item): SmallCanItem {
		return new SmallCanItem(item);
	}
}
