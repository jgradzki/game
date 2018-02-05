import { ItemController } from '../interfaces/item.interface';
import { ItemFactory } from '../interfaces/item-factory.interface';
import { WoodItemFactory, WoodItem } from './wood';
import { SmallCanItemFactory, SmallCanItem } from './small-can';
import { LargeCanItemFactory, LargeCanItem } from './large-can';
import { AxeItemFactory, AxeItem } from './axe';
import { JunkItemFactory, JunkItem } from './junk';
import { HacksawItem, HacksawItemFactory } from './hacksaw';

export enum ItemTypes {
	wood = 'wood',
	smallCan = 'smallCan',
	largeCan = 'largeCan',
	axe = 'axe',
	junk = 'junk',
	hacksaw = 'hacksaw'
}

export const items: {[s: string]: typeof ItemController} = {
	wood: WoodItem,
	smallCan: SmallCanItem,
	largeCan: LargeCanItem,
	axe: AxeItem,
	junk: JunkItem,
	hacksaw: HacksawItem
};

const itemsFactories: { [s: string]: typeof ItemFactory } = {
	wood: WoodItemFactory,
	smallCan: SmallCanItemFactory,
	largeCan: LargeCanItemFactory,
	axe: AxeItemFactory,
	junk: JunkItemFactory,
	hacksaw: HacksawItemFactory
};

export default itemsFactories;
