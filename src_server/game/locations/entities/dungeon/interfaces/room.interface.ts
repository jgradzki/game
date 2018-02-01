import { ItemController } from '../../../../items';
import { IEnemy } from '../../../interfaces/enemy.interface';

export interface IRoom {
	doors: {
		up?: boolean,
		down?: boolean,
		left?: boolean,
		right?: boolean
	};
	lock?: boolean;
	items?: ItemController[];
	enemies?: IEnemy[];
}

export interface IRooms {
	[s: number]: {
		[s: number]: IRoom
	};
}
