import { round, forEach, filter } from 'lodash';
import { Player } from '../player/player.entity';
import { IEnemy } from '../locations/interfaces/enemy.interface';
import { IMeleeWeapon } from '../items/interfaces/attributes/melee-wepon';

export const runFight = (player: Player, enemies: IEnemy[]) => {
	let log = '';
	let tick = 0;
	let playerLastTurn = 0;
	const playerWeapon = ((player.meleeWeapon as any) as IMeleeWeapon);
	const playerAttackSpeed = round(50 / ((playerWeapon && playerWeapon.combat.speed) || 4));
	const playerAttackPower = (playerWeapon && playerWeapon.combat.attack) || 5;

	log += `Liczba napotkanych przeciwników: ${enemies.length}.\n`;
	forEach(enemies, enemy =>  log += `${enemy.name} `);
	log += '\n';

	while (player.hp > 0 && enemies.length > 0) {
		forEach(enemies, (enemy, number) => {
			const enemySpeed = round(50 / (enemy.attackSpeed || 3));
			const attackPower = enemy.attackPower || 5;
			const lastTurn = (enemy as any).lastTurn || 0;

			if ((lastTurn + enemySpeed) >= tick) {
				player.hp -= attackPower;
				(enemy as any).lastTurn = tick;
				log += `Przeciwnik ${number + 1}(${enemy.name}) atakuje i zadaje ${attackPower}.\n`;
			}
		});

		if (player.hp > 0) {
			if ((playerLastTurn + playerAttackSpeed) >= tick) {
				const enemy = enemies[0];

				enemy.hp -= playerAttackPower;
				if (enemy.hp > 0) {
					log += `Zadajesz ${playerAttackPower} obrażeń dla ${enemy.name}.\n`;
				} else {
					log += `Zadajesz ${playerAttackPower} obrażeń i zabijasz ${enemy.name} .\n`;
				}
				playerLastTurn = tick;
			}

			enemies = filter(enemies, enemy => enemy.hp > 0);
		}

		tick++;
	}

	if (player.hp <= 0) {
		log += 'Zginąłeś.\n';
	}
	if (enemies.length === 0) {
		log += 'Pokonałeś wszystkich wrogów.\n';
		enemies = null
	}

	return {
		log,
		enemies
	};
};
