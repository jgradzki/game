import { actionTypes } from '../../actions/locations/dungeonAction';

const dungeonReducer = (state, action) => {
	let rooms;

	switch (action.type) {
		case actionTypes.REMOVE_ITEM:
			rooms = state.map.slice();
			rooms[action.room.y][action.room.x].items = [
				...rooms[action.room.y][action.room.x].items.slice(0, action.slot),
				...rooms[action.room.y][action.room.x].items.slice(action.slot + 1)
			];
			return {
				...state,
				map: rooms
			};
		case actionTypes.ADD_ITEM:
			rooms = state.map.slice();
			rooms[action.room.y][action.room.x].items.push(action.item);
			return {
				...state,
				map: rooms
			};
		case actionTypes.SET_LOOT_LIST:
			rooms = state.map.slice();
			rooms[action.room.y][action.room.x].items = action.inventory;
			return {
				...state,
				map: rooms
			};
		default:
			return state;
	}
};

export default dungeonReducer;
