import Location from './location.js';
import { store } from '../libs/store';
import { rollRooms } from '../libs/dungeonGenerator';
import dungeonAction from '../actions/locations/dungeonAction';
import { addItemToInventory } from '../actions/playersAction';
import { calculateInventory, sendChanges } from '../libs/functions';
import { setPlayerInventory, removeItemFromInventory } from '../actions/client/player';
import { setLootList, addItem } from '../actions/client/locations/dungeonAction';

class Dungeon extends Location {
	constructor() {
		super();
	}
	static getType() {
    	return 'dungeon';
	}

	static add(id, type, position, size, visibilityRules, isPerm = false, data = {}) {
		Location.add(id, type, position, size, visibilityRules, 'building', isPerm = false, data = { players: {},
			rooms: rollRooms('randomV3', { min: 5,
				max: 10,
				width: 5,
				height: 5 }),
			...data });
	}

	static getDataForPlayer(locationId, playerId) {
		let location = super.get(locationId);

		return {
			rooms: location.data.rooms,
			position: Dungeon.getPlayerPosition(locationId, playerId)
		};
	}

	static onPlayerEnter(locationId, playerId) {
    	let location = super.get(locationId);

		store.dispatch(dungeonAction.addPlayer(locationId, playerId, location.data.rooms.mainRoom));
	} 

	static onPlayerExit(locationId, playerId) {
		store.dispatch(dungeonAction.removePlayer(locationId, playerId));
	}

	static onAction(locationId, player, action, req, res) {
		let playerPosition = Dungeon.getPlayerPosition(locationId, player.getID());

		switch (action.type) {
			case 'changePosition':
				if (Dungeon._canMove(locationId, player, action.position.x, action.position.y)) {
					Dungeon.setPlayerPosition(locationId, player, action.position);
				} else {
					player.sendErrorMsg('Nie mozesz sie tutaj przemiescic');
				}
				break;
			case 'loot': 
				let item = Dungeon.getRoomItems(locationId, playerPosition)[action.slot];

				if (item && item.name) {
					let countTaken = player.addItemToInventory(item);

					if (countTaken && countTaken > 0) {
						if (countTaken < item.count) {
							store.dispatch(dungeonAction.changeItemCount(locationId, playerPosition, action.slot, item.count - countTaken));
						} else {
							store.dispatch(dungeonAction.removeItem(locationId, playerPosition, action.slot));
						}

						sendChanges({
							type: 'post',
							res,
							tasks: [
								{ commandType: 'dispatch',
									...setLootList(playerPosition, Dungeon.getRoomItems(locationId, playerPosition)) },
								{ commandType: 'dispatch',
									...setPlayerInventory(player.getInventory()) }
							]
						});

					} else {
						sendChanges({
							type: 'post',
							res,
							tasks: false
						});
					}
				} else {
					sendChanges({
						type: 'post',
						res,
						tasks: false
					});
				}
				break;
			case 'putBackLoot': 
				let playerItem = player.getInventory()[action.slot];

				store.dispatch(dungeonAction.addItem(locationId, playerPosition, playerItem));
				player.removeItemFromInventory(action.slot);
				sendChanges({
					type: 'post',
					res,
					tasks: [
						{ 
							commandType: 'dispatch',
							...removeItemFromInventory(action.slot) 
						},
						{ 
							commandType: 'dispatch',
							...addItem(playerPosition, playerItem) 
						}
					]
				});
				break;
		}
	}


	///
	static getPlayers(locationId) {
		return super.get(locationId).data.players;
	}

	static getPlayerPosition(locationId, playerId) {
		let players = Dungeon.getPlayers(locationId);

		if (players) {
			if (players[playerId]) {
				return players[playerId].position;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	static getRooms(locationId) {
		return super.get(locationId).data.rooms;
	}

	static getRoomItems(locationId, room) {
		let rooms = Dungeon.getRooms(locationId).rooms;

		return rooms[room.y][room.x].items;
	}

	static _canMove(locationId, player, x, y) {
		let can = false;
		let rooms = Dungeon.getRooms(locationId).rooms;

		if (!rooms) {
			return false;
		}
		let playerPosition = Dungeon.getPlayerPosition(locationId, player.getID());

		if (!playerPosition) {
			return false;
		}

		if (playerPosition.x-1 == x && playerPosition.y==y) {
			//na lewo od current
			if (rooms[y][x].doors.right) {
				can = true;
			}
		} else if (playerPosition.x+1 == x && playerPosition.y==y) {
			//na prawo od current
			if (rooms[y][x].doors.left) {
				can = true;
			}
		} else if (playerPosition.x == x && playerPosition.y-1==y) {
			//nad current
			if (rooms[y][x].doors.down) {
				can = true;
			}
		} else if (playerPosition.x == x && playerPosition.y+1==y) {
			//pod current
			if (rooms[y][x].doors.up) {
				can = true;
			}
		}

		return can;
	}  

	static setPlayerPosition(locationId, player, position) {
		store.dispatch(dungeonAction.changePlayerPosition(locationId, player.getID(), position));
		player.getSocket().emit('action', 
			{ 
				type: 'LocationSetPlayerPosition',
				position 
			}
		);
	}
}

export default Dungeon;