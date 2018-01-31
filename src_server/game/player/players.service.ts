import { Component } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '../../db';
import {  EntityManager, Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { find, reduce, filter, findIndex } from 'lodash';

import { log } from '../../logger';

import { Player } from './player.entity';
import { PlayerFactory } from './player.factory';

import { InventoryService } from '../inventory';

@Component()
export class PlayersService {
	private readonly players: Player[] = [];

	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(Player)
		private readonly playerRepository: Repository<Player>,
		private readonly playerFactory: PlayerFactory,
		private readonly inventoryService: InventoryService
	) {}

	async create(login: string, password: string, options?: object): Promise<Player> {
		const player = await this.playerFactory.create(login, password, options);

		return player;
	}

	loadedList(): Array<Player> {
		return this.players;
	}

	onlineCount(): number {
		return reduce(this.players, (sum, player) => sum += (player.online ? 1 : 0), 0);
	}

	onlinePlayers(): Player[] {
		return filter(this.players, player => player.online);
	}

	loadPlayer(player: Player): boolean {
		if (player.constructor.name !== Player.name) {
			log('error', `${player} is not Player instance:`);
			log('error', player);
			return false;
		}

		if (find(this.players, pa => pa.id === player.id)) {
			log('debug', `Player ${player.login}(${player.id}) already loaded.`);
			return true;
		}

		this.players.push(player);
		log('debug', `Player ${player.login} loaded.`);

		return true;
	}

	async unloadPlayer(player: Player, save = true): Promise<boolean> {
		if (player.constructor.name !== Player.name) {
			log('error', `${player} is not Player instance:`);
			log('error', player);
			return false;
		}

		const toUnload = find(this.players, (ptu: Player) => ptu.id === player.id);

		if (!toUnload) {
			log('debug', `@unloadPlayer: Player ${player.login} not loaded.`);
			return false;
		}

		if (save) {
			await this.savePlayer(toUnload);
		}

		const index = findIndex(this.players, pa => pa.id === player.id);

		if (index > -1) {
			this.players.splice(index, 1);
		} else {
			log('error', `@unloadPlayer: Error finding index in Players of ${player.id}`);
		}
		log('debug', `Player ${toUnload.login} unloaded.`);

		return true;
	}

	async unloadAllPlayers() {
		for (const player of this.players) {
			await this.unloadPlayer(player);
		}

		log('debug', 'Players unloaded.');
	}

	async savePlayer(player: Player): Promise<boolean> {
		if (player.constructor.name !== Player.name) {
			log('error', `${player} is not Player instance:`);
			log('error', player);
			return false;
		}

		await this.entityManager.save(player);
		log('debug', `Player ${player.login} saved.`);

		return true;
	}

	async getPlayerById(id: string): Promise<Player> {
		const player = find(this.players, loadedPlayer => loadedPlayer.id === id);

		if (player) {
			return player;
		}

		const playerToLoad = await this.findById(id);

		if (playerToLoad) {
			playerToLoad.inventory = await this.inventoryService.getInventory(playerToLoad.inventory.id);
			this.loadPlayer(playerToLoad);
			return playerToLoad;
		}

		return null;
	}

	async getPlayerByLogin(login: string): Promise<Player> {
		const player = find(this.players, (loadedPlayer: Player) => loadedPlayer.login === login);

		if (player) {
			return player;
		}

		const playerToLoad = await this.findByLogin(login);

		if (playerToLoad) {
			playerToLoad.inventory = await this.inventoryService.getInventory(playerToLoad.inventory.id);
			this.loadPlayer(playerToLoad);

			return playerToLoad;
		}

		return null;
	}

	async checkPassword(password: string, hashedPassword: string): Promise<boolean> {
		return await compare(password, hashedPassword);
	}

	private async findById(id: string): Promise<Player> {
		return await this.playerRepository.findOne({
			where: {
				id
			},
			relations: ['inventory']
		});
	}

	private async findByLogin(login: string): Promise<Player> {
		return await this.playerRepository.findOne({
			where: {
				login
			},
			relations: ['inventory']
		});
	}
}
