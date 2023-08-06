import { Controller } from '@/lib/controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { UserRequest } from '@/types/UserRequest';
import { UsersService } from './users.service';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { PatchUserDTO } from './dtos/patch-user.dto';
import { Response } from 'express';
import { UserDTO } from './dtos/user.dto';

export class UsersController extends Controller {
	static baseUrl = '/users';

	@UsersController.Get('/@me', authMiddleware)
	async getSelfUser(req: UserRequest) {
		return UserDTO.createDto(req.user);
	}

	@UsersController.Patch(
		'/@me',
		authMiddleware,
		validationMiddleware(PatchUserDTO)
	)
	async patchUser(req: UserRequest<PatchUserDTO>) {
		return UsersService.patchUser(req.user, req.body);
	}

	@UsersController.Delete('/@me', authMiddleware)
	async deleteUser(req: UserRequest, res: Response) {
		res.clearCookie('refreshToken');
		return UsersService.deleteUser(req.user);
	}
}
