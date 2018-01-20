import { Post, Response, Controller, UseGuards, Session } from '@nestjs/common';
import * as path from 'path';

import { LoggedInGuard } from '../guards/loggedin.guard';

import { PlayersService } from '../player/players.service';

@Controller('game/request')
@UseGuards(LoggedInGuard)
export class RequestController {
	constructor(
		private readonly playersService: PlayersService
	) {}

	@Post('init')
	async init(@Response() res, @Session() session) {
		const player = await this.playersService.getPlayerById(session.playerID);

		res.send({
			store: {
				system: {
					showDeadWindow: !player.isAlive()
				},
				map: {
					playerPosition: player.mapPosition,
					destination: player.mapTarget,
					movementSpeed: 50 // server.config.get('player.playerSpeedOnMap')
				},
				player: {
					name: player.login,
					inventorySize: 10, // player.inventory.size,
					inventory: [], // player.inventory.filtreItems(),
					hp: player.hp,
					hunger: player.hunger,
					energy: player.energy
				}
			}
		});
	}

}
