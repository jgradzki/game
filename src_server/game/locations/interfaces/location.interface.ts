import { Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { MapElement } from '../../map/MapElement.entity';
import { Player } from '../../player/player.entity';

export interface ILocation {
	afterLocationCreate(): Promise<void>;
	onPlayerEnter(player: Player): Promise<void>;
	onPlayerExit(player: Player): Promise<void>;
	getDataForPlayer(player: Player): Promise<any>;
}

export abstract class Location {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(type => MapElement)
    @JoinColumn({ name: 'map_element' })
    mapElement: MapElement;
}
