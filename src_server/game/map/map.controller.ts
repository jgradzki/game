import { Get, Request, Response, Controller, UseGuards } from '@nestjs/common';
import * as path from 'path';

import { LoggedInGuard } from '../guards/loggedin.guard';

import { MapService } from './map.service';

@Controller('game/map')
@UseGuards(LoggedInGuard)
export class MapController {
	constructor(private readonly mapService: MapService) {}

	@Get('elements')
	async game(@Request() req, @Response() res) {
		res.send({
			elements: []
		});
	}

}
