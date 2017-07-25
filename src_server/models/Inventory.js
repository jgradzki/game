import Sequelize, { Model } from 'sequelize';
import items from '../data/items';

export default class Inventory extends Model {

	static fields = {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			unique: true,
			primaryKey: true
		},
		size: {
			type: Sequelize.INTEGER,
			allowNull: false,
			set(value) {
				if (value < 0) {
					throw new Error('Inventory size cant be smaller then 0.');
				} else {
					this.setDataValue('size', value);
				}
			}
		},
		content: {
			type: Sequelize.ARRAY(Sequelize.JSON),
			defaultValue: [],
			validate: {
				isArray(value) {
					if (!Array.isArray(value)) {
						throw new Error('Inventory: content is not an Array');
					}
				}
			}
		}
	};

	static options = {
		underscored: true
	};

	static associate(/*models*/) {
		//
	}
	
	getInventory() {
		return this.content;
	}

	addItem(item) {
		let itemData = items[item.name];

		if (!itemData) {
			return false;
		} else {
			let calculateData = this.calculateInventory(this.getInventory(), this.size, item, itemData.maxStack);

			if (calculateData && calculateData.newInventory && calculateData.countTaken) {
				this.setDataValue('content', calculateData.newInventory);
				return calculateData.countTaken;
			} else {
				return false;
			}
		}
	}

	calculateInventory(inventory, inventoryLimit, newItem, newItemMaxStack) {
		inventory = inventory.slice();
		let itemCount = newItem.count;
		
		if (inventory.length > 0) {
			inventory.forEach(s => {
				if (itemCount > 0) {
					if (s.name === newItem.name) {
						if (s.count < newItemMaxStack) {
							let count = newItemMaxStack - s.count;

							s.count += count;
							itemCount -= count;
						}
					}
				}
			});
		}

		while ( ( itemCount > 0 ) && ( inventory.length < inventoryLimit ) ) {
			let count;

			if (itemCount >= newItemMaxStack) {
				count = newItemMaxStack;
			} else {
				count = itemCount;
			}

			inventory.push({
				...newItem,
				count
			});
			itemCount -= count;
		}

		return {
			newInventory: inventory,
			countTaken: -(itemCount - newItem.count)
		};
	}
}
