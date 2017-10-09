import _ from 'lodash';
import { roll } from './functions';
import enemiesGenerator from './enemiesGenerator';
import items from '../data/items';


/**
 * Whole file needs rewrite.
 */

let odds = {
	1: 60,
	2: 45,
	3: 25,
	4: 0
};

let directions = {
	1: 'up',
	2: 'down',
	3: 'left',
	4: 'right'
};

let rollDirection = () => {
	return directions[roll(1, 4)];
};

let rollDoors = (room, maxCount, exclude) => {
	let rollsCount = 1;

	while (roll(1, 100) < odds[rollsCount]) {
		if (rollsCount >= maxCount) {
			break;
		}
		while (true) {
			let direction = rollDirection();

			if (exclude) {
				if (exclude[direction]) {
					continue;
				}
			}
			if (!room[direction]) {
				room[direction] = true;
				break;
			}
		}
		rollsCount++;
	}
	return room;
};


let rollRoomsRandomV1 = (minRooms, maxRooms) => {
	let rooms = {};
	let tree = 0;
	let roomLastId = 1;
	//let roomsC = roll(minRooms, maxRooms);
	let roomCount = 0;
	let vertical = 0;

	let countRooms = (room) => {
		if (room.up === true) {
			roomCount++;
		}
		if (room.down === true) {
			roomCount++;
		}
		if (room.left === true) {
			roomCount++;
		}
		if (room.right === true) {
			roomCount++;
		}
	};

	let checkRoomCount = () => {
		let nextRoomDoorsCount = 3;

		if ((maxRooms - roomCount) < 3) {
			nextRoomDoorsCount = (maxRooms - roomCount);
		}
		if (nextRoomDoorsCount < 0) {
			nextRoomDoorsCount = 0;
		}
		return nextRoomDoorsCount;
	};

	let createRoom = (room) => {
		if (room.up === true) {
			room.up = { id: ++roomLastId };
			room.up = rollDoors(room.up, checkRoomCount(), { down: true });
			countRooms(room.up);
			tree++;
			vertical++;
			createRoom(room.up);
			vertical--;
		}
		if (room.down === true) {
			if (vertical < 0) {
				room.down = false;
			} else {
				room.down = { id: ++roomLastId };
				room.down = rollDoors(room.down, checkRoomCount(), { up: true });
				countRooms(room.down);
				tree++;
				vertical--;
				createRoom(room.down);
				vertical++;
			}
		}
		if (room.left === true) {
			room.left = { id: ++roomLastId };
			room.left = rollDoors(room.left, checkRoomCount(), { right: true });
			countRooms(room.left);
			tree++;
			createRoom(room.left);
		}
		if (room.right === true) {
			room.right = { id: ++roomLastId };
			room.right = rollDoors(room.right, checkRoomCount(), { left: true });
			countRooms(room.right);
			tree++;
			createRoom(room.right);
		}

		if ((tree === 0) && (roomCount < minRooms)) {
			//force more rooms
			if (!room.up) {
				room.up = true;
				tree++;
				createRoom(room);
			}
			if (!room.left) {
				room.left = true;
				tree++;
				createRoom(room);
			}
			if (!room.right) {
				room.right = true;
				tree++;
				createRoom(room);
			}
		}


		tree--;
	};

	//Creating main room
	let rollsCount = 1;

	do {
		while (true) {
			let direction = rollDirection();

			if (direction === 'down') {
				continue;
			}
			if (!rooms[direction]) {
				rooms[direction] = true;
				break;
			}
		}
		rollsCount++;
	} while (roll(1, 100) < odds[rollsCount]);
	rooms.id = 1;
	countRooms(rooms);
	//Creating rest rooms
	createRoom(rooms);

	return rooms;
};


let rollRoomsRandomV2 = (minRooms, maxRooms, mapSize) => {

	//Creating  empty map
	let roomMap = [];

	for (let y = 1; y <= mapSize.height; y++) {
		for (let x = 1; x <= mapSize.width; x++) {
			if (x === 1) {
				roomMap[y] = [];
			}
			roomMap[y][x] = { is: false,
				lock: false,
				doors: {} };
		}
	}

	//main room
	let mainRoomX = Math.round(mapSize.width / 2);

	roomMap[1][mainRoomX] = {
		is: true,
		lock: true,
		doors: {}
	};

	//Random empty spaces
	let lockedRooms = 0;
	let i = 1;

	while (i < (mapSize.width + mapSize.height)) {
		if (lockedRooms > (mapSize.width * mapSize / 2)) { //pustych mijesc nie wiecej niz polowa mapy
			break;
		}

		let cx = roll(1, mapSize.width);
		let cy = roll(1, mapSize.height);

		let sizeX = roll(1, Math.ceil(mapSize.width * 0.2));
		let sizeY = roll(1, Math.ceil(mapSize.width * 0.2));
		let startX = cx - sizeX;
		let startY = cy - sizeY;

		if (startX < 1) {
			startX = 1;
		}
		if (startY < 1) {
			startY = 1;
		}
		if (startX > mapSize.width) {
			startX = mapSize.width;
		}
		if (startY > mapSize.height) {
			startX = mapSize.height;
		}

		if (roomMap[cy][cx].lock) {
			continue;
		}

		for (let y = startY; y < startY + sizeY; y++) {
			for (let x = startX; x < startX + sizeX; x++) {
				if (!roomMap[y][x].lock) {
					roomMap[y][x].lock = true;
				}
			}
		}
		i++;
	}

	//Filing rooms
	for (let y = 1; y <= mapSize.height; y++) {
		for (let x = 1; x <= mapSize.width; x++) {
			if (!roomMap[y][x].lock) {
				roomMap[y][x].is = true;
			}
		}
	}


	let mapSettings = {
		rooms: roomMap,
		mainRoom: { y: 1,
			x: mainRoomX }
	};

	return mapSettings;

};

