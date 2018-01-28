import { Repository } from 'typeorm';
import { IItem } from './item.interface';
import { Item } from '../item.entity';

export class ItemFactory {
	constructor(protected readonly itemRepository: Repository<Item>) {}

	create(count: number): IItem {
		return null;
	}

	load(item: Item): IItem {
		return null;
	}
}
