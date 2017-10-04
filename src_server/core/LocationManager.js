import { log } from '../logger';

class LocationManager {
	constructor(config, db, mapManager) {
		this._config = config;
		this._db = db;
		this._mapManager = mapManager;

		this._elementTypes = db.getModel('MapElement').ElementTypes;
		this._locations = [];
	}

	typeToModel(type) {
		const models = {
			'DUNGEON': this._db.getModel('Dungeon'),
			'PLAYER_BASE': this._db.getModel('PlayerBase')
		};

		return models[type];
	}

	addLocation(type, mapPosition, size, visibilityRules, data, icon = 'default', isPerm = false) {
		return new Promise((resolve, reject) => {
			if (!this._elementTypes[type]) {
				throw new TypeError(`${type} is not valid location type.`);
			}
			if (!mapPosition || !mapPosition.x || !mapPosition.y) {
				throw new Error(`Wrong position(${mapPosition}.`);
			}
			if (!size || !size.width || !size.height || (size.width < 0) || (size.height < 0)) {
				throw new Error(`Wrong size(${size}.`);
			}

			if (type === this._elementTypes.DUNGEON) {
				let dungeon = this._createDungeon(data);

				dungeon.locationCreated();

				dungeon.save()
					.then( () => {
						return this._mapManager.createMapElement(type, mapPosition, size, visibilityRules, icon, isPerm);
					})
					.then( mapElement => {
						dungeon.setMapPosition(mapElement);
						dungeon.mapPosition = mapElement;
						this._locations.push(dungeon);
						resolve(dungeon);
					})
					.catch(error => {
						dungeon.destroy();
						reject(error);
					});
			} else {
				reject('error');
			}


		});
	}

	loadLocation(location) {
		if (!location || !location.getType() || !this.typeToModel(location.getType())) {
			return;
		}

		if (this._locations.filter(l => (l.id === location.id) && (l.getType() === location.getType()) ) >  0) { //Already loaded.
			return;
		}

		this._locations.push(location);

		return location;
	}

	async saveLocations() {
		let loctionsSaved = 0;

		Promise.all(this._locations.map(location => {
			return location.save()
				.then(() => loctionsSaved++)
				.catch(err => log('error', err));
		}))
			.then(() => log('info', `Locations saved: ${loctionsSaved}`))
			.catch(err => log('error', err));
	}

	getLocationsInMemoryCount() {
		return this._locations.length;
	}

	getLocationByMapPosition(mapPositionId) {
		return new Promise((resolve, reject) => {
			this._mapManager.getElement(mapPositionId)
				.then(position => {
					if (!position) {
						reject(`Position ${mapPositionId} not found`);
					}

					let model = this.typeToModel(position.type);

					if (!model) {
						reject(`Model ${position.type} not found.`);
					}

					let location = this._locations.filter(l =>  (l.mapPosition.id === position.id))[0];


					if ( location ) {
						resolve(location);
					} else {
						model.findOne({
							where: {
								map_position: mapPositionId
							}
						})
							.then(location => {
								resolve(this.loadLocation(location));
							})
							.catch(error => {
								reject(error);
							});
					}
				})
				.catch(error => {
					reject(error);
				});
		});
	}

	getLocation(id, type) {
		return new Promise((resolve, reject) => {
			let location = this._locations.filter(l => (l.id === id) && (l.getType() === type ))[0];

			if (location) {
				resolve(location);
			} else {
				let model = this.typeToModel(type);

				if (!model) {
					reject(`Model ${type} not found.`);
				}

				model.findOne({
					where: {
						id
					}
				})
					.then(location => {
						resolve(this.loadLocation(location));
					})
					.catch(error => {
						reject(error);
					});
			}

		});
	}


	_createDungeon(data) {
		return this._db.getModel('Dungeon').build({
			rooms: data.rooms,
			entryRoom: data.entryRoom
		});
	}
}

export default LocationManager;
