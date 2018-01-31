import { isNumber } from 'lodash';
import axios from 'axios';
import { log } from '../libs/debug';
import { store } from './store';


import { setPlayerInventory, setPlayerHP, setPlayerEnergy, setPlayerHunger } from '../actions/player';

export const onMenuAction = (action, slot) => {
	axios.post('game/player/inventory',
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
				if (isNumber(data.hp)) {
					store.dispatch(setPlayerHP(data.hp));
				}
				if (isNumber(data.energy)) {
					store.dispatch(setPlayerEnergy(data.energy));
				}
				if (isNumber(data.hunger)) {
					store.dispatch(setPlayerHunger(data.hunger));
				}
			}
		})
		.catch(error => {
			log('error', error);
		});
};
