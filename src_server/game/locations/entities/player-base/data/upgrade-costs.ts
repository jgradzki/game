/*
	type -- type of item
	count -- how many is needed,
	preserve[true/false] --remove or not item from inventory after upgrade
*/
import { ItemTypes } from '../../../../items';

interface ICosts {
	[s: string]: {
		levels: Array<
			Array<{
				type: ItemTypes,
				count: number,
				preserve?: boolean
			}>
		>
	};
}

const costs: ICosts = {
	workshop : {
		levels: [
			[
				{type: ItemTypes.wood, count: 10},
				//{type: 'junk', count: 10}
			],
			[
				{type: ItemTypes.wood, count: 30},
				//{type: 'junk', count: 100},
				//{type: 'blade', count: 1, preserve: true}
			]
		]
	}
};

export default costs;
