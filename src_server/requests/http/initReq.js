import { log } from '../../logger';

const initReq = (req, res, server, player) => {

	let session = {
		...req.session,
		store: {
			map: {
				playerPosition: player.mapPosition,
				destination: player.mapTarget,
				movementSpeed: server.config.get('player.playerSpeedOnMap')
			},
			player: {
				name: player.name,
				inventorySize: player.inventory.size,
				inventory: player.inventory.filtreItems(),
				hp: player.hp,
				hunger: player.hunger,
				energy: player.energy
			}
		}
	};


	if (player.isInLocation()) {
		server.gameManager.locationManager.getLocation(player.location, player.locationType)
			.then(location => {
				return Promise.all([
					location,
					location.getDataForPlayer(player.id)
				]);
			})
			.then(results => {
				const location = results[0];
				const data = results[1];

				session.inLocation = true;
				session.location = {
					type: location.getType(),
					data: data
				};

				res.send(session);
			})
			.catch(error => {
				log('error', error);
				res.send( { error: 'Failed to load location. Please contact with helpdesk.' });
			});
	} else {
		res.send(session);
	}
};

export default initReq;
