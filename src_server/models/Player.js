import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt-nodejs';

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
}

/*
export default (sequelize, DataTypes) => {
	const Player = sequelize.define('Player', {
		id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		unique: true,
		primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set: function(value) {
				this.setDataValue('password', Player.generateHash(value));
			},
		},
		sessionId: {
			type: DataTypes.VIRTUAL(DataTypes.STRING),
		},
		mapPosition: {
			type: DataTypes.JSON,
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
	},
	{
		underscored: true,
    	classMethods: {
      		associate: models => {
        		//
      		},
      		generateHash: password => {
      			return bcrypt.hashSync(password);
      		}
    	},
    	instanceMethods: {
    		auth: function(password) {
				return bcrypt.compareSync(password, this.password);
			}
    	},
    });

  	return Player;
};
*/
