import mongoose, {HydratedDocument, InferSchemaType} from 'mongoose';
import crypto from 'crypto';

export const UserSchema = new mongoose.Schema({
	username: {
		required: true,
		type: String,
		unique: true,
	},
	password: {
		required: true,
		type: String,
	},
	salt: {
		required: true,
		type: String,
	},
	avatar: {
		type: String,
		default: 'https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png',
	},
	count: {
		type: Number,
		required: true,
		default: 0,
	},
});

UserSchema.methods.setPassword = function (password: string) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.password = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
		.toString('hex');
};

UserSchema.methods.validatePassword = function (password: string) {
	const newHashedPassword = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
		.toString('hex');
	return this.password === newHashedPassword;
};

export interface IUser extends InferSchemaType<typeof UserSchema> {
	setPassword(password: string): void;

	validatePassword(password: string): boolean;
}

export type UserDocument = HydratedDocument<IUser>;

export const User = mongoose.model<IUser>('User', UserSchema);

export const UserEditableFields = ['username', 'avatar', 'password', 'count'];
