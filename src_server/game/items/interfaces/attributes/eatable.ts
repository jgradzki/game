import { Player } from '../../../player/player.entity';

export interface EatEffects {
	hunger?: number;
}
export interface IEatable {
	eatEffects: EatEffects;
	eat(player: Player): boolean; // Remove item after;
}
