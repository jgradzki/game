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
				inventory: player.inventory.getInventory()
			}
		}
	};


	if (player.isInLocation()) {
		server.gameManager.locationManager.getLocation(player.location, player.locationType)
			.then(location => {
				session.inLocation = true;
				session.location = {
					type: location.getType(),
					data: location.getDataForPlayer(player.id)
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
