import _ from 'lodash';
import { log } from '../logger';

/*
 *
 */
class Config {
	/*
	 *
	 */
	constructor(config) {
		if (config && typeof(config) !== 'object') {
			throw new Error('@Config: Parameter must be an object.');
		}
		/*
		 * @type {Object}
		 */
		this._config = config || {};

	}

	/**
	 * @todo
	 */
	add(name, value) {

	}

	/*
	 * @param {Object} name
	 * @param {Object} defaultValue - Value returned if specified config doeasnt exist.
	 * @return {*} Config value.
	 */
	get(name, defaultValue = undefined) {
		if (!this.has(name)) {
			log('debug', `No value set for setting '${name}'.`);
			return defaultValue;
		}

		return _.get(this._config, name);
	}

	/*
	 * Check if exist.
	 * @param {Object} name
	 * @return {boolean}
	 */
	has(name) {
		return _.has(this._config, name);
	}
}

module.exports = Config;
