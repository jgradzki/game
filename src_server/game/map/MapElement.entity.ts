import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { MapPosition } from './interfaces/map-position.interface';
import { MapIcon } from './interfaces/map-icon.enum';

@Entity({ name: 'MapElements' })
export class MapElement {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'map_position', type: 'json' })
	mapPosition: MapPosition;

	@Column({ name: 'map_icon', default: MapIcon.BUILDING })
	mapIcon: MapIcon;

	@Column({ type: 'json' })
	size = { width: 20, height: 20 };

	@Column({ type: 'json' })
	visibilityRules = {};

	@Column({ type: 'json' })
	locationTypes = [];

	isPerm = false;

	dataForPlayer(): any {
		return {
			mapPosition: this.mapPosition,
			size: this.size,
			locationTypes: this.locationTypes
		};
	}

}
