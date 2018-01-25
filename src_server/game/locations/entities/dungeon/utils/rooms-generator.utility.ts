import { IRoom } from '../interfaces/room.interface';
import { forEach } from 'lodash';

const odds = {
	1: 60,
	2: 45,
	3: 25,
	4: 0
};

const directions = {
	1: 'up',
	2: 'down',
	3: 'left',
	4: 'right'
};

/**
 * @param min {number} - Minimal count of rooms.
 * @param max {number} - Maximal count of rooms.
 */
export const generateRooms = (min: number = 2, max: number = 3): {
	entry: {x: number, y: number}
	rooms: {[s: number]: {[s: number]: IRoom }}
} => {
	if (min < 1) {
		min = 1;
	}

	if (max < min) {
		max = min;
	}

	const countOfRoomsToGenerate = roll(min, max);
	const roomsData = {
		entry: {x: 0, y: 0},
		rooms: {}
	};
	const roomsCount = 1;
	const currentRoomLoc = {x: 0, y: 0};

	// Generate map
	for (let x = -max; x <= max; x++) {
		roomsData.rooms[x] = {};
		for (let y = -max; y <= max; y++) {
			roomsData.rooms[x][y] = {
				lock: false,
				doors: {}
			};
		}
	}

	roomsData.rooms = generateLockedChunks(roomsData, max).rooms;

	// Entry room
	roomsData.rooms[0][0]  = createRoom(exclude(roomsData.rooms, 0, 0), countOfRoomsToGenerate - roomsCount, null, min);
	// Rest rooms
	roomsData.rooms = generate({
		attempts: 0,
		rooms: roomsData.rooms,
		roomsCount,
		countOfRoomsToGenerate,
		currentRoomLoc,
		entryDirection: null,
		forceCount: min - 3
	}).rooms;

	const rawRooms = {};
	// Delete non-room chunks
	forEach(roomsData.rooms, (v, x) => {
		let rawX;

		forEach(v, (room, y) => {
			if (!room.lock && room.lock !== false) {
				if (!rawX) {
					rawX = {};
				}

				rawX[y] = room;
			}
		});

		if (rawX) {
			rawRooms[x] = rawX;
		}
	});

	roomsData.rooms = rawRooms;

	return roomsData;
};

interface IGeneratorData {
	rooms: {[s: number]: {[s: number]: IRoom }};
	roomsCount: number;
	countOfRoomsToGenerate: number;
	currentRoomLoc: {x: number, y: number};
	entryDirection: string | null;
	forceCount?: number;
	attempts: number;
}
const generateLockedChunks = (roomsData, max) => {
	const colide = (startX, startY, posX, posY, width, height): boolean => {
		const x = startX + posX;
		const y = startY + posY;
		const check = (tX, tY): boolean => {
			if ((tX === 0) && (tY === 0)) {
				return true;
			}

			if ((tX >= startX) && (tX <= width) && (tY >= startY) && (tY <= height)) {
				return false;
			}

			if (roomsData.rooms[tX] && roomsData.rooms[tX][tY] && roomsData.rooms[tX][tY].lock) {
				return true;
			}

			return false;
		};

		if (!roomsData.rooms[x] || !roomsData.rooms[x][y]) {
			return true;
		}

		if (check(x, y) ||
			check(x + 1, y) ||
			check(x + 1, y + 1) ||
			check(x + 1, y - 1) ||
			check(x - 1, y) ||
			check(x - 1, y + 1) ||
			check(x - 1, y - 1) ||
			check(x, y + 1) ||
			check(x, y - 1)
		) {
			return true;
		}

		return false;
	};

	for (let attempts = 0; attempts < 1000; attempts++) {
		const c_x = roll(-max, max);
		const c_y = roll(-max, max);

		if (((c_x > -1) && (c_x < 1)) || ((c_y > -1) && (c_y < 1))) {
			continue;
		}

		const size_w = roll(1, Math.ceil(max / 10));
		const size_h = roll(1, Math.ceil(max / 10));
		let correct = true;

		for (let x = 0; x < size_w; x++) {
			for (let y = 0; y < size_h; y++) {
				if (colide(c_x, c_y, x, y, size_w, size_h)) {
					correct = false;
				}
			}
		}

		if (correct) {
			for (let x = 0; x < size_w; x++) {
				for (let y = 0; y < size_h; y++) {
					roomsData.rooms[c_x + x][c_y + y].lock = true;
				}
			}
		}
	}

	for (let x = -max; x <= max; x++) {
		for (let y = -max; y <= max; y++) {
			if (!roomsData.rooms[x][y].lock) {
				if (!colide(x, y, 0, 0, 1, 1)) {
					roomsData.rooms[x][y].lock = true;
				}
			}
		}
	}

	return roomsData;
}
const exclude = (rooms, x, y) => {
	const check = (tX, tY): boolean => {
		if (!rooms[tX] || !rooms[tX][tY] || rooms[tX][tY].lock) {
			return true;
		}

		return false;
	};
	const toExclude = {
		up: false,
		down: false,
		left: false,
		right: false
	};

	if (check(x + 1, y)) {
		toExclude.up = true;
	}

	if (check(x - 1, y)) {
		toExclude.down = true;
	}

	if (check(x, y + 1)) {
		toExclude.right = true;
	}

	if (check(x, y - 1)) {
		toExclude.left = true;
	}

	return toExclude;
};

