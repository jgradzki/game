/*import PM from '../libs/player.js'

import { db } from '../libs/mysql.js'
import bcrypt from 'bcrypt-nodejs'
*/

import validator from 'validator';
import { log } from './../../logger';

module.exports = (req, res, server) => {
	if (!server.config.get('site.enableRegister')) {
		res.send({
			error: {
				is: true,
				msg: 'Rejestracja zablokowana'
			}
		});
		return;
	}

	let errors = [];

	if (!req.body.form) {
		errors.push('Pusty formularz');
	} else {
		if (typeof(req.body.form.login) !== 'string') {
			errors.push('Podaj login');
		}
		if (typeof(req.body.form.pass) !== 'string') {
			errors.push('Podaj hasło');
		}
		if (typeof(req.body.form.repass) !== 'string') {
			errors.push('Powtórz hasło');
		}

		var login = validator.trim(req.body.form.login) || '';
		var pass = req.body.form.pass || '';
		let repass = req.body.form.repass || '';

		if (login.length < 3) {
			errors.push('Login musi skladac sie przynajmniej z 3 znakow');
		}
		if (login.length > 15) {
			errors.push('Login nie może mieć więcej niż 15 znaków');
		}
		if (pass.length < 6 || pass.length > 20) {
			errors.push('Hasło musi skladac sie przynajmniej z 6 znakow i mieć nie więcej niż 20');
		}
		if (pass != repass) {
			errors.push('Hasła nie są takie same');
		}
	}

	if (errors.length > 0) {
		res.send({
			errors: errors
		});
	} else {

		let inventory;
		let player;

		server.db.getModel('Inventory').create({
			size: server.config.get('player.defaultPlayerInventorySize', 5),
			content: []		
		})
			.then(result => {
				inventory = result;
				return server.db.getModel('Player').create({
					name: login,
					password: req.body.form.pass,
					mapPosition: server.config.get('player.defaultPlayerOnMapPosition')
				});
			})
			.then( result => {
				player = result;
				return player.setInvetory(inventory);
			})
			.then(() => {
				res.send({
					success: true
				});
			})
			.catch(e => {
				if (inventory) {
					inventory.destroy();
				}
				if (player) {
					player.destroy();
				}
				
				log('error', e);
				res.send({
					errors: ['Internal server error.']
				});
			});
	}

/*
	if (!req.body.form) {
		respond = {
			error: {
				is: true,
				msg: 'no data'
			}
		};
	} else if (typeof(req.body.form.login) !== 'string') {
		respond = {
			error: {
				is: true,
				msg: 'Empty login'
			}
		};
	} else if (typeof(req.body.form.pass) !== 'string') {
		respond = {
			error: {
				is: true,
				msg: 'Empty password'
			}
		};
	} else if (typeof(req.body.form.repass) !== 'string') {
		respond = {
			error: {
				is: true,
				msg: 'Empty password(2)'
			}
		};
	} else {
		let login = validator.trim(req.body.form.login);
		if (login.length < 3) {
			respond = {
				error: {
					is: true,
					msg: 'Login musi skladac sie przynajmniej z 3 znakow'
				}
			};
		} else if (login.length > 15) {
			respond = {
				error: {
					is: true,
					msg: 'Login nie może mieć więcej niż 15 znaków'
				}
			};
		} else if (req.body.form.pass.length < 6 || req.body.form.pass.length > 20) {
			respond = {
				error: {
					is: true,
					msg: 'Hasło musi skladac sie przynajmniej z 6 znakow i mieć nie więcej niż 20'
				}
			};
		} else {
			if (req.body.form.pass != req.body.form.repass) {
				respond = {
					error: {
						is: true,
						msg: 'Hasła nie są takie same'
					}
				};
			} else {
				let hashedPassword = bcrypt.hashSync(req.body.form.pass);
				let post = { name: login, password: hashedPassword, map_position: JSON.stringify(store.getState().config.defaultPlayerOnMapPosition) };
				db.connection.query('SELECT * FROM users WHERE name = ?', [login], function(err, results) {
					if (err) {
						res.send({ error: { is: true, msg: 'Błąd serwera' } })
					} else {
						if (results.length > 0) {
							res.send({ error: { is: true, msg: 'Login istnieje' } })
						} else {
							db.connection.query('INSERT INTO users SET ?', post, function(err, result) {
								if (!err) {
									res.send({ success: true })
								} else {
									res.send({ error: { is: true, msg: 'Błąd serwera' } })
								}
							});
						}
					}
				});
				respond = { success: true };
			}
		}
	} */
	//if (!respond.success)
	//res.send(respond);
};
