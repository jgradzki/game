import { Post, Response, Controller, UseGuards, Session } from '@nestjs/common';
import * as path from 'path';

import { LoggedInGuard } from '../guards/loggedin.guard';

import { ConfigService } from '../config/config.service';
import { PlayersService } from '../player/players.service';
import { LocationsService } from '../locations/locations.service';
import { stringToLocationType } from '../locations/entities';

@Controller('game/request')
@UseGuards(LoggedInGuard)
export class RequestController {
	constructor(
		private readonly playersService: PlayersService,
		private readonly configService: ConfigService,
		private readonly locationsService: LocationsService,
	) {}

	@Post('init')
	async init(@Response() res, @Session() session) {
		const player = await this.playersService.getPlayerById(session.playerID);

		const initData = {
			store: {
				system: {
					showDeadWindow: !player.isAlive()
				},
				map: {
					playerPosition: player.mapPosition,
					destination: player.mapTarget,
					movementSpeed: this.configService.get('player.playerSpeedOnMap', '50')
				},
				player: {
					name: player.login,
					inventorySize: player.inventory.size,
					inventory: player.inventory.filtreItems(),
					hp: player.hp,
					hunger: player.hunger,
					energy: player.energy
				}
			},
			inLocation: null,
			location: null
		};

		if (player.inLocation()) {
			const location = await this.locationsService.getLocation(
				stringToLocationType(player.locationType),
				player.locationId
			);

			if (!location) {
				player.locationId = null;
				player.locationType = null;
			} else {
				initData.inLocation = true;
				initData.location = {
					type: location.getType(),
					data: await location.getDataForPlayer(player)
				};
			}
		}

		res.send(initData);
	}

}
