import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

import { MapPosition } from '../map/interfaces/map-position.interface';
import { PlayerBase } from '../locations/entities/player-base/player-base.entity';

@Entity({ name: 'Players' })
export class Player {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 30, unique: true })
	login: string;

	@Column()
	password: string;

	@Column({ default: 100, type: 'real' })
	hp: number;

	@Column({ default: 0, type: 'real' })
	hunger: number;

	@Column({ default: 100, type: 'real' })
	energy: number;

	@Column({ name: 'map_position', type: 'json' })
	mapPosition: MapPosition;

	@OneToOne(type => PlayerBase, base => base.player) // specify inverse side as a second parameter
    base: PlayerBase;

	sessionId: string;
	socket: SocketIO.Socket;

	online = false;

	mapTarget: MapPosition = null;
	sendingPositionTime = 0;

	setOnline(): void {
		this.online = true;
	}

	setOffline(): void {
		this.online = false;
	}

	isAlive() {
		return this.hp > 0;
	}
}
