import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

import models from '../models';

/**
 *
 */
class DB {
	/**
	 * @param {string} user
	 * @param {string} password
	 * @param {string} dbName
	 * @param {string} host
	 * @param {number} port
	 * @param {string} dialect
	 */
	constructor(user, password, dbName, host = 'localhost', port = 5432, dialect = 'postgres') {
		/*
		 * @type {string}
		 */
		this._user = user;
		/*
		 * @type {string}
		 */
		this._password = password;
		/*
		 * @type {string}
		 */
		this._dbName = dbName;
		/*
		 * @type {string}
		 */
		this._host = host;
		/*
		 * @type {number}
		 */
		this._port = port;
		/*
		 * @type {string}
		 */
		this._dialect = dialect;
		/*
		 * @type {Sequelize}
		 */
		this._sequelize;
	}

	get connection() {
		return this._sequelize;
	}

	/**
	 * @param {boolean} sync
	 * @param {boolean} forceSync
	 * @returns {Promise}
	 */
	connect(sync = false, forceSync = false) {
		return new Promise((resolve, reject) => {
			this._sequelize = new Sequelize(
				this._dbName,
				this._user,
				this._password,
				{
					dialect: this._dialect,
					host: this._host,
					port: this._port,
					logging: false
				}
			);

			this._loadModels().then( () => {
				this._sequelize
					.authenticate()
					.then(() => {
						if (sync) {
							this._sequelize.sync({force: forceSync}).then(() => {
								resolve(this);
							});
						} else {
							resolve(this);
						}

					});
			})
				.catch(err => {
					reject(err);
				});
		});
	}

	/**
	 * @returns {Promise}
	 */
	isConnected() {
		return new Promise((resolve, reject) => {
			if (!this._sequelize) {
				reject(new Error('Not initialized'));
			} else {
				this._sequelize
					.authenticate()
					.then(() => resolve())
					.catch(err => reject(err));
			}
		});
	}

	/**
	 *
	 */
	close() {
		this._sequelize.close();
	}

	/**
	 * @param {string} modelName
	 * @returns {Model}
	 */
	getModel(modelName) {
		if (!this._sequelize.model(modelName)) {
			throw new Error('Model not found.');
		}

		return this._sequelize.model(modelName);
	}

	/**
	 *
	 */
	async _loadModels() {
		(await this._getModelsFilesList())
			.filter(file => {
				return (file.indexOf('.') !== 0) && (file !== 'index.js');
			})
			.forEach( file => {
				const model = require(path.resolve(__dirname, '../models', file)).default;

				models[model.name] = model.init(
					model.fields,
					{
						...model.options,
						sequelize: this._sequelize
					}
				);
			});

		for (const model of Object.keys(models)) {
			typeof models[model].associate === 'function' && models[model].associate(models);
		}
	}

	_getModelsFilesList() {
		return new Promise( (resolve, reject) => {
			fs.readdir(
				path.resolve(__dirname, '../models'),
				(err, files) => {
					if (err) {
						reject(err);
					} else {
						resolve(files);
					}
				});
		});
	}
}

module.exports = DB;
