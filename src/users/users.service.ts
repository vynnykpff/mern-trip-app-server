import { UsersException } from './users.exception';
import { User, UserDocument, UserEditableFields } from './models/user.model';
import { Types } from 'mongoose';
import { PatchUserDTO } from './dtos/patch-user.dto';
import { isImageUrl } from '@/utils/isImageUrl';
import { UserToken } from './models/user-token.model';
import { UserDTO } from './dtos/user.dto';

export class UsersService {
	static async getUserById(userId: string | Types.ObjectId) {
		if (!userId || !Types.ObjectId.isValid(userId)) {
			throw UsersException.UserIdIsNotExist();
		}
		const user = await User.findById(userId);
		if (!user) {
			throw UsersException.UserIdIsNotExist();
		}
		return user;
	}

	static async patchUser(user: UserDocument, patchUserDto: PatchUserDTO) {
		const { username, avatar } = patchUserDto;
		if (username && (await User.findOne({ username }))) {
			throw UsersException.UserAlreadyExist();
		}

		if (avatar && !(await isImageUrl(avatar))) {
			throw UsersException.AvatarIsNotImage();
		}

		for (const key in patchUserDto) {
			if (UserEditableFields.includes(key) && user[key] !== patchUserDto[key]) {
				user[key] = patchUserDto[key];
			}
		}
		await user.save();

		return UserDTO.createDto(user);
	}

	static async deleteUser(user: UserDocument) {
		await user.delete();
		await UserToken.deleteOne({ userId: user.id });
		return UserDTO.createDto(user);
	}
}
