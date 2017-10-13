import Sequelize, { Model } from 'sequelize';
import items from '../data/items';
import upgradeCosts from '../data/upgradeCosts';

export default class PlayerBase extends Model {

	static fields = {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			unique: true,
			primaryKey: true
		},
		bedLevel: {
			type: Sequelize.INTEGER,
			defaultValue: 1,
			validate: {
				isCorrect(value) {
					if (value < 0) {
						throw new Error('Bed level can not be lower than 0.');
					}
				}
			}
		},
		workshopLevel: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			validate: {
				isCorrect(value) {
					if (value < 0) {
						throw new Error('Workshop level can not be lower than 0.');
					}
				}
			}
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

		models['PlayerBase'].hasOne(
			models['Inventory'],
			{
				as: 'box1'
			}
		);

		models['PlayerBase'].hasOne(
			models['Inventory'],
			{
				as: 'box2'
			}
		);

		models['PlayerBase'].hasOne(
			models['Inventory'],
			{
				as: 'box3'
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
		return {
			location: this,
			data: this.getDataForPlayer()
		};
	}

	onPlayerExit(/*player*/) {

	}

	getDataForPlayer(/*id*/) {
		return {
			equipment: {
				bed: {
					level: this.getDataValue('bedLevel'),
					upgradeable: false
				},
				workshop: {
					level: this.getDataValue('workshopLevel'),
					upgradeable: this.isUpgradeable('WORKSHOP', this.getDataValue('workshopLevel')),
					upgradeCosts: this.getUpgradeCosts('WORKSHOP', this.getDataValue('workshopLevel'))
				},
				box1: {
					items: this.box1.getInventory()
				},
				box2: {
					items: this.box2.getInventory()
				},
				box3: {
					items: this.box3.getInventory()
				}
			}
		};
	}

	getEquipmentLevel(equipment) {
		switch (equipment) {
			case 'BED':
				return this.getDataValue('bedLevel');
			case 'WORKSHOP':
				return this.getDataValue('workshopLevel');
			default:
				return -1;
		}
	}

	isUpgradeable(equipment, currentLevel) {
		const { PLAYER_BASE } = upgradeCosts;

		if (!PLAYER_BASE[equipment] || (!currentLevel && currentLevel !== 0)) {
			return false;
		}

		if (!PLAYER_BASE[equipment].LEVELS || !PLAYER_BASE[equipment].LEVELS[currentLevel]) {
			return false;
		}

		return true;
	}

	getUpgradeCosts(equipment, currentLevel) {
		const { PLAYER_BASE } = upgradeCosts;

		if (!this.isUpgradeable(equipment, currentLevel)) {
			return [];
		}

		if (PLAYER_BASE[equipment].LEVELS[currentLevel]) {
			return PLAYER_BASE[equipment].LEVELS[currentLevel].map(item => {
				return {
					...item,
					name: items && items[item.key].name
				};
			});
		}

		return [];
	}

	upgrade(equipment) {
		switch (equipment) {
			case 'BED':
				this.setDataValue('bedLevel', this.getDataValue('bedLevel') + 1);
				return this.getDataValue('bedLevel');
			case 'WORKSHOP':
				this.setDataValue('workshopLevel', this.getDataValue('workshopLevel') + 1);
				return this.workshopLevel;
			default:
				return -1;
		}
	}
}
