import { Get, Response, Controller } from '@nestjs/common';
import * as path from 'path';

@Controller()
export class GameController {
	@Get('/game')
	root(@Response() res) {
		res.sendFile(path.resolve(__dirname, '../server_resources/html/main.html'));
	}

	@Get('/game/*')
	rest(@Response() res) {
		res.sendFile(path.resolve(__dirname, '../server_resources/html/main.html'));
	}
}
