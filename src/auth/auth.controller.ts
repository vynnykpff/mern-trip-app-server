import { Controller } from '@/lib/controller';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { AuthDTO } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { TypedRequest } from '@/types/TypedRequest';
import { Request, Response } from 'express';
import { ResponseDTO } from '@/dtos/response.dto';

const refreshMaxAge = 1000 * 60 * 60 * 24 * 7;

export class AuthController extends Controller {
	static baseUrl = '/auth';

	@AuthController.Post('/register', validationMiddleware(AuthDTO))
	async register(req: TypedRequest<AuthDTO>, res: Response) {
		const { response, refreshToken } = await AuthService.register(req.body);
		res.status(201);
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: refreshMaxAge,
			signed: true,
		});
		return response;
	}

	@AuthController.Post('/login', validationMiddleware(AuthDTO))
	async login(req: TypedRequest<AuthDTO>, res: Response) {
		const { response, refreshToken } = await AuthService.login(req.body);
		res.status(201);
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: refreshMaxAge,
			signed: true,
		});
		return response;
	}

	@AuthController.Post('/logout')
	async logout(req: Request, res: Response) {
		const { refreshToken } = req.signedCookies;
		await AuthService.deleteToken(refreshToken);
		res.clearCookie('refreshToken');
		res.status(200);
		return new ResponseDTO('Success', 200);
	}

	@AuthController.Post('/refresh')
	async refresh(req: Request, res: Response) {
		const { refreshToken: oldRefreshToken } = req.signedCookies;
		const { accessToken, refreshToken } = await AuthService.refreshTokens(
			oldRefreshToken
		);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: refreshMaxAge,
			signed: true,
		});

		return { accessToken };
	}
}
