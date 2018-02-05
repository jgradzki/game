import { Component } from '@nestjs/common';
import { log } from '../../logger';

import { ITask } from './task.interface';

import { PlayerMoveOnMapTask } from './player-move-on-map/player-move-on-map.task';

@Component()
export class TasksService {
	private readonly tasks: ITask[] = [];

	constructor(
		readonly playerMoveOnMapTask: PlayerMoveOnMapTask
	) {
		this.tasks.push(playerMoveOnMapTask);
	}

	async startTasks() {
		for (const task of this.tasks) {
			await task.start();
		}
	}

	async stopTasks() {
		for (const task of this.tasks) {
			await task.stop();
		}
	}

}