const generate = (data: IGeneratorData): IGeneratorData => {
	const { countOfRoomsToGenerate, rooms, currentRoomLoc, entryDirection } = data;
	const currentRoom = rooms[currentRoomLoc.x][currentRoomLoc.y];
	let { roomsCount, attempts } = data;

	if (attempts > 100) {
		return {
			rooms,
			roomsCount,
			countOfRoomsToGenerate,
			currentRoomLoc,
			attempts,
			entryDirection
		};
	}

	attempts++;
	if (!data.forceCount || data.forceCount < 0) {
		data.forceCount = 0;
	}

	if (currentRoom.doors.up && (entryDirection !== 'up')) {
		const newRoom = createRoom(
			exclude(rooms, currentRoomLoc.x, currentRoomLoc.y - 1),
			countOfRoomsToGenerate - getDoorsCount(currentRoom) - roomsCount,
			'down',
			data.forceCount
		);

		checkLoc(rooms, currentRoomLoc.x);
		rooms[currentRoomLoc.x][currentRoomLoc.y - 1] = newRoom;
		roomsCount++;
		generate({
			rooms,
			roomsCount,
			countOfRoomsToGenerate,
			currentRoomLoc: {
				x: currentRoomLoc.x,
				y: currentRoomLoc.y - 1
			},
			entryDirection: 'down',
			forceCount: data.forceCount - getDoorsCount(newRoom),
			attempts
		});
	}

	if (currentRoom.doors.down && (entryDirection !== 'down')) {
		const newRoom = createRoom(
			exclude(rooms, currentRoomLoc.x, currentRoomLoc.y + 1),
			countOfRoomsToGenerate - getDoorsCount(currentRoom) - roomsCount,
			'up',
			data.forceCount
		);

		checkLoc(rooms, currentRoomLoc.x);
		rooms[currentRoomLoc.x][currentRoomLoc.y + 1] = newRoom;
		roomsCount++;
		generate({
			rooms,
			roomsCount,
			countOfRoomsToGenerate,
			currentRoomLoc: {
				x: currentRoomLoc.x,
				y: currentRoomLoc.y + 1
			},
			entryDirection: 'up',
			forceCount: data.forceCount - getDoorsCount(newRoom),
			attempts
		});
	}

	if (currentRoom.doors.right && (entryDirection !== 'right')) {
		const newRoom = createRoom(
			exclude(rooms, currentRoomLoc.x + 1, currentRoomLoc.y),
			countOfRoomsToGenerate - getDoorsCount(currentRoom) - roomsCount,
			'left',
			data.forceCount
		);

		checkLoc(rooms, currentRoomLoc.x + 1);
		rooms[currentRoomLoc.x + 1][currentRoomLoc.y ] = newRoom;
		roomsCount++;
		generate({
			rooms,
			roomsCount,
			countOfRoomsToGenerate,
			currentRoomLoc: {
				x: currentRoomLoc.x + 1,
				y: currentRoomLoc.y
			},
			entryDirection: 'left',
			forceCount: data.forceCount - getDoorsCount(newRoom),
			attempts
		});
	}

	if (currentRoom.doors.left && (entryDirection !== 'left')) {
		const newRoom = createRoom(
			exclude(rooms, currentRoomLoc.x - 1, currentRoomLoc.y),
			countOfRoomsToGenerate - getDoorsCount(currentRoom) - roomsCount,
			'right',
			data.forceCount
		);

		checkLoc(rooms, currentRoomLoc.x - 1);
		rooms[currentRoomLoc.x - 1][currentRoomLoc.y ] = newRoom;
		roomsCount++;
		generate({
			rooms,
			roomsCount,
			countOfRoomsToGenerate,
			currentRoomLoc: {
				x: currentRoomLoc.x - 1,
				y: currentRoomLoc.y
			},
			entryDirection: 'right',
			forceCount: data.forceCount - getDoorsCount(newRoom),
			attempts
		});
	}

	return {
		rooms,
		roomsCount,
		countOfRoomsToGenerate,
		currentRoomLoc,
		attempts,
		entryDirection,
	};
};

const createRoom = (excludeDoors, freeDoors: number = 0, entryDirection = '', force: number = 0): IRoom => {
	const room: IRoom = {
		doors: {}
	};

	if (entryDirection) {
		room.doors[entryDirection] = true;
		rollDoors(room, freeDoors - 1, {[entryDirection]: true, ...excludeDoors}, force);
	} else {
		rollDoors(room, freeDoors, excludeDoors, force);
	}

	return room;
};

const roll = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const rollDirection = () => {
	return directions[roll(1, 4)];
};

const rollDoors = (room: IRoom, maxCount = 0, excludeDoors?: {[s: string]: boolean}, force = 0): IRoom => {
	let rollsCount = 1;

	if (maxCount > 3) {
		maxCount = 3;
	}

	if (force > 3) {
		force = 3;
	}

	if (excludeDoors && excludeDoors.up && excludeDoors.down && excludeDoors.left && excludeDoors.right) {
		return room;
	}

	let attempts = 0;

	while ((attempts < 20) && ((roll(1, 100) < odds[rollsCount]) || (force > rollsCount))) {
		if (rollsCount > maxCount) {
			break;
		}

		while (attempts < 20) {
			const direction = rollDirection();
			attempts++;

			if (excludeDoors && excludeDoors[direction]) {
				continue;
			}
			if (!room.doors[direction]) {
				room.doors[direction] = true;
				break;
			}
		}

		rollsCount++;
	}

	return room;
};

const checkLoc = (rooms: {[s: number]: {[s: number]: IRoom }}, x: number) => {
	if (!rooms[x]) {
		rooms[x] = {};
	}
};

const getDoorsCount = (room: IRoom): number => {
	let count = 0;

	if (room.doors.up) count++;
	if (room.doors.down) count++;
	if (room.doors.left) count++;
	if (room.doors.right) count++;

	return count;
};
