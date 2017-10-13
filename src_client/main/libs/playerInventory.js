import _ from 'lodash';
import { log } from '../libs/debug';
import { store } from './store';
import makeRequest from '../libs/request';

import { setPlayerInventory, setPlayerHP, setPlayerEnergy, setPlayerHunger } from '../actions/player';

export const onMenuAction = (action, slot) => {
	makeRequest('playerAction',
		{
			type: action,
			slot
		}
	)
		.then(response => response.data)
		.then(data => {
			if (data.error) {
				log('error', data);
			}

			if (data.success) {
				if (data.inventory) {
					store.dispatch(setPlayerInventory(data.inventory));
				}
				if (_.isNumber(data.hp)) {
					store.dispatch(setPlayerHP(data.hp));
				}
				if (_.isNumber(data.energy)) {
					store.dispatch(setPlayerEnergy(data.energy));
				}
				if (_.isNumber(data.hunger)) {
					store.dispatch(setPlayerHunger(data.hunger));
				}
			}
		})
		.catch(error => {
			log('error', error);
		});
};
