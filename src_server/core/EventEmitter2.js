/**
 * @author Konrad Kowalski <rootsher@gmail.com>
 * @link https://github.com/rootsher/event-emitter
 */
class EventEmitter {

	/**
	 * @param {number} defaultMaxListeners
	 */
	constructor(defaultMaxListeners = 10) {
		/**
		 * @type {number}
		 */
		this._defaultMaxListeners = defaultMaxListeners;

		this.addListener = this.on;
		this.addEventListener = this.on;

		this.removeListener = this.off;
		this.removeEventListener = this.off;

		this.listeners = this.getListeners;
	}

	/**
	 *
	 * @param {string} eventName
	 * @param {function} eventHandler
	 * @param {Object} [context]
	 */
	on(eventName, eventHandler, context) {
		if ((typeof eventName !== 'string') || (eventName === '')) {
			throw new Error('EventEmitter#on: `eventName` is not a string or is empty.');
		}

		if (typeof eventHandler !== 'function') {
			throw new Error('EventEmitter#on: `eventHandler` is not a function.');
		}

		if (!this._eventListeners) {
			this._eventListeners = {};
		}

		if (!this._eventListeners[eventName]) {
			this._eventListeners[eventName] = [];
		}

		this._eventListeners[eventName].push({
			eventHandler: eventHandler,
			context: (context || this)
		});

		if (this._eventListeners[eventName].length === (this._maxListeners || this._defaultMaxListeners)) {
			console.warn('More than %d listeners have been added to "%s" event.', (this._maxListeners || this._defaultMaxListeners), eventName);
		}
	}

	/**
	 *
	 * @param {string} [eventName]
	 * @param {function} [eventHandler]
	 */
	off(eventName, eventHandler) {
		if (!eventName) {
			this._eventListeners = {};
			return;
		}

		if (!eventHandler) {
			delete this._eventListeners[eventName];
			return;
		}

		if (!this._eventListeners) {
			this._eventListeners = {};
		}

		this._eventListeners[eventName] = (this._eventListeners[eventName] || []).filter(function (listener) {
			return (eventHandler !== listener.eventHandler);
		});

		if (this._eventListeners[eventName].length === 0) {
			delete this._eventListeners[eventName];
		}
	}

	/**
	 *
	 * @param {string} [eventName]
	 */
	removeAllListeners(eventName) {
		if (!this._eventListeners || !this._eventListeners[eventName]) {
			this._eventListeners = {};
			return;
		}

		delete this._eventListeners[eventName];
	}

	/**
	 *
	 * @param {string} eventName
	 * @param {function} eventHandler
	 * @param {Object} [context]
	 */
	once(eventName, eventHandler, context) {
		if ((typeof eventName !== 'string') || (eventName === '')) {
			throw new Error('EventEmitter#once: `eventName` is not a string or is empty.');
		}

		if (typeof eventHandler !== 'function') {
			throw new Error('EventEmitter#once: `eventHandler` is not a function.');
		}

		if (!this._eventListeners) {
			this._eventListeners = {};
		}

		if (!this._eventListeners[eventName]) {
			this._eventListeners[eventName] = [];
		}

		this._eventListeners[eventName].push({
			eventHandler: eventHandler,
			context: (context || this),
			once: true
		});
	}

	/**
	 *
	 * @param {string} eventName
	 */
	emit(eventName) {
		if (!eventName) {
			throw new Error('EventEmitter#emit: `eventName` is undefined.');
		}

		if (!this._eventListeners) {
			this._eventListeners = {};
		}

		if ((eventName === 'error') && (!this._eventListeners[eventName] || (this._eventListeners[eventName].length === 0))) {
			throw (arguments[1] || new Error('EventEmitter#emit: Listener for handling errors does not exist.'));
		}

		var parameters = Array.prototype.slice.call(arguments, 1);
		var remainingListeners = [];

		(this._eventListeners[eventName] || []).forEach(function (listener) {
			listener.eventHandler.apply(listener.context, parameters);

			if (!listener.once) {
				remainingListeners.push(listener);
			}
		});

		this._eventListeners[eventName] = remainingListeners;

		if (this._eventListeners[eventName].length === 0) {
			delete this._eventListeners[eventName];
		}
	}

	/**
	 *
	 * @param {number} number
	 */
	setMaxListeners(number) {
		number = Number(number);

		if (isNaN(number)) {
			throw new Error('EventEmitter#setMaxListeners: `number` is not a number.');
		}

		this._maxListeners = (parseInt(number) || Infinity);
	}

	/**
	 *
	 * @param {string} eventName
	 */
	getListeners(eventName) {
		if (!this._eventListeners) {
			this._eventListeners = {};
		}

		return (this._eventListeners[eventName] || []).map(function (listener) {
			return listener.eventHandler;
		});
	}

	/**
	 *
	 * @param {string} eventName
	 */
	hasListeners(eventName) {
		if (!this._eventListeners) {
			this._eventListeners = {};
		}

		return (this._eventListeners[eventName] && Array.isArray(this._eventListeners[eventName]) && (this._eventListeners[eventName].length > 0));
	}

}

module.exports = EventEmitter;

