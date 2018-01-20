import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  WebSocketServer,
  WsException,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import * as sharedsession from 'express-socket.io-session';
import * as Session from 'express-session';
import { RequestHandler } from 'express';
import { log } from '../../logger';

import { LoggedInGuard } from '../guards/loggedin.guard';

import { PlayersService } from '../player/players.service';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server;
	session: RequestHandler;

	constructor(private readonly playersService: PlayersService) {}

	afterInit(io: SocketIO.Server) {
		io.use(sharedsession(this.session));
	}

	async handleConnection(socket: SocketIO.Socket) {
		const sess = this.getSession(socket);

		if (!LoggedInGuard.isLoggedIn(sess, this.playersService)) {
			socket.disconnect();
			return;
		}

		const player = await this.playersService.getPlayerById(sess.playerID);

		if (player) {
			player.socket = socket;
		}
	}

	async handleDisconnect(socket: SocketIO.Socket) {
		const sess = this.getSession(socket);

		const player = await this.playersService.getPlayerById(sess.playerID);

		if (player) {
			player.socket = null;
		}
	}

	/*@SubscribeMessage('test')
	event(client: SocketIO.Socket, data): Observable<WsResponse<number>> {
		const event = 'events';
		const response = [1, 2, 3];

		return Observable.from(response).map(res => ({ event, data: res }));
	}*/

	private getSession(socket: any): any {
		return socket.handshake.session;
	}

}
