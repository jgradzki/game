import { TypeOrmModule } from '../../../db';
import { map, reduce, concat } from 'lodash';

import { PlayerBaseLocation } from './player-base';
import { DungeonLocation } from './dungeon';

export const locations = {
	[PlayerBaseLocation.name]: {
		model: PlayerBaseLocation.model,
		services: PlayerBaseLocation.service,
		dependecies: PlayerBaseLocation.dependecies
	},
	[DungeonLocation.name]: {
		model: DungeonLocation.model,
		services: DungeonLocation.service,
		dependecies: DungeonLocation.dependecies
	}
};

export const enum LocationType {
	PlayerBase = 'PlayerBase',
	Dungeon = 'Dungeon'
}

export const stringToLocationType = (type: string): LocationType => {
	const locationTypes: { [s: string]: LocationType } = {
		PlayerBase: LocationType.PlayerBase,
		Dungeon: LocationType.Dungeon,
	};

	return locationTypes[type];
};

export const providers = TypeOrmModule.forFeature(map(locations, location => location.model));
export const services = map(locations, location => location.services);
export const dependecies = reduce(locations, (all, location) => concat(all, location.dependecies), []);
