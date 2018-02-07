import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Menu from './Menu.jsx';
import IndexPage from './IndexPage.jsx';
import RegisterPage from './RegisterPage.jsx';

class App extends Component {

	render() {
		return (
			<div className="main">
				<Menu />
				<div className="page">
					<Switch>
						<Route path='/login' component={IndexPage} />
						<Route path='/register' component={RegisterPage}/>
						<Redirect from='*' to='/login'/>
					</Switch>
				</div>
			</div>
		);
	}
}

export default App;
