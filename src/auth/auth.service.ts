import {AuthDTO} from './dtos/auth.dto';
import {User, UserDocument} from '@/users/models/user.model';
import {UserDTO} from '@/users/dtos/user.dto';
import {AuthException} from './auth.exception';
import jwt from 'jsonwebtoken';
import {UserToken} from '@/users/models/user-token.model';
import {Types} from 'mongoose';

export class AuthService {
	static async refreshTokens(refreshToken: string) {
		const userToken = await UserToken.findOne({refreshToken});
		if (!userToken) {
			throw AuthException.ForbiddenException();
		}
		return this.generateTokens(userToken.userId);
	}

	static async generateTokens(userId: Types.ObjectId, save = true) {
		// TODO
		// add sessions system
		const accessToken = jwt.sign(
			{id: userId},
			process.env.JWT_ACCESS_SECRET!,
			{
				expiresIn: '30m',
			}
		);
		const refreshToken = jwt.sign(
			{id: userId},
			process.env.JWT_REFRESH_SECRET!,
			{expiresIn: '7d'}
		);
		if (!save) {
			return {refreshToken, accessToken};
		}
		const candidate = await UserToken.findOne({userId});
		if (!candidate) {
			await UserToken.create({userId, refreshToken});
		} else {
			candidate.refreshToken = refreshToken;
			await candidate.save();
		}
		return {refreshToken, accessToken};
	}

	static async deleteToken(refreshToken: string) {
		const userToken = await UserToken.findOne({refreshToken});
		if (!userToken) {
			throw AuthException.ForbiddenException();
		}
		await userToken.delete();
	}

	static async register({username, password}: AuthDTO) {
		const candidate = await User.findOne({username});
		console.log(candidate);
		if (candidate !== null) {
			throw AuthException.UserAlreadyExist();
		}
		const user = new User({username});
		user.setPassword(password);
		await user.save();

		const {accessToken, refreshToken} = await this.generateTokens(user.id);
		return this.createResponseDto(user, accessToken, refreshToken);
	}

	static async login({username, password}: AuthDTO) {
		const candidate = await User.findOne({username});
		if (!candidate || !candidate.validatePassword(password)) {
			throw AuthException.WrongAuthData();
		}
		const {accessToken, refreshToken} = await this.generateTokens(
			candidate.id
		);
		return this.createResponseDto(candidate, accessToken, refreshToken);
	}

	static verifyRefreshToken(refreshToken: string): Types.ObjectId {
		const {id} = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET
		) as Record<string, any>;
		if (!id) {
			throw AuthException.UnauthorizedException();
		}
		return id;
	}

	static verifyAccessToken(accessToken: string): Types.ObjectId {
		const {id} = jwt.verify(
			accessToken,
			process.env.JWT_ACCESS_SECRET
		) as Record<string, any>;
		if (!id) {
			throw AuthException.UnauthorizedException();
		}
		return id;
	}

	private static async createResponseDto(
		user: UserDocument,
		accessToken: string,
		refreshToken: string
	) {
		const response = {
			accessToken,
			user: UserDTO.createDto(user),
		};
		return {response, refreshToken};
	}
}
