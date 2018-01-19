import { Get, Request, Response, Controller, UseGuards } from '@nestjs/common';
import * as path from 'path';

import { LoggedInGuard } from './guards/loggedin.guard';

import { PlayersService } from './player/players.service';

@Controller('game')
export class GameController {
	constructor(private readonly playersService: PlayersService) {}

	@Get('/')
	async game(@Request() req, @Response() res) {
		if (!await this.checkSession(req, res)) {
			return;
		}

		res.sendFile(path.resolve(__dirname, '../server_resources/html/main.html'));
	}

	private async checkSession(req, res): Promise<boolean> {
		if (!await LoggedInGuard.isLoggedIn(req.session, this.playersService)) {
			res.redirect('/');
			return false;
		}

		return true;
	}
}
