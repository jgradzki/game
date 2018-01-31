import { Player } from '../../../player';

export interface EatEffects {
	hunger?: number;
}
export interface IEatable {
	eatEffects: EatEffects;
	eat(player: Player): boolean; // Remove item after;
}
