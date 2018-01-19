import { Get, Response, Controller, UseGuards } from '@nestjs/common';
import * as path from 'path';

import { LoggedInGuard } from './guards/loggedin.guard';

@Controller('game')
@UseGuards(LoggedInGuard)
export class GameController {
	@Get('/')
	game(@Response() res) {
		res.sendFile(path.resolve(__dirname, '../server_resources/html/main.html'));
	}

	@Get('/*')
	rest(@Response() res) {
		res.sendFile(path.resolve(__dirname, '../server_resources/html/main.html'));
	}
}
