import { Get, Session, Response, Controller, UseGuards } from '@nestjs/common';
import * as path from 'path';

import { LoggedInGuard } from '../guards/loggedin.guard';

import { MapService } from './map.service';

@Controller('game/map')
@UseGuards(LoggedInGuard)
export class MapController {
	constructor(private readonly mapService: MapService) {}

	@Get('elements')
	async game(@Session() session, @Response() res) {
		const elements = await this.mapService.getElementsForPlayer(session.playerID, true) || [];

		res.send({
			elements
		});
	}

}
