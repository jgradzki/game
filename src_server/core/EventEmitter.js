import EventEmitter from 'events';
import util from 'util';

class MyEventEmitter extends EventEmitter {
	constructor() {
		super();
	}
}

module.exports = MyEventEmitter;
