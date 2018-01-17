import { log } from '../../logger';

module.exports = (req, res, server, player) => {
	if (!player.isAlive()) {
		res.send({
			error: true,
			errorMessage: 'Jesteś martwy(na śmierć).'
		});
		return;
	}

	if (!player.canMoveOnMap()) {
		res.send({
			error: true,
			errorMessage: 'Nie możesz się poruszać gdy jesteś w lokacji.'
		});
		return;
	}

	let ms = server.config.get('world.mapSize');

	if (
		(req.body.position.x < 0) ||
		(req.body.position.y < 0) ||
		(req.body.position.x > ms.width) ||
		(req.body.position.y > ms.height)
	) {
		log('warn', 'Player %s(%s) requested destination change with wrong coordinates: %j', player.name, player.id, req.position);
		res.send({
			error: true,
			errorMessage: 'Błęde współrzędne.'
		});
	} else {
		player.mapTarget = req.body.position;
		res.send({
			success: true,
			position: req.position,
			movementSpeed: server.config.get('player.playerSpeedOnMap'),
			hungerOnMapRate: server.config.get('player.hungerOnMapRate')
		});
	}
};
