import { store } from './store.js';
//import { addMapElement } from '../actions/mapAction.js'
import { logger } from '../logger';
import Location from '../locations/location';

let handlers = {};

class LocationsManager {

	static addLocationType(name, handler) {
		if (typeof handler !== 'function' &&  !( (new handler(-1)) instanceof Location)  ) {
			log('error', 'Handler must be child class of Location.');
		} else {
			handlers[name] = handler;
		}
	}

	static addLocation(id, type, position, size, visibilityRules = { onMap: false }, isPerm = false, data = {}) {
		if (!store.getState().locations[id]) {
			if (handlers[type]) {
				handlers[type].add(id, type, position, size, visibilityRules, isPerm, data);
				return true;
			} else {
				log('error', 'LocationsManager.addLocation: no such type('+type+')');
				return false;
			}
		} else {
			log('error', 'LocationsManager.addLocation: id exists('+id+')');
			return false;
		}
	}

	static addNewLocation(type, position, size, visibilityRules = { onMap: false }, isPerm = false, data = {}) {
		return LocationsManager.addLocation(LocationsManager.getNewId(), type, position, size, visibilityRules, isPerm, data);
	}

	static getNewId() {
		let id = 1;

		while (store.getState().locations[id]) {
			id++;
		}
		return id;
	}

	static getLocation(id) {
		if (!store.getState().locations[id]) {
			return false;
		} else {
			return store.getState().locations[id];
		}
	}

	static getLocationHandler(id) {
		let location = LocationsManager.getLocation(id);

		if (!location) {
			return false;
		} else {
			if (!handlers[location.type]) {
				return false;
			} else {
				return handlers[location.type];
			}
		}
	}
}

export default LocationsManager;
