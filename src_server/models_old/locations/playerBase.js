import Location from './location.js';


class PlayerBase extends Location {
	constructor() {
		super();
	}

	static getType() {
    	return 'playerBase';
	}

	static add(id, type, position, size, visibilityRules, isPerm = false, data = {}) {
		Location.add(id, type, position, size, visibilityRules, 'home', isPerm = false, data);
	}

	static getDataForPlayer(locationId, playerId) {
		return {
            
		};
	}
	static onPlayerEnter(locationId, playerId) {
    	let location = super.get(locationId);   	
	} 
}

export default PlayerBase;