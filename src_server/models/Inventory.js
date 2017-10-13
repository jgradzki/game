import Sequelize, { Model } from 'sequelize';
import _ from 'lodash';
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

	filtreItems() {
		return this.content.map(item => ({
			key: item.key,
			type: item.type,
			name: item.name,
			count: item.count,
			combat: item.combat,
			eat: item.eat
		}));
	}

	addItem(item) {
		const itemData = items[item.key];

		if (!itemData) {
			return false;
		} else {
			const calculateData = this.calculateInventory(this.getInventory(), this.size, item, itemData.maxStack);

			if (calculateData && calculateData.newInventory && calculateData.countTaken) {
				this.setDataValue('content', calculateData.newInventory);
				return calculateData.countTaken;
			} else {
				return false;
			}
		}
	}

	removeSlot(slot, count = 0) {
		if (!count || !this.content || !this.content[slot]) {
			return;
		}

		if (this.content[slot].count <= count) {
			this.setDataValue('content', [
				...this.content.slice(0, slot),
				...this.content.slice(slot + 1)
			]);
		} else {
			this.content[slot].count -= count;
		}
	}

	stackInventory() {
		let content = this.content.slice();

		//TODO: checking items stacks

		this.setDataValue('content', content.filter(item => item.count > 0));

		return this;
	}

	has(items) {
		if (!_.isArray(items)) {
			return false;
		}

		let has = true;

		items.forEach(item => {
			let count = 0;

			this.getInventory().forEach(inventoryItem => {
				if (item.name === inventoryItem.name) {
					count += inventoryItem.count;
				}
			});
			if (count < item.count) {
				has = false;
			}
		});

		return has;
	}

	removeItems(items) {
		if (!this.has(items)) {
			return false;
		}

		let inventory = this.getInventory();

		items.forEach(item => {
			inventory = inventory.map(inventoryItem => {
				if (item.count > 0 && item.name === inventoryItem.name) {
					if (inventoryItem.count < item.count) {
						item.count -= inventoryItem.count;
						inventoryItem.count = 0;
					} else {
						inventoryItem.count -= item.count;
						item.count = 0;
					}
				}
				return inventoryItem;
			});
		});

		this.setDataValue('content', inventory);
		return this.stackInventory().getInventory();
	}

	setMeleeWepon(slot) {
		if (
			this.getInventory()[slot] &&
			this.getInventory()[slot].combat &&
			this.getInventory()[slot].combat.type === 'melee'
		) {
			this.setDataValue('content', this.getInventory().map(item => {
				if (item.combat && item.combat.type === 'melee' && item.combat.selected) {
					item.combat.selected = false;
				}
				return item;
			}));

			this.getInventory()[slot].combat.selected = true;
		}
	}

	getMeleeWeapon() {
		return this.getInventory().filter(item => item.combat && item.combat.type === 'melee' && item.combat.selected)[0];
	}

	setRangeWepon(slot) {
		if (
			this.getInventory()[slot] &&
			this.getInventory()[slot].combat &&
			this.getInventory()[slot].combat.type === 'range'
		) {
			this.setDataValue('content', this.getInventory().map(item => {
				if (item.combat && item.combat.type === 'range' && item.combat.selected) {
					item.combat.selected = false;
				}
				return item;
			}));

			this.getInventory()[slot].combat.selected = true;
		}
	}

	getRangeWeapon() {
		return this.content.filter(item => item.combat && item.combat.type === 'range' && item.combat.selected)[0];
	}

	calculateInventory(inventory, inventoryLimit, newItem, newItemMaxStack) {
		inventory = inventory.slice();
		let itemCount = newItem.count;

		if (inventory.length > 0) {
			inventory.forEach(itemSlot => {
				if (itemCount > 0) {
					if (itemSlot.name === newItem.name) {
						if (itemSlot.count < newItemMaxStack) {
							let count = newItemMaxStack - itemSlot.count;

							if (count > itemCount) {
								count = itemCount;
							}

							itemSlot.count += count;
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
