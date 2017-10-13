import React, { Component } from 'react';

export default class GameContainer extends Component {
	render() {
		return (
			<div className="deadView">
				<span>Twoja postać nie żyje.</span>
				<button>OK</button>
			</div>
		);
	}
}
