const mapIcons = {
	HOME: { img: 'img/home.png' },
	BUILDING: { img: 'img/place.png' },
	PLAYER: { img: 'img/dot.png' },
	DESTINATION: { img: 'img/point.png' }
};

const mapPosition = {
	top: 100,
	left: 150
};

const playerSize = {
	width: 20,
	height: 20
};
const destSize = {
	width: 20,
	height: 20
};

const mapElements = [];

const systemReducerInitial = {
	loading: {},
	deadMode: false,
};

const mapStateReducerInitial = {
	size: {
		width: 800,
		height: 700
	},
	test: 0,
	position: {
		x: 0,
		y: 0
	},
	initial: {
		x: 0,
		y: 0
	},
	dragging: false,
	changed: false,
	mapElements,
	playerPosition: {
		x: 0,
		y: 0
	},
	destination: undefined
};

const playerReducerInitial = {
	name: 'unknown',
	hp: 0,
	energy: 0,
	inLocation: false,
	inventory: []
};

const locationReducerInitial = {

};

module.exports = {
	settings: {
		mapIcons,
		mapPosition,
		playerSize,
		destSize
	},
	systemReducerInitial,
	mapStateReducerInitial,
	playerReducerInitial,
	locationReducerInitial
};
