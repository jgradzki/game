/*
	key --key from items
	count --how many is needed,
	preserve[true/false] --remove or not item from inventory after upgrade
*/
module.exports = {
	PLAYER_BASE: {
		WORKSHOP: {
			LEVELS: [
				[
					{key: 'MATERIAL_WOOD', count: 10},
					{key: 'MATERIAL_JUNK', count: 10}
				],
				[
					{key: 'MATERIAL_WOOD', count: 30},
					{key: 'MATERIAL_JUNK', count: 100},
					{key: 'TOOL_BLADE', count: 1, preserve: true}
				]
			]
		}
	}
};
