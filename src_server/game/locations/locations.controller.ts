import { Post, Session, Body, Response, Controller, UseGuards } from '@nestjs/common';
import * as path from 'path';
import { log } from '../../logger';

import { LoggedInGuard } from '../guards/loggedin.guard';

import { ConfigService } from '../config/config.service';
import { PlayersService } from '../player/players.service';
import { LocationsService } from './locations.service';

import { stringToLocationType } from '../locations/entities';

@Controller('game/location')
@UseGuards(LoggedInGuard)
export class LocationsController {
	constructor(
		private readonly configService: ConfigService,
		private readonly playersService: PlayersService,
		private readonly locationsService: LocationsService
	) {}

	@Post('enter')
	async enterLocation(@Session() session, @Body() data, @Response() res) {
		const player = await this.playersService.getPlayerById(session.playerID);

		if (!player.isAlive()) {
			res.send({
				error: true,
				errorMessage: 'Jesteś martwy(na śmierć).'
			});
			return;
		}

		if (player.inLocation()) {
			res.send({
				error: true,
				errorMessage: 'Jestes juz w lokacji.'
			});
			return;
		}

		if (!data || !data.type || !data.id) {
			res.send({
				error: true,
				errorMessage: 'Wrong data.'
			});
			return;
		}

		const location = await this.locationsService.getLocation(data.type, data.id);
		const dataForPlayer = await location.getDataForPlayer(player);

		await location.onPlayerEnter(player);
		player.setInLocation(data.type, data.id);

		res.send({
			success: true,
			type: location.getType(),
			data: dataForPlayer
		});
	}

	@Post('exit')
	async exitLocation(@Session() session, @Body() data, @Response() res) {
		const player = await this.playersService.getPlayerById(session.playerID);

		if (!player.isAlive()) {
			res.send({
				error: true,
				errorMessage: 'Jesteś martwy(na śmierć).'
			});
			return;
		}

		if (!player.inLocation()) {
			res.send({
				error: true,
				errorMessage: 'Nie jesteś w żadnej lokacji.'
			});
			return;
		}

		const location = await this.locationsService.getLocation(
			stringToLocationType(player.locationType),
			player.locationId
		);

		if (location) {
			await location.onPlayerExit(player);
		}

		player.exitLocation();

		res.send({ success: true });
	}
}
