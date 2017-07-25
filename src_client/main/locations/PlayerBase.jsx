import React from 'react';
import { store } from '../libs/store';

class PlayerBase extends Location {
	constructor() {
		super();
    	if (new.target === Location) {
      		throw new TypeError('Cannot construct PlayerBase class');
    	}
	}

	static render() {
    	return <div>HOME</div>;
	}

	static onEnter(data) {

	}

	static onExit() {
    	
	}
}

export default PlayerBase;