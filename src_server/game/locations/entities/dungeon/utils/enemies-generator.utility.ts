import { forEach, filter, ceil } from 'lodash';
import { roll } from './';

import { IRoom, IRooms } from '../interfaces/room.interface';
import { IEnemy } from '../../../interfaces/enemy.interface';
import enemies from '../../../../data/enemies';

export default (rooms: IRooms, difficulty = 1, maxEnemies = 2): IRooms => {
	const filteredEnemies =  filter(enemies, enemy => enemy.minDifficulty <= difficulty);

	if (filteredEnemies.length === 0 ) {
		return rooms;
	}

	forEach(rooms, row => {
		forEach(row, room => {
			const enemiesList = rollEnemies(filteredEnemies, difficulty, maxEnemies);

			if (enemiesList && enemiesList.length > 0){
				room.enemies = enemiesList;
			}
		});
	});

	return rooms;
};

const rollEnemies = (filteredEnemies, difficulty = 1, maxEnemies = 2) => {
	let enemiesList = [];

	while (
		(enemiesList.length < maxEnemies) &&
		roll(0, 100) < (20 * (ceil((difficulty + 3) / 2)) / (enemiesList.length + 1))
	) {
		const rolled = roll(0, filteredEnemies.length - 1);
		const enemy = filteredEnemies[rolled];
		enemiesList.push(enemy);
	}

	if (enemiesList.length === 0) {
		enemiesList = null;
	}

	return enemiesList;
};
