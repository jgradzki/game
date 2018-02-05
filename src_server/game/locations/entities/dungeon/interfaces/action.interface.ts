import { Dungeon } from '../dungeon.entity';
import { Player } from '../../../../player/player.entity';

export class Action {
	protected location: Dungeon;

	constructor(location: Dungeon) {
		this.location = location;
	}

	async execute(player: Player, requestData: any): Promise<any> {
		return {
			error: 'execute-not-overwritten'
		};
	}
}
