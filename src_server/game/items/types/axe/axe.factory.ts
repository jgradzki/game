import { ItemFactory } from '../../interfaces/item-factory.interface';
import { ItemCategory } from '../../interfaces/item-category.enum';
import { Item } from '../../item.entity';
import { AxeItem } from './axe.item';

export class AxeItemFactory extends ItemFactory {
	create(count = 1): AxeItem {
		const item = this.itemRepository.create({
			type: 'axe',
			category: ItemCategory.TOOL,
			count
		});

		const wood = new AxeItem(item);

		return wood;
	}

	load(item: Item): AxeItem {
		return new AxeItem(item);
	}
}
