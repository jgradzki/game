//import { store } from './store.js'
//import { addMapElement } from '../actions/mapAction.js'
import { logger } from '../logger';

let currentState = {};

export default class MapManager {

	static init() {
		store.subscribe(()=>{
			let oldState = currentState;

			currentState = store.getState().locations;

			if (store.getState().lastAction == 'addLocation') {
				//dodac wysylanie do graczy nowych lokacji i ew. aktualizacje starych "na zywo"
			}
		});
	}

	static filtreElement(e) {
		//zastanowic sie co dokladnie ma byc wysylane do klienta(getElementsForPlayer) a co nie i przefiltrowac
		return {
			id: e.id,
			icon: e.mapIcon,
			position: e.position,
			size: e.size
		};
	}

	static getElement(id) {
		if (!store.getState().locations[id]) {
			return false;
		} else {
			if (!store.getState().locations[id].visibilityRules.onMap) {
				return false;
			} else {
				return  MapManager.filtreElement(store.getState().locations[id]);
			}
		}
	}

	static checkRules(rules, id) {
		return 	(rules.owner === id) ||
				(rules.global) ||
				(rules.for === id);
	}

	static getElementsForPlayer(id) {
		let elements = {};
		let storeElements = Object.assign({}, store.getState().locations);

		for (let key in storeElements) {
			if ( MapManager.checkRules(storeElements[key].visibilityRules, id) ) {
				elements[key] = MapManager.filtreElement(storeElements[key]);
			}
		}

		return elements;
	}
}
