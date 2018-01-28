import { ItemFactory } from '../interfaces/item-factory.interface';
import { WoodItemFactory } from './wood/wood.factory';

export enum ItemTypes {
	wood = 'wood'
}

const items: { [s: string]: typeof ItemFactory } = {
	wood: WoodItemFactory
};

export default items;
