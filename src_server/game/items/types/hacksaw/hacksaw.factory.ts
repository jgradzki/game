import { ItemFactory } from '../../interfaces/item-factory.interface';
import { ItemCategory } from '../../interfaces/item-category.enum';
import { Item } from '../../item.entity';
import { HacksawItem } from './hacksaw.item';

export class HacksawItemFactory extends ItemFactory {
	create(count = 1): HacksawItem {
		const item = this.itemRepository.create({
			type: 'hacksaw',
			category: ItemCategory.TOOL,
			count
		});

		const wood = new HacksawItem(item);

		return wood;
	}

	load(item: Item): HacksawItem {
		return new HacksawItem(item);
	}
}
