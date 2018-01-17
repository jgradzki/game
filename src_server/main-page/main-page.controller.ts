import { Get, Response, Controller } from '@nestjs/common';
import * as path from 'path';

@Controller()
export class MainPageController {
	@Get('/')
	root(@Response() res) {
		res.sendFile(path.resolve(__dirname, '../server_resources/html/index.html'));
	}

	@Get('*')
	rest(@Response() res) {
		res.sendFile(path.resolve(__dirname, '../server_resources/html/index.html'));
	}
}
