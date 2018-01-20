import { Component } from '@nestjs/common';
import { forEach } from 'lodash';
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

	startTasks() {
		forEach(this.tasks, task => task.start());
	}

}
