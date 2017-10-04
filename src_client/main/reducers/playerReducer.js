import actionTypes from '../actions/actionTypes';

const playerReducer = (state = 0, action) => {
	switch (action.type) {
		case actionTypes.SET_PLAYER_IN_LOCATION:
			return {
				...state,
				inLocation: action.inLocation
			};
		case actionTypes.SET_PLAYER_INVENTORY:

			return {
				...state,
				inventory: action.inventory
			};
		case actionTypes.ADD_ITEM_TO_PLAYER_INVENTORY:
			return {
				...state,
				inventory: [
					...state.inventory,
					action.item
				]
			};
		case actionTypes.REMOVE_ITEM_FROM_PLAYER_INVENTORY:
			return {
				...state,
				inventory: [
					...state.inventory.slice(0, action.slot),
					...state.inventory.slice(action.slot + 1)
				]
			};
		default:
			return state;
	}
};

export default playerReducer;
