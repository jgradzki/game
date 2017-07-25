//import { store } from './store'


const calculateInventory = (inventory, inventoryLimit, newItem, newItemMaxStack) => {
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

};

const sendChanges = (changes) => {
	if (changes.type === 'post') {
		changes.res.send(changes.tasks);
	}
};

let roll = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const rollItem = ( itemName ) => {
	let itemData = store.getState().config.items[itemName];

	if (!itemData) {
		return;
	}

	if (itemData.rollChance > 0) {
		let count = roll(0, 100);
	} else {
		return;
	}
};

module.exports = {
	calculateInventory,
	sendChanges,
	roll
};
