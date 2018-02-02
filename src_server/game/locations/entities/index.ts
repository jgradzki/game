import { PlayerBaseModule } from './player-base';
import { DungeonModule } from './dungeon';

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

export const locationsModules = [
	PlayerBaseModule,
	DungeonModule
];
