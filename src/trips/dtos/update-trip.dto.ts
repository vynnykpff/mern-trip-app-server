import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTripDTO {
	@IsMongoId()
	id: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	cityName?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	startDate?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	endDate?: string;
}
