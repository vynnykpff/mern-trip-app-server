import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTripDTO {
	@IsString()
	@IsNotEmpty()
	cityName: string;

	@IsString()
	@IsNotEmpty()
	startDate: string;

	@IsString()
	@IsNotEmpty()
	endDate: string;
}
