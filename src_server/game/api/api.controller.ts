import { Controller, Post, Response, Body, Session } from '@nestjs/common';
import { trim, isEmpty } from 'lodash';
import { log } from '../../logger';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/Login.dto';

import { PlayersService } from '../player/players.service';

import { MapIcon } from '../map/interfaces/map-icon.enum';
import { LocationType } from '../locations/entities';

@Controller('api')
export class ApiController {

	constructor(
		private readonly playersService: PlayersService,
	) {}

	@Post('register')
	async register(@Body() registerData: RegisterDto, @Response() res) {
		const { login, pass, errors } = this.checkRegisterForm(registerData);

		if (errors.length > 0) {
			res.send({
				errors
			});

			return;
		}

		if (await this.isLoginTaken(login)) {
			res.send({
				errors: ['Login zajęty.']
			});

			return;
		}

		try {
			const player = await this.playersService.create(login, pass);

			res.send({ success: true });
		} catch (error) {
			log('error', error);
			res.status(500).send({ errors: ['Internal server error'] });
		}
	}

	@Post('login')
	async login(@Body() loginData: LoginDto, @Response() res, @Session() session) {
		const login = trim(loginData.login);
		const pass = loginData.pass;
		const player = await this.playersService.getPlayerByLogin(login);

		if (player) {
			const isPasswordValid = await this.playersService.checkPassword(pass, player.password);
			if (isPasswordValid) {
				session.playerID = player.id;
				session.login = player.login;
				player.sessionId = session.id;
				player.ip = session.ip;
				player.setOnline();

				log('info', `Players online: ${this.playersService.onlineCount()}`);

				res.send({ success: true });

				return;
			}

			this.playersService.unloadPlayer(player, false);
		}

		res.send({ error: 'Błędny login lub hasło.' });
	}

	private checkRegisterForm(formData: RegisterDto): { login: string; pass: string; errors: Array<string> } {
		const errors = [];
		const login = trim(formData.login) || '';
		const pass = formData.pass || '';
		const repass = formData.repass || '';

		if (isEmpty(formData)) {
			errors.push('Pusty formularz');
		} else {
			if (typeof(formData.login) !== 'string') {
				errors.push('Podaj login');
			}
			if (typeof(formData.pass) !== 'string') {
				errors.push('Podaj hasło');
			}
			if (typeof(formData.repass) !== 'string') {
				errors.push('Powtórz hasło');
			}

			if (login.length < 3) {
				errors.push('Login musi skladac sie przynajmniej z 3 znakow');
			}
			if (login.length > 15) {
				errors.push('Login nie może mieć więcej niż 15 znaków');
			}
			if (pass.length < 6 || pass.length > 20) {
				errors.push('Hasło musi skladac sie przynajmniej z 6 znakow i mieć nie więcej niż 20');
			}
			if (pass !== repass) {
				errors.push('Hasła nie są takie same');
			}
		}

		return {
			errors,
			login,
			pass
		};
	}

	private async isLoginTaken(login: string) {
		return !!await this.playersService.getPlayerByLogin(login);
	}
}
