import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { ILocation, Location } from '../../interfaces/location.interface';
import { Player } from '../../../player/player.entity';

@Entity({ name: 'PlayerBase' })
export class PlayerBase extends Location implements ILocation {
	@OneToOne(type => Player, player => player.base)
	@JoinColumn({ name: 'player_id '})
	player: Player;

	@Column({ name: 'bed_level' })
	bedLevel: number = 0;

	@Column({ name: 'workshop_level' })
	workshopLevel: number = 0;

	getType(): string {
		return 'PlayerBase';
	}

	async afterLocationCreate(): Promise<void> {

	}

	async onPlayerEnter(player: Player): Promise<void> {

	}

	async onPlayerExit(player: Player): Promise<void> {

	}

	async getDataForPlayer(player: Player): Promise<any> {

	}
}
