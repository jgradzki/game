import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

/**
 * @todo readline transport
 */

// Log levels: error: 0, warn: 1, info: 2, verbose: 3, debug: 4

const logDir = './logs';
let currentLog = '';
let logger: winston.Logger = {};

const getDirectories = (srcpath) => {
	return fs.readdirSync(srcpath).filter(file => {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
};

const deleteFolderRecursive = filePath => {
	if (fs.existsSync(filePath)) {
		fs.readdirSync(filePath).forEach(file => {
			const curPath = filePath + '/' + file;

			if (fs.statSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(filePath);
	}
};

export const initLogger = () => {
	let now = new Date();
	let dirs;

	try {
		dirs = getDirectories('./logs');
		if (dirs) {
			dirs.map(t => {
				const d = new Date(parseInt(t, 10));

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
		currentLog = '' + now.getTime();
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
		const oldDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 31);

		dirs.map(t => {
			const d = new Date(parseInt(t, 10));

			if (d.getTime() < oldDate.getTime()) {
				const delDir = logDir + '/' + t;

				deleteFolderRecursive(delDir);
			}
		});
	}

};

export const log = (type, error) => {
	const d = new Date();
	const t = '[' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ']';

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
