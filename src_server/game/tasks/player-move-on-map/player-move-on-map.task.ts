import { Component } from '@nestjs/common';
import { forEach, round } from 'lodash';
import { log } from '../../../logger';

import { ITask } from '../task.interface';
import { MapPosition } from '../../map/interfaces/map-position.interface';

import { PlayersService } from '../../player/players.service';
import { Player } from '../../player/player.entity';
import { ConfigService } from '../../config/config.service';

/**
 * @todo Change depending on tics difference to distance.
 */
@Component()
export class PlayerMoveOnMapTask implements ITask {
	private isRunning = false;
	private lastTick = 0;
	private currentTick = 0;

	constructor(
		private readonly configService: ConfigService,
		private readonly playersService: PlayersService
	) {}

	start() {
		this.isRunning = true;
		process.nextTick(() => this.task());
	}

	stop() {
		this.isRunning = false;
	}

	private task() {
		if (!this.isRunning) {
			return;
		}

		this.currentTick = (new Date()).getTime();

		if (this.lastTick === 0) {
			this.lastTick = this.currentTick;
		}

		const players = this.playersService.onlinePlayers();

		forEach(players, player => this.processPlayer(player));

		const end = (new Date()).getTime();

		if ((end - this.currentTick) > 200) {
			log('warn', `playerMoveTask trwało: ${(end - this.currentTick)}`);
		} else if ((end - this.currentTick) > 150) {
			log('info', `playerMoveTask trwało: ', ${(end - this.currentTick)}`);
		}
		this.lastTick = this.currentTick;

		setTimeout(() => this.task(), 500);
	}

	private processPlayer(player: Player) {
		if (!player.sendingPositionTime) {
			player.sendingPositionTime = this.currentTick;
		}

		const position = player.mapPosition;
		const target = player.mapTarget;

		if (!target) {
			return;
		}

		player.mapPosition = this.getNewPosition(position, target);
		//this.processHunger(player); //some handlers not implemented yet.

		if ((player.mapPosition.x === target.x) && (player.mapPosition.y === target.y)) {
			player.mapTarget = undefined;
			this.emitPlayerArrivedDestination(player);
		}
	}

	private getNewPosition(position: MapPosition, target: MapPosition): {x: number, y: number} {
		const speed = this.configService.get('player.playerSpeedOnMap', 50) * ((this.currentTick - this.lastTick) / 1000);
		const x = target.x - position.x;
		const y = target.y - position.y;
		let moveX = 0;
		let moveY = 0;

		if (x > 0) {
			if (x < speed) {
				moveX += x;
			} else {
				moveX += speed;
			}
		} else if (x < 0) {
			if (x > -(speed)) {
				moveX = x;
			} else {
				moveX -= speed;
			}
		}

		if (y > 0) {
			if (y < speed) {
				moveY += y;
			} else {
				moveY += speed;
			}
		} else if (y < 0) {
			if (y > -(speed)) {
				moveY = y;
			} else {
				moveY -= speed;
			}
		}

		return {
			x: (position.x + moveX),
			y: (position.y + moveY)
		};
	}

	private processHunger(player: Player) {
		player.hunger += round(this.configService.get('player.hungerOnMapRate', 0.1) * ((this.currentTick - this.lastTick) / 1000), 3);

		if (player.hunger > 90) {
			player.hp -= round(this.configService.get('player.hungerDamage.90', 1) * ((this.currentTick - this.lastTick) / 1000), 3);
			player.socket.emit('action', {
				type: 'appAction/SET_PLAYER_HP',
				hp: player.hp,
			});
		} else if (player.hunger > 70) {
			player.hp -= round(this.configService.get('player.hungerDamage.70', 1) * ((this.currentTick - this.lastTick) / 1000), 3);
			player.socket.emit('action', {
				type: 'appAction/SET_PLAYER_HP',
				hp: player.hp,
			});
		} else if (player.hunger > 50) {
			player.hp -= round(this.configService.get('player.hungerDamage.50', 1) * ((this.currentTick - this.lastTick) / 1000), 3);
			player.socket.emit('action', {
				type: 'appAction/SET_PLAYER_HP',
				hp: player.hp,
			});
		}

		this.emitHungerUpdate(player);
	}

	private emitHungerUpdate(player: Player) {
		if (player.socket) {
			player.socket.emit('action', {
				type: 'appAction/SET_PLAYER_HUNGER',
				hunger: player.hunger,
			});
		}
	}

	private emitPlayerArrivedDestination(player: Player) {
		if (player.socket) {
			player.socket.emit('action', {
				type: 'appAction/MAP_CHANGE_PLAYER_POSITION',
				newPosition: player.mapPosition
			});
		}
	}

	/*
	 * Will be needed when a random event on the map feature is implemented.
	 */
	private emitCorrectPosition(player: Player) {
		if (player.socket) {
			const sendingPositionOnMapInterval = this.configService.get('gameServer.sendingPositionOnMapInterval', 10) * 1000;

			player.socket.emit('action', {
				type: 'appAction/MAP_CHANGE_PLAYER_POSITION',
				newPosition: player.mapPosition
			});
			player.socket.emit('action', {
				type: 'appAction/SET_PLAYER_HUNGER',
				hunger: player.hunger
			});
			player.sendingPositionTime = this.currentTick;
		}
	}
}
