import { log } from '../../logger';

let exitLocationReq = (req, res, server, player) => {
	if (!player.isAlive()) {
		res.send({
			error: true,
			errorMessage: 'Jesteś martwy(na śmierć).'
		});
		return;
	}

	if (!player.isInLocation()) {
		res.send({ error: 'You are not in any location!' });
	} else {
		server.gameManager.locationManager.getLocation(player.location, player.locationType)
			.then(location => {
				location.onPlayerExit(player);
				player.exitLocation();
				res.send({ success: true });
			})
			.catch(error => {
				log('error', error);
				res.send({error: 'Internal server error, please contact developers.'});
			});

	}
};

export default exitLocationReq;
