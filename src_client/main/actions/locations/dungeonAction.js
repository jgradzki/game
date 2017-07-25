const setLootList = (room, inventory) => {
	return {
		type: 'dungeonSetLoot',
		room,
		inventory
	};
};

const removeItem = (room, slot) => {
	return {
		type: 'dungeonRemoveItem',
		room,
		slot
	};
};

const addItem = (room, item) => {
	return {
		type: 'dungeonAddItem',
		room,
		item
	};
};

const changeItemCount = (room, slot, count) => {
	return {
		type: 'changeItemCount',
		room,
		slot,
		count
	};
};


module.exports = {
	setLootList,
	removeItem,
	addItem,
	changeItemCount
};