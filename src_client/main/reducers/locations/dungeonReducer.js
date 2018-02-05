import { cloneDeep, forEach } from 'lodash';
import { actionTypes } from '../../actions/locations/dungeonActions';

const dungeonReducer = (state, action) => {
	let rooms = {};

	switch (action.type) {
		case actionTypes.REMOVE_ITEM:
			forEach(cloneDeep(state.map), (row, x) => {
				let temp;

				forEach(row, (room, y) => {
					if ((action.room.x !== x) || (action.room.y !== y)) {
						if (!temp) {
							temp = {};
						}
						temp[y] = room;
					}
				});
				if (temp) {
					rooms[x] = temp;
				}
			});
			return {
				...state,
				map: rooms
			};
		case actionTypes.ADD_ITEM:
			rooms = cloneDeep(state.map);
			rooms[action.room.x][action.room.y].items.push(action.item);
			return {
				...state,
				map: rooms
			};
		case actionTypes.SET_LOOT_LIST:
			rooms = cloneDeep(state.map);
			rooms[action.room.x][action.room.y].items = action.inventory;
			return {
				...state,
				map: rooms
			};
		case actionTypes.SET_FIGHT_LOG:
			return {
				...state,
				fight: action.fight
			};
		default:
			return state;
	}
};

export default dungeonReducer;
