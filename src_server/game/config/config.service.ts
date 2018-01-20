import { Component } from '@nestjs/common';
import { get, has } from 'lodash';

import { log } from '../../logger';

import  config from '../data/config';


@Component()
export class ConfigService {
	private config = {};

	constructor() {
		this.config = config;
	}

	/*
	 * @param {object} name
	 * @param {object} defaultValue - Value returned if specified config doeasnt exist.
	 * @return {any} Config value.
	 */
	get(name: string, defaultValue?: any): any {
		if (!this.has(name)) {
			log('debug', `No value set for setting '${name}'.`);
			return defaultValue;
		}

		return get(this.config, name);
	}

	/*
	 * Check if exist.
	 * @param {object} name
	 * @return {boolean}
	 */
	has(name: string): boolean {
		return has(this.config, name);
	}
}
