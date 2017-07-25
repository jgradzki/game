import { store } from '../libs/store.js';
import PlayerActions from '../actions/playersAction.js';
import { db } from '../libs/mysql.js';
import validator from 'validator';
import { calculateInventory } from './functions';


/**
 * Dodaje gracza do storage.
 */
const addPlayer = (id, name, sessionID, position) => {
	store.dispatch(PlayerActions.addPlayer(id, name, sessionID, undefined, position));
};

/**
 * Wczytuje gracza. Jesli gracz nie istnieje w store dodaje go.
 */
const loadPlayer = (id, name, sessionID, position) => {
	let newPlayer = getPlayer(id);

	if (!newPlayer) {
		addPlayer(id, name, sessionID, position);
	} else {
		store.dispatch(PlayerActions.setPlayerSessionID(id, sessionID));
	}
};

/**
 * Zwraca dane gracza przechowywane w storage.
 */
const getPurePlayer = (id) => {
	return store.getState().players[id];
};

///From storage
const releasePlayer = (id) => {

};

const removePlayerFromDB = (id) => {

};


/**
 * Zwraca nowy obiekt gracza
 */
const getPlayer = (id) => {
	let playerData = store.getState().players[id];

	if (playerData) {
		return new Player(id); 
	} else {
		return false;
	}
};

class Player {
	constructor(id) {
		this.id = id;
	}

	getID() {
		return this.id;
	}

	getName() {
		return store.getState().players[this.getID()].name;
	}

	getSessionID() {
		return store.getState().players[this.getID()].sessionID;
	}

	getSocket() {
		return store.getState().players[this.getID()].socket;
	}

	setSocket(socket) {
		store.dispatch(PlayerActions.setPlayerSocket(this.getID(), socket));
	}

	setDisconnectTimeout(session) {
		let logoutTimeout = setTimeout(()=>{
			this.setSocket(undefined);
			session.login = -1;
			session.destroy(function(err) {
				if (err) {
					log('error', err);
				}
			});
		//Order releasee player from storage(+save)
		}, 30000);

		store.dispatch(PlayerActions.setDisconnectTimeout(this.getID(), logoutTimeout));

	}

	disableDisconnectTimeout() {
		if (store.getState().players[this.getID()].timeout) {
			clearTimeout(store.getState().players[this.getID()].timeout);
			store.dispatch(PlayerActions.setDisconnectTimeout(this.getID(), false));
		}

	}

	sendErrorMsg(msg, details = false, critical = false) {
		this.getSocket().emit('showError', { msg,
			details,
			critical } );
	}

	getMapPosition() {
		return store.getState().players[this.getID()].position;
	}

	setMapPosition(position, socket = false) {
		store.dispatch(PlayerActions.setPlayerMapPosition(this.getID(), position));
		if (socket) {
			if (this.getSocket()) {
				//todo
			}
		}
	}

	getMapTarget(target) {
		return store.getState().players[this.getID()].target;
	}

	setMapTarget(target) {
		if (target) {
			console.log('player', this.getID(), 'moving to', target); 
		} else {
			console.log('player', this.getID(), 'reached destination');
		}
		store.dispatch(PlayerActions.setPlayerMapTarget(this.getID(), target));
	}

	setInLocation(is) {
		if (is && validator.isInt(is) ) {
			store.dispatch(PlayerActions.setInLocation(this.getID(), is));
		} else {
			store.dispatch(PlayerActions.setInLocation(this.getID(), false));
		}
	}

	inLocation() {
		let locationId = store.getState().players[this.getID()].locationId;

		if (!locationId) {
			return false;
		} else {
			return locationId;
		}
	}

	getInventorySize() {
		return store.getState().config.defaultPlayerInventorySize;
	}

	getInventory() {
		if (store.getState().players[this.getID()].inventory) {
			return store.getState().players[this.getID()].inventory;
		} else {
			return [];
		}
	}

	setInventory(newInventory) {
		store.dispatch(PlayerActions.setPlayerInventory(this.getID(), newInventory));
	}

	addItemToInventoryForce(item, stack) { //add item regardles if there is space or not

	}

	addItemToInventory(item) {
		let itemData = store.getState().config.items[item.name];

		if (!itemData) {
			return false;
		} else {
			let calculateData = calculateInventory(this.getInventory(), this.getInventorySize(), item, itemData.maxStack);

			if (calculateData && calculateData.newInventory && calculateData.countTaken) {
				this.setInventory(calculateData.newInventory);
				return calculateData.countTaken;
			} else {
				return false;
			}
		}
		
	}

	removeItemFromInventory(slot, count=false) {
		if (this.getInventory() && this.getInventory()[slot]) {
			if (!count) {
				store.dispatch(PlayerActions.removeItemFromInventory(this.getID(), slot));
			}
		} else {
			return false;
		}
	}
}


module.exports = {
	addPlayer,
	loadPlayer,
	getPlayer,
	getPurePlayer,
	Player
};