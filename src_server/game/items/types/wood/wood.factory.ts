import { ItemFactory } from '../../interfaces/item-factory.interface';
import { ItemCategory } from '../../interfaces/item-category.enum';
import { Item } from '../../item.entity';
import { WoodItem } from './wood.item';

export class WoodItemFactory extends ItemFactory {
	create(count = 1): WoodItem {
		const item = this.itemRepository.create({
			type: 'wood',
			category: ItemCategory.MATERIAL,
			count
		});

		const wood = new WoodItem(item);

		return wood;
	}

	load(item: Item): WoodItem {
		return new WoodItem(item);
	}
}
