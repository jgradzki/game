import React, { Component } from 'react';
import { post } from 'axios';

import FormTitle from './FormTitle.jsx';

class LoginForm extends Component {
	constructor() {
		super();

		if (process.env.NODE_ENV !== 'production') {
			this.state = {
				success: false,
				error: false,
				login: 'Admin',
				pass: '123456'
			};
			setTimeout(() => this._onClick(), 500);
		} else {
			this.state = {
				success: false,
				error: false,
				login: '',
				pass: ''
			};
		}
	}

	render() {
		return (
			<div className = "loginForm">
				<FormTitle>Logowanie</FormTitle>
				{this._renderError()}
				Login:
				<input type = "text" placeholder="Login" name="login" onChange={ event => this._handleChange(event) } /><br/>
				Hasło:
				<input type = "password" placeholder="Password"name="pass" onChange={ event => this._handleChange(event) } /><br/>
				<button onClick = { () => this._onClick() }>Submit</button><br/ >
			</div>
		);
	}

	_postHandle(data) {
		if (data.error) {
			this.setState({ error: data.error });
		} else if (data.success === true) {
			this.setState({ success: true });
			window.location.replace('/game');
		}
	}

	_handleChange(event) {
		if (event.target.name === 'login') {
			this.setState({ login: event.target.value });
		} else if (event.target.name === 'pass') {
			this.setState({ pass: event.target.value });
		}
	}

	_onClick() {
		post('/api/login', {
			login: this.state.login,
			pass: this.state.pass
		})
			.then(response => this._postHandle(response.data))
			.catch(() => this.setState({ error: 'Wystąpił błąd. Spróbuj ponownie później.' }));


	}

	_renderError() {
		if (this.state.error) {
			return <div className = 'error' > Error: { this.state.error } </div>;
		}
	}
}

export default LoginForm;
