import { Exception } from '@/lib/exception';

export class TripsException extends Exception {
	static UnknownCityName() {
		return new TripsException('Unknown city name.', 404);
	}

	static InvalidDate() {
		return new TripsException(
			"Invalid startDate or endDate format is need to be '2023-08-05'.",
			400
		);
	}

	static TripNotExist() {
		return new TripsException('Trip with this id is not exist', 400);
	}
}
