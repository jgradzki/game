import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';

import { PlayersService } from '../player/players.service';

@Guard()
export class LoggedInGuard implements CanActivate {
	constructor(private readonly playersService: PlayersService) {}

	async canActivate(dataOrRequest, context: ExecutionContext): Promise<boolean> {
		const { session } = dataOrRequest;

		if (!session || !session.playerID || !session.login) {
			return false;
		}

		const player = await this.playersService.getPlayerById(session.playerID);

		if (!player || player.login !== session.login || player.sessionId !== session.id) {
			return false;
		}

		return true;
	}
}
