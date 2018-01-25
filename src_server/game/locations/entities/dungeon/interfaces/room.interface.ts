export interface IRoom {
	doors: {
		up?: boolean,
		down?: boolean,
		left?: boolean,
		right?: boolean
	};
	lock?: boolean
}
