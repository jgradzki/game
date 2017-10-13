import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import createSocketIoMiddleware from 'redux-socket.io';
import axios from 'axios';


import Debug, { log } from './libs/debug';
import { store, initStore } from './libs/store.js';
import GameContainer from './components/GameContainer.jsx';
import reducers from './reducers/index.js';
import { addMapElement } from './actions/map.js';
import config from './config.js';
import { setError } from './actions/error';
import LocationManager from './libs/locationManager';

if (process.env.NODE_ENV !== 'production') {
	Debug.setDebug(true, true);
}
Debug.register(['init', 'error', 'newState', 'render', 'map', 'LocationManager', 'dungeonMap']);
Debug.enable('init', 'error', 'LocationManager');

log('init', 'Initial configuration: ', config);


axios.post('game/request', { type: 'init' })
	.then(response => response.data)
	.then(data => {
		log('init', 'Session data: ', data);

		const storeInitialStates = {
			error: { is: false },
			system: {
				...config.systemReducerInitial,
				...data.store.system,
				deadMode: data.store.player && data.store.player.hp <= 0
			},
			mapState: {
				...config.mapStateReducerInitial,
				...data.store.map
			},
			player: {
				...config.playerReducerInitial,
				...data.store.player
			},
			config: config.settings,
			location: config.locationReducerInitial
		};

		let socket = io();

		socket.on('error', () => {
			console.log('error');
		});
		socket.on('showError', error => {
			store.dispatch(setError(error.msg, error.details, error.critical));
		});
		socket.on('showlog', msg => {
			console.log(msg);
		});
		socket.on('SERVER_SHUTDOWN', () => {
		//alert('Server is shutting down...')
		});
		socket.on('anotherLogin', () => {
			alert('Someone else has logged in...');
		});
		socket.on('disconnect', () => {
		//alert('You have been disconnected.')
			window.location = '/';
		});

		const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

		initStore(applyMiddleware(socketIoMiddleware)(createStore)(
			reducers,
			storeInitialStates,
			process.env.NODE_ENV !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : undefined
		));


		store.subscribe(() => {
			log('newState', 'new client state: ', store.getState());
		});

		if (data.inLocation) {
			LocationManager.enterLocation(data.location.type, data.location.data);
		}

		return new Promise(resolve => {
			ReactDOM.render(
				<Provider store = { store }>
					<GameContainer />
				</Provider>,
				document.getElementById('main'),
				() => resolve()
			);
		});
	})
	.then(() => axios.post('game/request', { type: 'getMapElements' }))
	.then(response => response.data)
	.then(data => {
		log('init', 'Map elements: ', data);
		if (data) {
			if (data.success && data.elements) {
				data.elements.forEach(element =>
					store.dispatch(addMapElement(element.id, element.icon, element.position, element.size))
				);
			}

			if (data.error) {
				throw new Error('Map loading error.');
			}
		}
	})
	.catch(err => {
		log('error', err);
		//alert('Something went terribly wrong.');
		//redirect
	});
