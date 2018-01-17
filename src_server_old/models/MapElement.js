import Sequelize, { Model } from 'sequelize';

export default class MapElement extends Model {

	static ElementTypes = {
		PLAYER_BASE: 'PLAYER_BASE',
		DUNGEON: 'DUNGEON'
	};

	static fields = {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			unique: true,
			primaryKey: true
		},
		type: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isCorrect(v) {
					if (!MapElement.ElementTypes[v]) {
						throw new Error('Incorrect location type.');
					}
				}
			}
		},
		mapPosition: {
			type: Sequelize.JSON,
			allowNull: false,
			field: 'map_position',
			validate: {
				isCorrect(v) {
					if ( (!v.x && v.x !== 0 ) || ( !v.y && v.y !== 0) ) {
						throw new Error('Location.mapPosition must have x and y properties.');
					}
				}
			}
		},
		mapIcon: {
			type: Sequelize.STRING,
			defaultValue: 'default'
		},
		size: {
			type: Sequelize.JSON,
			allowNull: false,
			validate: {
				isCorrect: v => {
					if ( !v.width || !v.height) {
						throw Error('Location.size must have width and height properties.');
					}
				}
			}
		},
		visibilityRules: {
			type: Sequelize.JSONB,
			field: 'visibility_rules'
		},
		isPerm: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		}
	};

	static options = {
		underscored: true
	};

	static associate(/*models*/) {
		//
	}

	async getDataForPlayer(id) {

		return {
			type: this.type,
			data: this.data.getDataForPlayer(id)
		};
	}
}
