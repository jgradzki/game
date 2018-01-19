import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';

@Guard()
export class LoggedGuard implements CanActivate {
	canActivate(dataOrRequest, context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		console.log(dataOrRequest);
		console.log(context);
		return true;
	}
}
