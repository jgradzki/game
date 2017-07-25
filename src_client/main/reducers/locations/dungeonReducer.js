const dungeonReducer = (state, action) => {
	let rooms;

	switch (action.type) {
	case 'dungeonRemoveItem':
		rooms = state.map.rooms.slice();
		rooms[action.room.y][action.room.x].items = [
			...rooms[action.room.y][action.room.x].items.slice(0, action.slot),
			...rooms[action.room.y][action.room.x].items.slice(action.slot + 1)
		];
		return {
			...state,
			map: {
				...sate.map,
				rooms
			}
		};
		break;
	case 'dungeonAddItem':
		rooms = state.map.rooms.slice();
		rooms[action.room.y][action.room.x].items.push(action.item);
		return {
			...state,
			map: {
				...state.map,
				rooms
			}
		};
		break;
	case 'dungeonSetLoot':
		rooms = state.map.rooms.slice();
		rooms[action.room.y][action.room.x].items = action.inventory;
		return {
			...state,
			map: {
				...state.map,
				rooms
			}
		};
		break;
	default:
		return state;
	}
};

export default dungeonReducer;