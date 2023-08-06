export class TripDTO {
	id: string;
	cityName: string;
	startDate: string;
	endDate: string;

	constructor(model) {
		this.id = model.id;
		this.cityName = model.cityName;
		this.startDate = model.startDate;
		this.endDate = model.endDate;
	}
}
