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
			setTimeout(() => this._submit(), 1000);
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
				<input
					type="text"
					placeholder="Login"
					name="login"
					onChange={event => this._handleChange(event)}
					onKeyPress={event => this._onKeyPress(event)}
				/>
				<br/>
				Hasło:
				<input
					type="password"
					placeholder="Password"
					name="pass"
					onChange={event => this._handleChange(event)}
					onKeyPress={event => this._onKeyPress(event)}
				/>
				<br/>
				<button onClick = { () => this._submit() }>Submit</button><br/ >
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

	_onKeyPress(event) {
		if (event.key === 'Enter') {
			return this._submit();
		}
	}

	_handleChange(event) {
		if (event.target.name === 'login') {
			this.setState({ login: event.target.value });
		} else if (event.target.name === 'pass') {
			this.setState({ pass: event.target.value });
		}
	}

	_submit() {
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
