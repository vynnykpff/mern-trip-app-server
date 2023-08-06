import { Controller } from '@/lib/controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { UserRequest } from '@/types/UserRequest';
import { Response } from 'express';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { CreateTripDTO } from '@/trips/dtos/create-trip.dto';
import { TripsService } from '@/trips/trips.service';
import { UpdateTripDTO } from '@/trips/dtos/update-trip.dto';
import { DeleteTripDTO } from '@/trips/dtos/delete-trip.dto';

// TODO
// d - delete trips

export class TripsController extends Controller {
	static baseUrl = '/trips';

	@TripsController.Post(
		'/',
		authMiddleware,
		validationMiddleware(CreateTripDTO)
	)
	async createTrip(req: UserRequest<CreateTripDTO>, res: Response) {
		return TripsService.createTrip(req.body, req.user.id);
	}

	@TripsController.Get('/', authMiddleware)
	async getAllTrips(req: UserRequest, res: Response) {
		return TripsService.getAllTrips(req.user.id);
	}

	@TripsController.Patch(
		'/',
		authMiddleware,
		validationMiddleware(UpdateTripDTO)
	)
	async updateTrip(req: UserRequest<UpdateTripDTO>, res: Response) {
		return TripsService.updateTrip(req.body);
	}

	@TripsController.Post(
		'/delete',
		authMiddleware,
		validationMiddleware(DeleteTripDTO)
	)
	async deleteTrip(req: UserRequest<DeleteTripDTO>, res: Response) {
		return TripsService.deleteTrip(req.body);
	}
}
