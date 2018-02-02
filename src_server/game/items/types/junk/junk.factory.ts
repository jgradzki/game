import { ItemFactory } from '../../interfaces/item-factory.interface';
import { ItemCategory } from '../../interfaces/item-category.enum';
import { Item } from '../../item.entity';
import { JunkItem } from './junk.item';

export class JunkItemFactory extends ItemFactory {
	create(count = 1): JunkItem {
		const item = this.itemRepository.create({
			type: 'junk',
			category: ItemCategory.MATERIAL,
			count
		});

		const wood = new JunkItem(item);

		return wood;
	}

	load(item: Item): JunkItem {
		return new JunkItem(item);
	}
}
