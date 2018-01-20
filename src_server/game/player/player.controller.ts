import { Post, Session, Body, Response, Controller, UseGuards } from '@nestjs/common';
import * as path from 'path';
import { log } from '../../logger';

import { LoggedInGuard } from '../guards/loggedin.guard';

import { ConfigService } from '../config/config.service';
import { PlayersService } from './players.service';

import { ChangeDestinationDto } from './dto/chnage-destination.dto';

@Controller('game/player')
@UseGuards(LoggedInGuard)
export class PlayerController {
	constructor(
		private readonly configService: ConfigService,
		private readonly playersService: PlayersService
	) {}

	@Post('changeDestination')
	async game(@Session() session, @Body() destination: ChangeDestinationDto, @Response() res) {
		const player = await this.playersService.getPlayerById(session.playerID);
		const ms = this.configService.get('world.mapSize');
		const { position } = destination;

		if (!player.isAlive()) {
			res.send({
				error: true,
				errorMessage: 'Jesteś martwy(na śmierć).'
			});
			return;
		}

		if (!position || !position.x || !position.y) {
			res.send({
				error: true,
				errorMessage: 'Wrong coordinates.'
			});
			return;
		}

		if (
			(position.x < 0) ||
			(position.y < 0) ||
			(position.x > ms.width) ||
			(position.y > ms.height)
		) {
			log('warn', `Player ${player.login}(${player.id}) requested destination change with wrong coordinates:`);
			log('warn', position);

			res.send({
				error: true,
				errorMessage: 'Błęde współrzędne.'
			});
		} else {
			res.send({
				success: true,
				position,
				movementSpeed: this.configService.get('player.playerSpeedOnMap'),
				hungerOnMapRate: this.configService.get('player.hungerOnMapRate')
			});
			player.mapTarget = position;
		}
	}

}
