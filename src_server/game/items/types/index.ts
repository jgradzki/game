import { ItemController } from '../interfaces/item.interface';
import { ItemFactory } from '../interfaces/item-factory.interface';
import { WoodItemFactory, WoodItem } from './wood';
import { SmallCanItemFactory, SmallCanItem } from './small-can';
import { AxeItemFactory, AxeItem } from './axe';

export enum ItemTypes {
	wood = 'wood',
	smallCan = 'smallCan',
	axe = 'axe'
}

export const items: {[s: string]: typeof ItemController} = {
	wood: WoodItem,
	smallCan: SmallCanItem,
	axe: AxeItem
};

const itemsFactorys: { [s: string]: typeof ItemFactory } = {
	wood: WoodItemFactory,
	smallCan: SmallCanItemFactory,
	axe: AxeItemFactory,
};

export default itemsFactorys;
