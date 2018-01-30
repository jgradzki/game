import { Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { MapElement } from '../../map/MapElement.entity';
import { Player } from '../../player/player.entity';

export abstract class ILocation {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(type => MapElement)
    @JoinColumn({ name: 'map_element' })
    mapElement: MapElement;

    @Column({type: 'boolean', nullable: false})
    isPerm = false;

    abstract afterLocationCreate(data?: any): Promise<void>;
	abstract onPlayerEnter(player: Player, data?: any): Promise<void>;
	abstract onPlayerExit(player: Player, data?: any): Promise<void>;
	abstract getDataForPlayer(player: Player, data?: any): Promise<any>;
	abstract getType(): string;
}
