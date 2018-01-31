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
		case actionTypes.SET_PLAYER_MELEE_WEAPON:
			return {
				...state,
				meleeWeapon: action.item
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
		case actionTypes.OPEN_PLAYER_INVENTORY:
			return {
				...state,
				inventoryIsOpen: true
			};
		case actionTypes.CLOSE_PLAYER_INVENTORY:
			return {
				...state,
				inventoryIsOpen: false
			};
		case actionTypes.SET_PLAYER_HP:
			return {
				...state,
				hp: action.hp
			};
		case actionTypes.SET_PLAYER_ENERGY:
			return {
				...state,
				energy: action.energy
			};
		case actionTypes.SET_PLAYER_HUNGER:
			return {
				...state,
				hunger: action.hunger
			};
		default:
			return state;
	}
};

export default playerReducer;
