import { ItemFactory } from '../interfaces/item-factory.interface';
import { WoodItemFactory } from './wood/wood.factory';

const items: { [s: string]: typeof ItemFactory } = {
	wood: WoodItemFactory
};

export default items;
