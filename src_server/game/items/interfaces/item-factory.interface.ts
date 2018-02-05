import { Repository } from 'typeorm';
import { ItemController } from './item.interface';
import { Item } from '../item.entity';

export class ItemFactory {
	constructor(protected readonly itemRepository: Repository<Item>) {}

	create(count: number): ItemController {
		return null;
	}

	load(item: Item): ItemController {
		return null;
	}
}
