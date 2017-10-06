import Sequelize, { Model } from 'sequelize';
import items from '../data/items';

// Concept for future
export default class Item extends Model {

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
			set(value) {
				if (items[value] ) {
					this.setDataValue('name', value);

					if (items[value].type) {
						this.setDataValue('type', items[value].type);
					}
					if (items[value].maxStack) {
						this.setDataValue('maxStack', items[value].maxStack);
					}
					if (items[value].name) {
						this.setDataValue('displayName', items[value].name);
					}
				}
			},
			validate: {
				isValidName(value) {
					if (!items[value]) {
						throw new Error(`Item: ${value} is not valid name. ID:${this.getDataValue('id')}.`);
					}
				}
			}
		},
		type: {
			type: Sequelize.STRING,
			validate: {
				isValidType(value) {
					/*console.log(this.name)
					if (items[this.getDataValue('name')].type !== value) {
						throw new Error(`Item: ${value} is not valid type for ${this.getDataValue('name')}. ID:${this.getDataValue('id')}.`);
					}*/
				}
			}
		},
		count: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			validate: {
				isValid(value) {
					if (value < 0) {
						throw new Error(`Item: Count(${value}) must be positive. ID:${this.getDataValue('id')}.`);
					}
				},
				checkLimit(value) {
					const maxStack = this.getDataValue('maxStack');

					if (maxStack && maxStack > 0 && value > maxStack) {
						throw new Error(`Item: Count(${value}) cant be bigger then limit(${maxStack}). ID:${this.getDataValue('id')}.`);
					}
				}
			}
		},
		maxStack: {
			type: Sequelize.VIRTUAL(Sequelize.INTEGER),
			defaultvalue: 0
		},
		displayName: {
			type: Sequelize.VIRTUAL(Sequelize.INTEGER)
		},
	};

	static options = {
		underscored: true
	};

	static associate(/*models*/) {
		//models['Item'].belongsTo(models['Inventory']);
	}
}
