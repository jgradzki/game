let debug = false;
let showFlag = false;
let flags = {};

const check = (e) => {
	if (typeof(flags[e]) === 'undefined' || flags[e] === null) {
		if (debug) {
			console.log('DEBUG: Flag', e, 'is not registered'); 
		}
		return false;
	} else {
		return true;
	}
};

const en = (e, b = false) => {
	if (check(e)) {
		flags[e] = b; 
	}
};

const setDebug = (b, showFlags = false) => {
	debug = b, showFlag = showFlags; 
};

const register = (f) => {
	f.forEach((e) => {
		flags[e] = false;
	});
};

const enable = (...flag) => {
	if (flag instanceof Array) {
		flag.forEach((e) => {
			en(e, true);
		});
	} else {
		en(flag, true);
	}
};

const disable = (...flag) => {
	if (flag instanceof Array) {
		flag.forEach((e) => {
			en(e, false);
		});
	} else {
		en(flag, false);
	}
};

const log = (flag, ...msg) => {
	if (debug) {
		if (check(flag)) {
			if (flags[flag]) {
				if (showFlag) {
					console.log('[' + flag + ']', ...msg); 
				} else {
					console.log(...msg);
				} 
			}
		}
	}
};

module.exports = {
	setDebug,
	register,
	enable,
	disable,
	log
};
