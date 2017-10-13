import { log } from '../../logger';

module.exports = (req, res, server, player) => {
	if (!player.isAlive()) {
		res.send({
			error: true,
			errorMessage: 'Jesteś martwy(na śmierć).'
		});
		return;
	}

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
		.then(location => location.changePlayerPosition(player, req.body.position.x, req.body.position.y))
		.then(results => {
			if (results.cant) {
				res.send({
					error: true,
					code: 4103,
					msg: 'You cant move.'
				});
			} else {
				const { data } = results;

				res.send({
					success: true,
					data
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
