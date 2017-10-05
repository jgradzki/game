import winston from 'winston';
import fs from 'fs';
import path from 'path';

//Log levels: error: 0, warn: 1, info: 2, verbose: 3, debug: 4

let logDir = './logs';
let currentLog = '';
let logger = {};

const getDirectories = (srcpath) => {
	return fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
};

const deleteFolderRecursive = (path) => {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file) {
			var curPath = path + '/' + file;

			if (fs.statSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

export const initLogger = () => {
	let now = new Date();
	let dirs;

	try {
		dirs = getDirectories('./logs');
		if (dirs) {
			dirs.map(t => {
				let d = new Date(parseInt(t));

				if ((d.getFullYear === now.getFullYear) && (d.getMonth() === now.getMonth()) && (d.getDate() === now.getDate())) {
					now = d;
				}
			});
		}
	} catch (e) {
		if (e.code === 'ENOENT') {

		} else {
			console.log(e);
		}
	}
	try {
		fs.mkdirSync(logDir);
	} catch (e) {
		if (e.code === 'EEXIST') {

		} else {
			console.log(e);
		}
	}

	try {
		module.exports.currentLog = now.getTime();
		fs.mkdirSync(module.exports.logDir + '/' + module.exports.currentLog);
	} catch (e) {
		if (e.code === 'EEXIST') {

		} else {
			console.log(e);
		}
	}

	module.exports.logger = new(winston.Logger)({
		level: 'info',
		transports: _getTransports()
	});

	dirs = getDirectories('./logs');
	if (dirs.length > 14) {
		let oldDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);

		dirs.map(t => {
			let d = new Date(parseInt(t));

			if (d.getTime() < oldDate.getTime()) {
				let delDir = module.exports.logDir + '/' + t;

				deleteFolderRecursive(delDir);
			}
		});
	}

};

const log = (...args) => {
	var d = new Date();
	var t = '['+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+']';

	if (args.length > 2) {
		module.exports.logger.log(args[0], t+' '+args[1], ...args.slice(2));
	} else {
		module.exports.logger.log(args[0], t, args[1]);
	}

};

const _getTransports = () => {
	let transports = [
		new(winston.transports.File)({
			name: 'info-file',
			filename: module.exports.logDir + '/' + module.exports.currentLog + '/filelog-info.log',
			level: 'info'
		}),
		new(winston.transports.File)({
			name: 'error-file',
			filename: module.exports.logDir + '/' + module.exports.currentLog + '/filelog-error.log',
			level: 'error'
		}),
		new (winston.transports.Console)({
			level: (process.env.NODE_ENV !== 'production' ? 'debug': 'info')
		}),
	];

	if (process.env.NODE_ENV !== 'production') {
		transports.push(new(winston.transports.File)({
			name: 'debug-file',
			filename: module.exports.logDir + '/' + module.exports.currentLog + '/filelog-debug.log',
			level: 'debug'
		}));
	}

	return transports;
};

module.exports = {
	initLogger,
	logDir,
	currentLog,
	logger,
	log
};
