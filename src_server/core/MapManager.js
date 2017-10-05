import { log } from '../logger';

class MapManager {
	constructor(config, db) {
		this._config = config;
		this._db = db;

		this._mapElements = [];
		this._mapElementModel = db.getModel('MapElement');
	}

	createMapElement(type, mapPosition, size, visibilityRules, icon, isPerm) {
		return new Promise((resolve, reject) => {
			this._mapElementModel.create({
				type,
				mapPosition,
				size,
				visibilityRules,
				mapIcon: icon,
				isPerm: !!isPerm
			})
				.then(element => {
					this._mapElements.push(element);
					resolve(element);
				})
				.catch(error => {
					reject(error);
				});
		});
	}

	loadElement(element) {
		if (!element && !(element instanceof this._mapElementModel)) {
			return;
		}

		if (this._mapElements.filter(e => e.id === element.id) >  0) { //Already loaded.
			return;
		}

		this._mapElements.push(element);

		return element;
	}

	async saveElements() {
		let elementsSaved = 0;

		Promise.all(this._mapElements.map(element => {
			return element.save()
				.then(() => elementsSaved++)
				.catch(err => log('error', err));
		}))
			.then(() => log('info', `Map elements saved: ${elementsSaved}`))
			.catch(err => log('error', err));
	}

	async loadElementById(id) {
		let element = await this._mapElementModel.findById(id);

		if (element) {
			return this.loadElement(element);
		}

		return element;
	}

	async getElement(id) {
		let element = this._mapElements.filter(element => element.id === id)[0];

		if (!element) {
			return await this.loadElementById(id);
		}

		return element;
	}

	getElementsInMemoryCount() {
		return this._mapElements.length;
	}


	filterElement(element) {
		return {
			id: element.id,
			icon: element.mapIcon,
			position: element.mapPosition,
			size: element.size
		};
	}

	async getElementsForPlayer(id, filter = true) {
		let elements = await this.getElementsByVisibilityRules({
			$or: [
				{
					all: true
				},
				{
					owner: id
				},
				{
					for: id
				}
			]
		});

		if (filter) {
			return elements.map(element => this.filterElement(element));
		} else {
			return elements;
		}
	}

	async getElementsByVisibilityRules(rules = { all: true }) {
		let elements = this._mapElements.filter(element => this._checkRules(element, rules));

		let newElements = (await this._getElementsByVisibilityRulesFromDB(elements, rules));

		newElements.forEach(element => this.loadElement(element));
		return [
			...elements,
			...newElements
		];
	}

	_checkRules(element, rules) {
		let is = false;

		if (rules && rules['$or']) {
			for (let d of rules['$or']) {
				for (let k in d) {
					if (element.visibilityRules[k] && (element.visibilityRules[k] === d[k])) {
						is = true;
					}
				}
			}
		}
		return is;
	}

	_getElementsByVisibilityRulesFromDB(loaded = [], rules = { all: true }) {
		let where = {};

		if (loaded.length > 0) {
			where = {
				id: {
					$not: [
						...loaded.map(e => e.id)
					]
				}
			};
		}

		return this._mapElementModel.findAll({
			where: {
				...where,
				visibilityRules: rules
			}
		});
	}
}

export default MapManager;
