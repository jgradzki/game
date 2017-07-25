const playerReducer = (state = 0, action) => {
	switch (action.type) {
	case 'setPlayerInLocation':
		return {
			...state,
			inLocation: action.inLocation
		};
	case 'setPlayerInventory':
		return {
			...state,
			inventory: action.inventory
		};
		break;
	case 'addItemToInventory':
		return {
			...state,
			inventory: [
				...state.inventory,
				action.item
			]
		};
		break;
	case 'removeItemFromInventory':
		return {
			...state,
			inventory: [
				...state.inventory.slice(0, action.slot),
				...state.inventory.slice(action.slot + 1)
			]
		};
		break;
	default:
		return state;
	}
};

export default playerReducer;