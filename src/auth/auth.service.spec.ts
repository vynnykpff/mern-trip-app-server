import {AuthService} from '@/auth/auth.service';
import {UserDTO} from '@/users/dtos/user.dto';
import {MemoryDatabase} from '@/testing-utils/MemoryDatabase';
import {AuthException} from '@/auth/auth.exception';
import {UserToken} from '@/users/models/user-token.model';
import {testDto} from '@/testing-utils/testDto';
import {User} from '@/users/models/user.model';

type AuthResponse = {
	refreshToken: string;
	response: {
		accessToken: string;
		user: UserDTO;
	};
};

const testAuthResponse = async (res: AuthResponse) => {
	expect(Object.keys(res)).toEqual(['response', 'refreshToken']);
	expect(typeof res.refreshToken).toBe('string');
	expect(Object.keys(res.response)).toEqual(['accessToken', 'user']);
	testDto(res.response.user, UserDTO);
	const {user} = res.response;
	expect(!!(await UserToken.findOne({userId: user.id}))).toBeTruthy();
};

describe('AuthService', () => {
	const memDb = new MemoryDatabase();

	afterAll(() => {
		memDb.closeDatabase();
	});

	let refreshMock: string;

	describe('AuthService.register', () => {
		it('should return a new user', async () => {
			const res = await AuthService.register({
				username: 'vynnykpff',
				password: '12345678',
			});
			await testAuthResponse(res);
			refreshMock = res.refreshToken;
		});

		it('should throw error that user with this username already exist', async () => {
			await expect(
				AuthService.register({
					username: 'vynnykpff',
					password: '12345678',
				})
			).rejects.toEqual(AuthException.UserAlreadyExist());
		});
	});

	describe('AuthService.login', () => {
		it('should return an authorized user', async () => {
			const res = await AuthService.login({
				username: 'vynnykpff',
				password: '12345678',
			});
			await testAuthResponse(res);
		});

		it('should throw error that user with this username is not exist', async () => {
			await expect(
				AuthService.login({
					username: 'arti',
					password: '12345678',
				})
			).rejects.toEqual(AuthException.WrongAuthData());
		});

		it('should throw error that user password is not right', async () => {
			await expect(
				AuthService.login({
					username: 'vynnykpff',
					password: '123456789',
				})
			).rejects.toEqual(AuthException.WrongAuthData());
		});
	});

	describe('AuthService.refreshTokens', () => {
		it('should throw error that refreshToken is not exist in db', async () => {
			await expect(
				AuthService.refreshTokens('someAbsurdValue')
			).rejects.toEqual(AuthException.ForbiddenException());
		});

		it('should return a new tokens (accessToken, refreshToken)', async () => {
			const res = await AuthService.refreshTokens(refreshMock);
			expect(Object.keys(res)).toEqual(['refreshToken', 'accessToken']);
			expect(Object.values(res).map((o) => typeof o)).toEqual([
				'string',
				'string',
			]);
			await AuthService.verifyAccessToken(res.accessToken);
			await AuthService.verifyRefreshToken(res.refreshToken);
			refreshMock = res.refreshToken;
		});
	});

	describe('AuthService.deleteToken', () => {
		it('should throw error that token is not exist', async () => {
			await expect(AuthService.deleteToken('someAbsurdValue')).rejects.toEqual(
				AuthException.ForbiddenException()
			);
		});

		it('should delete a token from database', async () => {
			await AuthService.deleteToken(refreshMock);
			expect(
				Boolean(await UserToken.findOne({refreshToken: refreshMock}))
			).toBeFalsy();
		});
	});
});
