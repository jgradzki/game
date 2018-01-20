import { Get, Request, Response, Session, Controller, UseGuards } from '@nestjs/common';
import * as path from 'path';
import { log } from '../logger';

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

	@Get('logout')
	async logout(@Request() req, @Response() res, @Session() session: Express.Session) {
		if (!await this.checkSession(req, res)) {
			return;
		}

		const player = await this.playersService.getPlayerById(session.playerID);

		if (player) {
			player.setOffline();
			await this.playersService.unloadPlayer(player);
			log('info', `Players online: ${this.playersService.onlineCount()}`);
		}

		session.playerID = 0;
		session.name = undefined;
		session.destroy(() => res.redirect('/'));
	}

	private async checkSession(req, res): Promise<boolean> {
		if (!await LoggedInGuard.isLoggedIn(req.session, this.playersService)) {
			res.redirect('/');
			return false;
		}

		return true;
	}
}
