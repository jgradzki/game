import Sequelize, { Model } from 'sequelize';

export default class PlayerBase extends Model {

	static fields = {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			unique: true,
			primaryKey: true
		}
	};

	static options = {
		underscored: true
	};

	static associate(models) {
		models['PlayerBase'].belongsTo(
			models['MapElement'],
			{
				as: 'mapPosition',
				foreignKey: 'map_position'
			}
		);
	}

	getType() {
		return 'PLAYER_BASE';
	}

	locationCreated() {
		//
	}

	onPlayerEnter(/*player*/) {

	}

	onPlayerExit(/*player*/) {

	}

	getDataForPlayer(/*id*/) {
		return {
			//
		};
	}
}
