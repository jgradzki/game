import { ItemFactory } from '../interfaces/item-factory.interface';
import { WoodItemFactory, WoodItem } from './wood';

export enum ItemTypes {
	wood = 'wood'
}

export const items = {
	wood: WoodItem
};

const itemsFactorys: { [s: string]: typeof ItemFactory } = {
	wood: WoodItemFactory
};

export default itemsFactorys;
