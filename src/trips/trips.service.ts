import { CreateTripDTO } from '@/trips/dtos/create-trip.dto';
import axios from 'axios';
import { TripsException } from '@/trips/trips.exception';
import { TripDTO } from '@/trips/dtos/trip.dto';
import * as process from 'process';
import { Trip, TripEditableFields } from '@/trips/models/trip.model';
import { UpdateTripDTO } from '@/trips/dtos/update-trip.dto';
import { DeleteTripDTO } from '@/trips/dtos/delete-trip.dto';

export class TripsService {
	private static cityApi = axios.create({
		baseURL: process.env.CITY_SERVER_URL,
	});

	static async getAllTrips(userId: string) {
		const trips = await Trip.find({ userId });
		return trips.map((o) => new TripDTO(o));
	}

	private static formatIncomingTripDate(date: string) {
		const testDateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
		if (!testDateRegex.test(date)) {
			throw TripsException.InvalidDate();
		}

		return date.split('-').join('.');
	}

	static async createTrip(
		{ cityName, startDate, endDate }: CreateTripDTO,
		userId: string
	) {
		const formattedStartDate = this.formatIncomingTripDate(startDate);
		const formattedEndDate = this.formatIncomingTripDate(endDate);

		const newTrip = await Trip.create({
			userId,
			cityName,
			startDate: formattedStartDate,
			endDate: formattedEndDate,
		});
		return new TripDTO(newTrip);
	}

	private static async getTripById(tripId: string) {
		const candidate = Trip.findById(tripId);
		if (!candidate) {
			throw TripsException.TripNotExist();
		}

		return candidate;
	}

	static async updateTrip({ id, ...updateTripDTO }: UpdateTripDTO) {
		const trip = (await this.getTripById(id))!;

		for (const key in updateTripDTO) {
			if (
				TripEditableFields.includes(key) &&
				trip[key] !== updateTripDTO[key]
			) {
				trip[key] = updateTripDTO[key];
			}
		}
		await trip.save();

		return new TripDTO(trip);
	}

	static async deleteTrip({ id }: DeleteTripDTO) {
		const trip = (await this.getTripById(id))!;
		await trip.delete();

		return new TripDTO(trip);
	}
}
