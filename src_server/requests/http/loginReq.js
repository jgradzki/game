import validator from 'validator';
import { log } from './../../logger';

module.exports = (req, res, server) => {

	let player;

	new Promise((resolve, reject) => {
		if (!req.body.form) {
			reject(false);
		}

		if (( typeof(req.body.form.login) !== 'string' ) ||
			( typeof(req.body.form.pass) !== 'string' ) ||
			( validator.trim(req.body.form.login).length < 3 ) ||
			( req.body.form.pass.length < 6 )
		) {
			reject(true);
		} else {
			resolve(validator.trim(req.body.form.login));
		}
	})
		.then(name => {
			return server.db.getModel('Player').findOne({
				where: {
					name
				},
				include: [{ 
					model: server.db.getModel('Inventory'), 
					as: 'inventory' 
				}]
			});
		})
		.then(result => {
			player = result;
			if (!player || !player.auth(req.body.form.pass)) {
				throw true;
			}

			let sess = req.session;

			sess.name = player.name;
			sess.playerID = player.id;
			player.sessionId = sess.id;
			server.gameManager.playerManager.loadPlayer(player);
			log('info', `Players online: ${server.gameManager.playerManager.getPlayers().length}`);
			res.send({ 'success': true });

		})
		.catch(e => {
			if (typeof(e) === 'boolean') {
				if (e) {
					res.send({error: 'Błędny login lub hasło.'});
				} else {
					res.send({error: 'Wypełnij pola.'});
				}
			} else {
				res.send({error: 'Internal server error.'});
				log('error', e);
			}

		});

};
