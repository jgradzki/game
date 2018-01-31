import { ItemFactory } from '../interfaces/item-factory.interface';
import { WoodItemFactory, WoodItem } from './wood';
import { SmallCanItemFactory, SmallCanItem } from './small-can';

export enum ItemTypes {
	wood = 'wood',
	smallCan = 'smallCan'
}

export const items = {
	wood: WoodItem,
	smallCan: SmallCanItem
};

const itemsFactorys: { [s: string]: typeof ItemFactory } = {
	wood: WoodItemFactory,
	smallCan: SmallCanItemFactory
};

export default itemsFactorys;