let rollRoomsRandomV3 = (minRooms, maxRooms) => {
	let rooms = rollRoomsRandomV1(minRooms, maxRooms);
	let roomMap = [];

	let maxLeft = 0, maxRight = 0, maxTop = 0, maxDown = 0;
	let vertical = 0, horizontal = 0;


	let res = (room) => {
		if (horizontal > 0) {
			if (horizontal > maxRight) {
				maxRight = horizontal;
			}
		}
		if (horizontal < 0) {
			if (-(horizontal) > maxLeft) {
				maxLeft = -(horizontal);
			}
		}

		if (vertical > 0) {
			if (vertical > maxTop) {
				maxTop = vertical;
			}
		}
		if (vertical < 0) {
			if (-(vertical) > maxDown) {
				maxDown = -(vertical);
			}
		}

		if (room.left) {
			horizontal--;
			res(room.left);
			horizontal++;
		}
		if (room.right) {
			horizontal++;
			res(room.right);
			horizontal--;
		}
		if (room.up) {
			vertical--;
			res(room.up);
			vertical++;
		}
		if (room.down) {
			vertical++;
			res(room.down);
			vertical--;
		}
	};

	res(rooms);
	//console.log(rooms)
	//console.log(maxLeft, maxRight, maxTop, maxDown)

	let width = (maxLeft + maxRight);
	let height = (maxTop + maxDown);
	//console.log(height, width)

	for (let y = 0; y <= (height); y++) {
		for (let x = 0; x <= (width); x++) {
			//console.log('r', y, x)
			if (x === 0) {
				roomMap[y] = [];
			}
			roomMap[y][x] = { is: false,
				lock: false,
				doors: {} };
		}
	}
	//console.log('dsa', roomMap.length, roomMap[1].length)
	//console.log(roomMap[1])
	let mainRoomX = maxLeft;
	let mainRoomY = maxDown;

	//console.log('main', mainRoomY, mainRoomX);

	let x = mainRoomX;
	let y = mainRoomY;
	//console.log(y, x)
	let convert = (room) => {
		//console.log('f', y, x)
		roomMap[y][x].is = true;
		roomMap[y][x].lock = true;


		if (room.left) {
			roomMap[y][x].doors.left = true;
			x--;
			if (roomMap[y] && roomMap[y][x]) {
				roomMap[y][x].doors.right = true;
				convert(room.left);
			}
			x++;
		}
		if (room.right) {
			roomMap[y][x].doors.right = true;
			x++;
			if (roomMap[y] && roomMap[y][x]) {
				roomMap[y][x].doors.left = true;
				convert(room.right);
			}
			x--;
		}
		if (room.up) {
			roomMap[y][x].doors.up = true;
			y--;
			if (roomMap[y] && roomMap[y][x]) {
				roomMap[y][x].doors.down = true;
				convert(room.up);
			}
			y++;
		}
		if (room.down) {
			roomMap[y][x].doors.down = true;
			y++;
			if (roomMap[y] && roomMap[y][x]) {
				roomMap[y][x].doors.up = true;
				convert(room.down);
			}
			y--;
		}
	};

	convert(rooms);

	let mapSettings = {
		rooms: roomMap,
		//old: rooms,
		mainRoom: { y: mainRoomY,
			x: mainRoomX }
	};

	return mapSettings;
};

const rollItemsAndEnemies = (rooms, maxEnemies, difficulty) => {
	rooms.forEach((y)=>{
		y.forEach((x)=>{
			if (x.is) {
				x.items = [];
				_.forEach(items, (item, key) => {
					if (item.rollChance > 0) {
						let count = 0;

						while (roll(1, 100) < item.rollChance) {
							count++;

							if (count > item.maxStack) {
								count -= item.maxStack;

								x.items.push({
									name: key,
									type: item.type,
									fullName: item.name,
									count: item.maxStack
								});
							}
						}

						if (count > 0 ) {
							x.items.push({
								name: key,
								type: item.type,
								fullName: item.name,
								count: item.maxStack
							});
						}
					}
				});

				x.enemies = enemiesGenerator(maxEnemies, difficulty);
			}
		});
	});

	return rooms;
};


let rollRooms = (options = {}) => {
	options = {
		type: options.type || 'randomV3',
		min: options.min || 5,
		max: options.max || 10,
		width: options.width || 5,
		height: options.height || 5,
		maxEnemies: options.maxEnemies || 3,
		difficulty: options.difficulty || 1
	};

	if (options.type === 'randomV1') {
		return rollRoomsRandomV1(options.min, options.max);
	} else if (options.type === 'randomV2') {
		return rollRoomsRandomV2(options.min, options.max, { width: options.width,
			height: options.height });
	} else if (options.type === 'randomV3') {
		let dungeon = rollRoomsRandomV3(options.min, options.max);

		return {
			...dungeon,
			rooms: rollItemsAndEnemies(dungeon.rooms, options.maxEnemies, options.difficulty)
		};

	}

};

module.exports = {
	rollRooms
};
