import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

import { MapPosition } from '../map/interfaces/map-position.interface';
import { PlayerBase } from '../locations/entities/player-base/player-base.entity';
import { Inventory } from '../inventory';
import { Item, ItemController } from '../items';

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

    @OneToOne(type => Inventory)
    @JoinColumn()
    inventory: Inventory;

    @Column({ name: 'location_id', nullable: true })
    locationId: string = null;

    @Column({ name: 'location_type', nullable: true })
    locationType: string = null;

    @OneToOne(type => Item, { nullable: true })
    @JoinColumn()
    meleeWeaponData: Item;

    meleeWeapon: ItemController;

	sessionId: string;
	ip: string;
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

	setInLocation(type: string, id: string) {
		this.locationId = id;
		this.locationType = type;
	}

	exitLocation() {
		this.locationId = null;
		this.locationType = null;
	}

	inLocation(): boolean {
		return !!this.locationId;
	}

	setMeleeWeapon(item: ItemController): ItemController {
		let old: ItemController = null;

		if (this.meleeWeapon) {
			old = this.meleeWeapon;
		}

		if (!item) {
			this.meleeWeapon = null;
			this.meleeWeaponData = null;
		} else {
			this.meleeWeapon = item;
			this.meleeWeaponData = item.data;
		}

		return old;
	}

	affect(actions: {
		hunger?: number
	}) {
		if (!actions) {
			return;
		}

		if (actions.hunger) {
			this.hunger -= actions.hunger;
		}

		if (this.hunger > 100) {
			this.hunger = 100;
		}
		if (this.hunger < 0) {
			this.hunger = 0;
		}
	}
}
