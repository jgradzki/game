import { TypeOrmModule } from '../../../db';
import { map, reduce, concat } from 'lodash';

import { LocationModule } from '../interfaces/location-module.interface';
import { PlayerBaseLocation } from './player-base';
import { DungeonLocation } from './dungeon';

export const locations = {
	[PlayerBaseLocation.name]: {
		model: PlayerBaseLocation.model,
		service: PlayerBaseLocation.service,
		dependecies: PlayerBaseLocation.dependecies,
		actionController: PlayerBaseLocation.actionController
	},
	[DungeonLocation.name]: {
		model: DungeonLocation.model,
		service: DungeonLocation.service,
		dependecies: DungeonLocation.dependecies,
		actionController: DungeonLocation.actionController
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
export const services = map(locations, location => location.service);
export const dependecies = reduce(locations, (all, location) => concat(all, location.dependecies), []);
export const locationsControllers = reduce(locations, (all, location) =>
	{
		if (location.actionController) {
			return concat(all, location.actionController);
		}

		return all;
	},
	[]
);
