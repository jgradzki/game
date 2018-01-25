import { Action } from '../interfaces/action.interface';
import { Dungeon } from '../dungeon.entity';
import { Player } from '../../../../player/player.entity';

export class DungeonChangePosition extends Action {
	location: Dungeon;

	constructor(dungeon: Dungeon) {
		super(dungeon);

		this.location = dungeon;
	}

	async execute(player: Player, requestData: any) {
		const { position } = requestData;

		if (!position || (!position.x && position.x !== 0) || (!position.y && position.y !== 0)) {
			return {
				error: 'no-position-given'
			};
		}

		if (!this.location.canMove(player, position.x, position.y)) {
			return {
				error: 'cant-move'
			};
		}

		this.location.changePlayerPosition(player, position.x, position.y);

		return {
			success: true,
			data: {
				// fight: this._checkFight(player),
				...(await this.location.getDataForPlayer(player))
			}
		};
	}
}
