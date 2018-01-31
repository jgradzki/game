import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { ILocation } from '../../interfaces/location.interface';
import { Player } from '../../../player/player.entity';

import UpgradeCosts from './data/upgrade-costs';

@Entity({ name: 'PlayerBase' })
export class PlayerBase extends ILocation {
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

	getEquipmentLevel(equipment: string) {
		switch (equipment) {
			case 'bed':
				return this.bedLevel;
			case 'workshop':
				return this.workshopLevel;
			default:
				return -1;
		}
	}

	isUpgradeable(equipment: string, currentLevel: number) {
		if (!UpgradeCosts[equipment] || (!currentLevel && currentLevel !== 0)) {
			return false;
		}

		if (!UpgradeCosts[equipment].levels || !UpgradeCosts[equipment].levels[currentLevel]) {
			return false;
		}

		return true;
	}

	getUpgradeCosts(equipment: string, currentLevel: number) {

		if (!this.isUpgradeable(equipment, currentLevel)) {
			return [];
		}

		if (UpgradeCosts[equipment].levels[currentLevel]) {
			return UpgradeCosts[equipment].levels[currentLevel].map(item => ({
				type: item.type,
				count: item.count
			}));
		}

		return [];
	}

	upgrade(equipment): number {
		switch (equipment) {
			case 'bed':
				this.bedLevel += 1;
				return this.bedLevel;
			case 'workshop':
				this.workshopLevel += 1;
				return this.workshopLevel;
			default:
				return -1;
		}
	}
}
