/*
	type
	name
	rollChance,
	maxStack,
	combat: { --item can be set as weapon
		type[melee|range]
		attack --attack power
		speed --attack speed
	}
	eat: { --item can be eaten(removed)
		food --how much restores hunger
	}
	use: { item can be used[not implemented]

	}

*/

module.exports = {
	MATERIAL_WOOD: {
		type: 'material',
		name: 'Drewno',
		rollChance: 80,
		maxStack: 8
	},
	MATERIAL_JUNK: {
		type: 'material',
		name: 'Złom',
		rollChance: 80,
		maxStack: 12
	},
	MATERIAL_NAIL: {
		type: 'material',
		name: 'Gwoździe',
		rollChance: 20,
		minStack: 2,
		maxStack: 24
	},
	MATERIAL_WOOD_NAIL: {
		type: 'material',
		name: 'Deska z gwoźdzmi',
		rollChance: 25,
		maxStack: 6,
		combat: {
			type: 'melee',
			attack: 5,
			speed: 2
		}
	},
	MATERIAL_GUNPOWDER: {
		type: 'material',
		name: 'Proch',
		rollChance: 0,
		maxStack: 15
	},
	MATERIAL_BULLET_CASE_9mm: {
		type: 'material',
		name: 'Łuska 9mm',
		rollChance: 0,
		maxStack: 30
	},
	MATERIAL_BULLET_CASE_45: {
		type: 'material',
		name: 'Łuska .45',
		rollChance: 0,
		maxStack: 30
	},
	MATERIAL_BULLET_CASE_7_62mm: {
		type: 'material',
		name: 'Łuska 7.62 mm',
		rollChance: 0,
		maxStack: 30
	},
	MATERIAL_BULLET_CASE_5_56mm: {
		type: 'material',
		name: 'Łuska 5.56 mm',
		rollChance: 0,
		maxStack: 30
	},
	FOOD_SMALL_CAN: {
		type: 'food',
		name: 'Mała konserwa',
		rollChance: 20,
		maxStack: 6,
		eat: {
			hunger: 30
		}
	},
	FOOD_LARGE_CAN: {
		type: 'food',
		name: 'Duża konserwa',
		rollChance: 15,
		maxStack: 3,
		eat: {
			hunger: 60
		}
	},
	TOOL_AXE: {
		type: 'tool',
		name: 'Siekiera',
		rollChance: 10,
		maxStack: 1,
		combat: {
			type: 'melee',
			attack: 10,
			speed: 3
		}
	},
	TOOL_HAMMER: {
		type: 'tool',
		name: 'Młotek',
		rollChance: 10,
		maxStack: 1,
		combat: {
			type: 'melee',
			attack: 7,
			speed: 3
		}
	},
	TOOL_SCREWDRIVER: {
		type: 'tool',
		name: 'Śrubokręt',
		rollChance: 10,
		maxStack: 1,
		combat: {
			type: 'melee',
			attack: 5,
			speed: 4
		}
	},
	TOOL_BLADE: {
		type: 'tool',
		name: 'Brzeszczot',
		rollChance: 10,
		maxStack: 1
	},
	TOOL_CROWBAR: {
		type: 'tool',
		name: 'Łom',
		rollChance: 10,
		maxStack: 1,
		combat: {
			type: 'melee',
			attack: 8,
			speed: 3
		}
	}
	//noz kuchenny, maczeta, zaostrzony kij(c), baseball, baseball z gwozdzmi(c), drewniana belka z gwozdzmi(c)
	//: pistolet 9mm, .45
	//karabinek 7.62 mm, 5.56 mm
	//naboje 9mm, .45, 7.62 mm, 5.56 mm
};
