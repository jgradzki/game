import { store } from '../libs/store';
import { addLocation } from '../actions/locationsAction';


class Location {
	constructor() {
    	if (new.target === Location) {
      		throw new TypeError('Cannot construct Location abstract class');
    	}
	}

	static add(id, type, position, size, visibilityRules, mapIcon = 'default', isPerm = false, data = {}) {
    	if (id !== -1) {
    		store.dispatch(addLocation(id, type, position, size, mapIcon, visibilityRules, isPerm, data) );
    	}
	}

	static get(id) {
    	return store.getState().locations[id];
	}

	static getPosition(id) {
    	return store.getState().locations[id].position;
	}

	static getType() {
    	return 'unknown';
	}

	static getSize(id) {
    	return ( Location.get(id) ? Location.get(id).size : undefined );
	}

	static getMapIcon(id) {
    	return ( Location.get(id) ? Location.get(id).mapIcon : undefined );
	}

	static isPerm(id) {
    	return ( Location.get(id) ? Location.get(id).isPerm : undefined );
	}

	static getVisibilityRules(id) {
    	return ( Location.get(id) ? Location.get(id).visibilityRules : undefined );
	}

	static setVisibilityRules(id, visibilityRules) {
    	if ( Location.get(id) ) {
			//dispatch
		} else {
			return false;
		}
	}

	static getDataForPlayer(locationId, playerId) { //return object with informations about location to client
		return {};
	}

	static onPlayerEnter(locationId, playerId) {} //process player enter

	static onPlayerExit(locationId, playerId) {}

	static onAction(locationId, player, action, req, res) {}

}

export default Location;