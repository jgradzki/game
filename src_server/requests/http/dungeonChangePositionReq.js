import { log } from '../../logger';

module.exports = (req, res, server, player) => {
	if (!player.isInLocation()) {
		res.send({ 
			error: true, 
			code: 4101, 
			msg: 'Not in location.' 
		});
		return;
	}

	if (
		!req.body.position ||
		(!req.body.position.x && req.body.position.x !== 0) ||
		(!req.body.position.y && req.body.position.y !== 0)
	) {
		res.send({ 
			error: true, 
			code: 4102, 
			msg: 'Wrong data.' 
		});
		return;
	}

	server.gameManager.locationManager.getLocation(player.location, player.locationType)
		.then(location => {
			if (location.changePlayerPosition(player, req.body.position.x, req.body.position.y)) {
				res.send({
					success: true,
					position: {
						x: req.body.position.x,
						y: req.body.position.y
					}
				});

			/*for (let p in location.players) {
				if (p !== player.id) {
					if (location.players[p] === position) {
						//playerManager.getPlayer(p);
						//p.socket.emit('player join room')
					}
				}
			};*/

			} else {
				res.send({ 
					error: true, 
					code: 4103, 
					msg: 'You cant move.' 
				});	
			}
		})
		.catch(error => {
			log('error', error);
			res.send({ 
				error: true, 
				code: 4104, 
				msg: 'Internal server error.' 
			});
		});
};
