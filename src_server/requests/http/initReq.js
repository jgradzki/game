//import PlayersManager from '../libs/player';
//import LocationsManager from '../libs/locationsManager';

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
				inventorySize: 10, //player.getInventorySize(),
				inventory: []//player.getInventory()
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
				res.send( { error });
			});
	} else {
		res.send(session);
	}
};

export default initReq;
