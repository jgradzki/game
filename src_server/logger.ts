import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

//Log levels: error: 0, warn: 1, info: 2, verbose: 3, debug: 4

let logDir = './logs';
let currentLog = '';
let logger: winston.Logger = {};

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
		currentLog = "" + now.getTime();
		fs.mkdirSync(logDir + '/' + currentLog);
	} catch (e) {
		if (e.code === 'EEXIST') {

		} else {
			console.log(e);
		}
	}

	logger = new(winston.Logger)({
		level: 'info',
		transports: _getTransports()
	});

	dirs = getDirectories('./logs');
	if (dirs.length > 31) {
		let oldDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 31);

		dirs.map(t => {
			let d = new Date(parseInt(t));

			if (d.getTime() < oldDate.getTime()) {
				let delDir = logDir + '/' + t;

				deleteFolderRecursive(delDir);
			}
		});
	}

};

export const log = (type, error) => {
	var d = new Date();
	var t = '['+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+']';

	logger.log(type, `${t} ${error}`);

	if (error instanceof Error) {
		logger.log(type, error.stack);
	}
};

const _getTransports = () => {
	const transports = [
		new(winston.transports.File)({
			name: 'info-file',
			filename: logDir + '/' + currentLog + '/filelog-info.log',
			level: 'info'
		}),
		new(winston.transports.File)({
			name: 'error-file',
			filename: logDir + '/' + currentLog + '/filelog-error.log',
			level: 'error'
		}),
		new (winston.transports.Console)({
			level: (process.env.NODE_ENV !== 'production' ? 'debug' : 'info')
		}),
	];

	if (process.env.NODE_ENV !== 'production') {
		transports.push(new(winston.transports.File)({
			name: 'debug-file',
			filename: logDir + '/' + currentLog + '/filelog-debug.log',
			level: 'debug'
		}));
	}

	return transports;
};
