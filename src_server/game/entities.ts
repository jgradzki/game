import { Item } from './items';
import { Inventory } from './inventory';
import { Player } from './player/player.entity';
import { MapElement } from './map/MapElement.entity';
import { PlayerBase } from './locations/entities/player-base/player-base.entity';
import { Dungeon } from './locations/entities/dungeon/dungeon.entity';

export const entities = [
	Item,
	Inventory,
	Player,
	MapElement,
	PlayerBase,
	Dungeon
];
