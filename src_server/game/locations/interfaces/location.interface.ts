import { Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { MapElement } from '../../map/MapElement.entity';
import { Player } from '../../player/player.entity';

export abstract class ILocation {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(type => MapElement)
    @JoinColumn({ name: 'map_element' })
    mapElement: MapElement;

    abstract afterLocationCreate(): Promise<void>;
	abstract onPlayerEnter(player: Player): Promise<void>;
	abstract onPlayerExit(player: Player): Promise<void>;
	abstract getDataForPlayer(player: Player): Promise<any>;
	abstract getType(): string;
}
