import { store } from './store';
import locationAction from '../actions/location';
import { setPlayerInLocation } from '../actions/player';
import locations from '../locations/locations.jsx';
import { setError } from '../actions/error';
import { log } from '../libs/debug';

class LocationManager {

	static get location() {
		if (!locations[store.getState().location.locationType]) {
			return locations.default;
		} else {
			return locations[store.getState().location.locationType];
		}
	}

	static enterLocation(type, data = {}) {
		log('LocationManager', 'EnterLocation');

		if (locations[type]) {
			locations[type].onEnter(data);
		}

		store.dispatch(locationAction.setLocationType(type));
		store.dispatch(setPlayerInLocation(true));
	}

	static exitLocation() {
		log('LocationManager', 'ExitLocation');
		LocationManager.location.onExit();
		store.dispatch(setPlayerInLocation(false));
		store.dispatch(locationAction.setLocationType(null));
	}

	static requestLocationEnter(id) {
		$.post('/game/request', { type: 'enterLocation',
			id }, (data) => {
			try {
				LocationManager._postRespond(data);
			} catch (e) {
				log('LocationManager', e);
				store.dispatch(setError(
					'Blad podczas przetwarzania rzadania(' + (e.code ? e.code : e) + ')',
					e.msg
				));
			}
		} );
	}

	static requestLocationExit() {
		$.post('/game/request', { type: 'exitLocation' }, (data) =>{
			try {
				LocationManager._postRespondExit(data);
			} catch (e) {
				log('LocationManager', e);
				store.dispatch(setError(
					'Blad podczas przetwarzania rzadania(' + (e.code ? e.code : e) + ')',
					e.msg
				));
			}
		} );
	}

	static _postRespond(data) {
		log('LocationManager', '_postRespond data:', data);

		if (!data) {
			throw {code: 3001,
				msg: 'no data reveived'};
		} else {
			if (data.error) {
				throw {code: 3002,
					msg: data.error};
			} else {
				if (data.success) {
					if (!data.type) {
						throw { 
							code: 3003,
							msg: 'No type.' 
						};
					}

					LocationManager.enterLocation(data.type, data.data);

				} else {
					throw {
						code: 3004,
						msg: 'wrong data: ' 
					};
				}
			}
		}
	}

	static _postRespondExit(data) {
		log('LocationManager', '_postRespond data:', data);
		if (!data) {
			throw {code: 3011,
				msg: 'no data reveived'};
		} else {
			if (data.error) {
				throw {code: 3012,
					msg: data.error};
			} else {
				if (data.success) {
					LocationManager.exitLocation();
				} else {
					store.dispatch(setError(data.error));
				}
			}
		}
	}
}

export default LocationManager;
