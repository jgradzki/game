import path from 'path';
import { log } from '../../logger';

module.exports = (req, res, server, player) => {

	server.gameManager.mapManager.getElementsForPlayer(player.id)
		.then(elements => {
			res.send({
				success: true,
				elements
			});
		})
		.catch(error => {
			log('error', error);
			res.send({
				error: true,
				errorMessage: ''
			});
		});
};
