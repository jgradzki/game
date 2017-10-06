import { log } from '../../logger';

const calculateCorners = (x, y, size) => {
	let cLeftTop = {
		x: x - (size.width / 2),
		y: y - (size.height / 2)
	};
	let cRightBottom = {
		x: x + (size.width / 2),
		y: y + (size.height / 2)
	};

	return {
		cLeftTop,
		cRightBottom
	};
};

const checkPlayer = (player, elementId, elements) => {
	if (!elements) {
		return false;
	}

	//TODO: Create function in MapManager(LocationManager?) for auth checking.
	let element = elements.filter(element => element.id === elementId)[0];

	if (!element) {
		return false;
	}

	let objectCorners = calculateCorners(element.mapPosition.x, element.mapPosition.y, element.size);
	let playerPosition = player.mapPosition;

	if ((playerPosition.x < objectCorners.cRightBottom.x) && (playerPosition.x > objectCorners.cLeftTop.x)) {
		if ((playerPosition.y < objectCorners.cRightBottom.y) && (playerPosition.y > objectCorners.cLeftTop.y)) {
			return true;
		}
	}
	return false;
};

module.exports = (req, res, server, player) => {
	let data = req.body;

	if (!data || !data.id) {
		res.send({ error: 'no id' });
		return;
	}

	if (player.isInLocation()) {
		res.send({ error: 'You are already in location.' });
		return;
	}

	server.gameManager.mapManager.getElementsForPlayer(player.id, false)
		.then(elements => {
			if (!checkPlayer(player, data.id, elements)) {
				res.send({ error: 'You cant enter here.' });
				return;
			}

			let mapPosition = elements.filter(element => element.id === data.id)[0];

			return server.gameManager.locationManager.getLocationByMapPosition(mapPosition.id);
		})
		.then(location => {
			return Promise.all([
				location,
				location.getDataForPlayer(player.id)
			]);
		})
		.then(results => {
			const location = results[0];
			const data = results[1];

			player.enterLocation(location.id, location.getType());
			location.onPlayerEnter(player);

			res.send({
				success: true,
				type: location.getType(),
				data
			});
		})
		.catch(error => {
			log('error', error);
			res.send({ error: 'Internal server error.' });
		});
};
