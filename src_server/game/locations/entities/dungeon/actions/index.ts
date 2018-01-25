import { Action } from '../interfaces/action.interface';
import { DungeonChangePosition } from './dungeonChangePosition';

export const actions: {[s: string]: typeof Action} = {
	dungeonChangePosition: DungeonChangePosition
};
