import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Player {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 30, unique: true })
	login: string;

	@Column()
	password: string;

	@Column({ default: 100 })
	hp: number;

	@Column({ default: 0 })
	hunger: number;

	@Column({ default: 100 })
	energy: number;

	@Column({ name: 'map_position', type: 'json' })
	mapPosition: object;

	sessionId: string;

	online = false;

	public setOnline(): void {
		this.online = true;
	}
}
