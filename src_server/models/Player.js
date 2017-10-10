import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt-nodejs';
import _ from 'lodash';

export default class Player extends Model {

	static fields = {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			unique: true,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
			set(value) {
				this.setDataValue('password', Player.generateHash(value));
			},
		},
		sessionId: {
			type: Sequelize.VIRTUAL(Sequelize.STRING),
		},
		socket: Sequelize.VIRTUAL,
		disconnectTimeout: Sequelize.VIRTUAL,
		hp: {
			type: Sequelize.INTEGER,
			defaultValue: 100,
			allowNull: false,
			set(value) {
				if (value > 100) {
					value = 100;
				}
				if (value < 0) {
					value = 0;
				}
				this.setDataValue('hp', value);
			}
		},
		hunger: {
			type: Sequelize.FLOAT,
			defaultValue: 0,
			allowNull: false,
			set(value) {
				if (value > 100) {
					value = 100;
				}
				if (value < 0) {
					value = 0;
				}
				this.setDataValue('hunger', value);
			}
		},
		energy: {
			type: Sequelize.FLOAT,
			defaultValue: 100,
			allowNull: false,
			set(value) {
				if (value > 100) {
					value = 100;
				}
				if (value < 0) {
					value = 0;
				}
				this.setDataValue('energy', value);
			}
		},
		mapPosition: {
			type: Sequelize.JSON,
			allowNull: false,
			field: 'map_position',
			validate: {
				isCorrect: v => {
					if ( !v.x || !v.y) {
						throw Error('Player.mapPosition must have x and y properties.');
					}
				}
			}
		},
		mapTarget: {
			type: Sequelize.VIRTUAL(Sequelize.JSON)
		},
		location: Sequelize.STRING,
		locationType: Sequelize.STRING,
		lastAcivity: {
			type: Sequelize.VIRTUAL,
			defaultValue: ((new Date()).getTime())
		},

		onlineStatus: Sequelize.VIRTUAL(Sequelize.BOOLEAN),
		//helpers
		sendingPositionTime: Sequelize.VIRTUAL(Sequelize.INTEGER)
	};

	static options = {
		underscored: true
	};

	static associate(models) {
		models['Player'].hasOne(
			models['PlayerBase'],
			{
				as: 'base',
				foreignKey: 'player_id'
			}
		);
		models['Player'].hasOne(
			models['Inventory'],
			{
				as: 'inventory',
				foreignKey: 'player_id'
			}
		);
	}

	static generateHash(password) {
		return bcrypt.hashSync(password);
	}

	auth(password) {
		return bcrypt.compareSync(password, this.password);
	}

	activity() {
		this.setDataValue('lastAcivity', (new Date()).getTime());
	}

	isIdle(time = 5*60*1000) {
		let now = (new Date()).getTime();

		return ((this.lastAcivity + time) < now);
	}

	onLogin() {
		this.setDataValue('onlineStatus', true);
	}

	onLogout() {
		this.setDataValue('onlineStatus', false);
	}

	enterLocation(id, type) {
		this.location = id;
		this.locationType = type;
	}

	exitLocation() {
		this.setDataValue('location', null);
		this.setDataValue('locationType', null);
	}

	isInLocation() {
		if (this.location) {
			return true;
		} else {
			return false;
		}
	}

	canMoveOnMap() {
		if (this.location) {
			return false;
		}

		return true;
	}

	eat(item) {
		if (item.hunger && _.isNumber(item.hunger)) {
			let hunger = this.hunger - item.hunger;

			if (hunger < 0) {
				hunger = 0;
			}
			this.setDataValue('hunger', hunger);
		}
	}
}
