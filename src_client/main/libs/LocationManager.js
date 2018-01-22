import { store } from './store';
import axios from 'axios';
import * as locationActions from '../actions/location';
import { setPlayerInLocation } from '../actions/player';
import { setError } from '../actions/error';
import { log } from '../libs/debug';


class LocationManager {

	static enterLocation(type, data = {}) {
		log('LocationManager', 'EnterLocation');

		store.dispatch(locationActions.setLocationType(type));
		store.dispatch(locationActions.setLocationInitialData(data));
		store.dispatch(setPlayerInLocation(true));
	}

	static exitLocation() {
		log('LocationManager', 'ExitLocation');

		store.dispatch(setPlayerInLocation(false));
		store.dispatch(locationActions.setLocationType(null));
	}

	static requestLocationEnter(id, type) {
		axios.post('game/location/enter', { id, type })
			.then(response => response.data)
			.then(data => {
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
		axios.post('game/location/exit', { })
			.then(response => response.data)
			.then(data => {
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
			throw {
				code: 3011,
				msg: 'no data reveived'
			};
		} else {
			if (data.error) {
				throw {
					code: 3012,
					msg: data.error
				};
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
