import { log } from '../logger.js';

let lastTick = 0;

module.exports = (requestExecution, server) => {
	const n = (new Date()).getTime();

	if (lastTick === 0) {
		lastTick = n;
	}

	let speed = server.config.get('player.playerSpeedOnMap');

	speed = speed * ((n - lastTick) / 1000);

	let players = server.gameManager.playerManager.getOnlinePlayers();

	for (let player of players) {
		if (!player.sendingPositionTime) {
			player.sendingPositionTime = n;
		}

		let position = player.mapPosition;
		let target = player.mapTarget;

		if (!target) {
			continue;
		}

		let x = target.x - position.x;
		let y = target.y - position.y;

		let moveX = 0;
		let moveY = 0;

		if (x > 0) {
			if (x < speed) {
				moveX += x;
			} else {
				moveX += speed;
			}
		} else if (x < 0) {
			if (x > -(speed)) {
				moveX = x;
			} else {
				moveX -= speed;
			}
		}

		if (y > 0) {
			if (y < speed) {
				moveY += y;
			} else {
				moveY += speed;
			}
		} else if (y < 0) {
			if (y > -(speed)) {
				moveY = y;
			} else {
				moveY -= speed;
			}
		}

		let newX = position.x + moveX;
		let newY = position.y + moveY;

		let newPos = {
			x: newX,
			y: newY
		};

		player.mapPosition = newPos;

		if (player.socket) {
			if ((newPos.x === target.x) && (newPos.y === target.y)) {
				player.mapTarget = undefined;

				/*player.socket.emit('action', {
					type: 'appAction/MAP_CHANGE_DESTINATION',
					position: undefined
				});*/
				player.socket.emit('action', {
					type: 'appAction/MAP_CHANGE_PLAYER_POSITION',
					newPosition: newPos
				});
			} else {
				if ( (player.sendingPositionTime + ( server.config.get('gameServer.sendingPositionOnMapInterval', 10) * 1000)) < n ) {
					player.socket.emit('action', {
						type: 'appAction/MAP_CHANGE_PLAYER_POSITION',
						newPosition: newPos
					});
					player.sendingPositionTime = n;
				}
			}
		}
	}

	const end = (new Date()).getTime();

	if ((end - n) > 200) {
		log('warn', 'playerMoveTask trwało: ', (end - n));
	} else if ((end - n) > 150) {
		log('info', 'playerMoveTask trwało: ', (end - n));
	}
	lastTick = n;

	requestExecution(10);
};
