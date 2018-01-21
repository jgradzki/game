import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { ILocation, Location } from '../../interfaces/location.interface';
import { Player } from '../../../player/player.entity';

@Entity({ name: 'PlayerBase' })
export class PlayerBase extends Location implements ILocation {

	@Column({ name: 'bed_level' })
	bedLevel: number = 0;

	@Column({ name: 'workshop_level' })
	workshopLevel: number = 0;

	async afterLocationCreate(): Promise<void> {

	}

	async onPlayerEnter(player: Player): Promise<void> {

	}

	async onPlayerExit(player: Player): Promise<void> {

	}

	async getDataForPlayer(player: Player): Promise<any> {

	}
}
