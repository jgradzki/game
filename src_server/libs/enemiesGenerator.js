import _ from 'lodash';
import { roll } from './functions';
import enemiesDataBase from '../data/enemies';

const enemiesGenerator = (maxEnemies, difficulty) => {
	let enemies = [];

	while (
		(enemies.length < maxEnemies) &&
		roll(0, 100) < (25*(_.ceil(difficulty/2))/(enemies.length+1))
	) {
		let enemy = undefined;
		let tries = 0;

		do {
			enemy = enemiesDataBase[roll(0, enemiesDataBase.length - 1)];
			if (enemy.minDifficulty && enemy.minDifficulty > difficulty) {
				enemy = undefined;
			}
			tries++;
		}
		while (!enemy && (tries < 10) );

		if (enemy) {
			enemies.push(enemy);
		}
	}

	return enemies;
};

export default enemiesGenerator;
