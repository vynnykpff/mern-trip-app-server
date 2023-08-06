import { Types } from 'mongoose';

export class UserDTO {
	id: Types.ObjectId;
	username: string;
	avatar: string;

	constructor(model) {
		this.id = model.id;
		this.username = model.username;
		this.avatar = model.avatar;
	}

	static createDto(model) {
		return new UserDTO(model);
	}
}
