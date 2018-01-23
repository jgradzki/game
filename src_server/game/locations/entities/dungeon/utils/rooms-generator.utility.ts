import { IRoom } from '../interfaces/room.interface';

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

	// while (roomsCount < countOfRoomsToGenerate) {

	roomsData.rooms[0] = { 0: createRoom(countOfRoomsToGenerate - roomsCount, null, min)};

	roomsData.rooms = generate({
		attempts: 0,
		rooms: roomsData.rooms,
		roomsCount,
		countOfRoomsToGenerate,
		currentRoomLoc,
		entryDirection: null,
		forceCount: min - 3
	}).rooms;

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
			countOfRoomsToGenerate - getDoorsCount(currentRoom) - roomsCount,
			'down',
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
			entryDirection: 'down',
			forceCount: data.forceCount - 3,
			attempts
		});
	}

	if (currentRoom.doors.down && (entryDirection !== 'down')) {
		const newRoom = createRoom(
			countOfRoomsToGenerate - getDoorsCount(currentRoom) - roomsCount,
			'up',
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
			entryDirection: 'up',
			forceCount: data.forceCount - 3,
			attempts
		});
	}

	if (currentRoom.doors.right && (entryDirection !== 'right')) {
		const newRoom = createRoom(
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
			forceCount: data.forceCount - 3,
			attempts
		});
	}

	if (currentRoom.doors.left && (entryDirection !== 'left')) {
		const newRoom = createRoom(
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
			forceCount: data.forceCount - 3,
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

const createRoom = (freeDoors: number = 0, entryDirection: string | null = null, force: number = 0): IRoom => {
	const room: IRoom = {
		doors: {}
	};

	if (entryDirection) {
		room.doors[entryDirection] = true;
		rollDoors(room, freeDoors - 1, entryDirection, force);
	} else {
		rollDoors(room, freeDoors, '', force);
	}

	return room;
};

const roll = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const rollDirection = () => {
	return directions[roll(1, 4)];
};

const rollDoors = (room: IRoom, maxCount = 0, exclude?: string, force = 0): IRoom => {
	let rollsCount = 1;

	if (maxCount > 3) {
		maxCount = 3;
	}

	if (force > 3) {
		force = 3;
	}

	while ((roll(1, 100) < odds[rollsCount]) || (force > rollsCount)) {
		if (rollsCount > maxCount) {
			break;
		}

		while (true) {
			const direction = rollDirection();

			if (exclude && exclude[direction]) {
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
