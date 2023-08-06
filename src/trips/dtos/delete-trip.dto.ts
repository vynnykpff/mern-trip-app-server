import { IsMongoId } from 'class-validator';

export class DeleteTripDTO {
	@IsMongoId()
	id: string;
}
