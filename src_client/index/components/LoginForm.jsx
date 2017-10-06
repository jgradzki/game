import React, { Component } from 'react';
import FormTitle from './FormTitle.jsx';

class LoginForm extends Component {
	constructor() {
		super();
		this._onClick = this._onClick.bind(this);
		this._postHandle = this._postHandle.bind(this);
		this._handleChange = this._handleChange.bind(this);
		this.state = {
			success: false,
			error: false,
			login: 'Admin',
			pass: '123456'
		};

		setTimeout(() => this._onClick(), 500);
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
		$.post('/', { form: { login: this.state.login,
			pass: this.state.pass } }, this._postHandle, 'json');
	}

	_renderError() {
		if (this.state.error) {
			return <div className = 'error' > Error: { this.state.error } </div>;
		}
	}

	render() {
		return (
			<div className = "loginForm">
				<FormTitle>Logowanie</FormTitle>
				{this._renderError()}
				Login: <input type = "text"	placeholder = "Login" name = "login" onChange = { this._handleChange }/><br/ >
				Hasło: <input type = "password"	placeholder = "Password" name = "pass" onChange = { this._handleChange }/><br/ >
				<button onClick = { this._onClick }>Submit</button><br/ >
			</div>
		);
	}
}

export default LoginForm;
