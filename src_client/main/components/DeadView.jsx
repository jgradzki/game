import React, { Component } from 'react';
import axios from 'axios';

export default class GameContainer extends Component {
	render() {
		console.log('deadview')
		return (
			<div className="deadView">
				<span>Twoja postać nie żyje.</span>
				<button onClick={() => this._onClick()}>OK</button>
			</div>
		);
	}

	_onClick() {
		axios.post('game/request/reset')
			.then(respond => respond.data)
			.then(data => {
				if (data.success) {
					location.href = '/';
				}
			})
	}
}
