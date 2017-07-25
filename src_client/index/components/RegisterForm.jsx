import React, { Component } from 'react';
import FormTitle from './FormTitle.jsx';

class RegisterForm extends Component {
	constructor() {
		super();
		this._onClick = this._onClick.bind(this);
		this._postHandle = this._postHandle.bind(this);
		this._handleChange = this._handleChange.bind(this);
		this.state = {
			success: false,
			errors: []
		};
	}

	_postHandle(data) {
		if (data.errors) {
			this.setState({ errors: data.errors });
		} else if (data.success) {
			this.setState({ success: true });
		}
	}

	_handleChange(event) {
		if (event.target.name == 'login') {
			this.setState({ login: event.target.value });
		} else if (event.target.name == 'pass') {
			this.setState({ pass: event.target.value });
		} else if (event.target.name == 'repass') {
			this.setState({ repass: event.target.value });
		}
	}

	_onClick() {
		this.setState({ errors: [] });
		$.post('/register', { form: { login: this.state.login,
			pass: this.state.pass,
			repass: this.state.repass } },
		this._postHandle, 'json');
	}

	_renderSuccess() {
		return <div className = 'success'> Rejestracja zakończona pomyślnie. <a href = "/"> Powrót </a></div>;
	}

	_renderError() {
		if (this.state.errors.length > 0) {
			return (<div className = 'error' >
                Błędy: <br/>
				{ this.state.errors.map(v => <div>{v}</div>) }
			</div>);
		}
	}

	_renderForm() {
		return (<div className = "registerForm" >
			<FormTitle> Rejestracja </FormTitle> { this._renderError() }
			Login: <input type = "text" name = "login"	onChange = { this._handleChange } /><br/ >
			Hasło: <input type = "password" name = "pass" onChange = { this._handleChange } /><br/ >
			Powtórz Hasło: <input type = "password" name = "repass" onChange = { this._handleChange } /><br/ >
			<button onClick = { this._onClick }> Submit </button> </div>);
	}

	render() {
		if (this.state.success == true) {
			return this._renderSuccess();

		} else {
			return this._renderForm();
		}
	}
}

export default RegisterForm;
