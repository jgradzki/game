import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Menu extends Component {

	render() {
		return (
			<div className="menu">
				<Link to='/login'>Logowanie</Link> |
				<Link to='/register'>Rejestracja</Link>
			</div>
		);
	}
}

export default Menu;
