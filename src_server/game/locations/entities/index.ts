import { TypeOrmModule } from '../../../db';
import { map, reduce, concat } from 'lodash';

import { PlayerBaseLocation } from './player-base';

export const locations = {
	[PlayerBaseLocation.name]: {
		model: PlayerBaseLocation.model,
		services: PlayerBaseLocation.service,
		dependecies: PlayerBaseLocation.dependecies
	}
};

export const enum LocationType {
	PlayerBase = 'PlayerBase',
	Dungeon = 'Dungeon'
}

export const providers = TypeOrmModule.forFeature(map(locations, location => location.model));
export const services = map(locations, location => location.services);
export const dependecies = reduce(locations, (all, location) => concat(all, location.dependecies), []);
