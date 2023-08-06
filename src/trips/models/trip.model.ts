import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export const TripSchema = new mongoose.Schema({
	userId: {
		ref: 'User',
		required: true,
		type: mongoose.Schema.Types.ObjectId,
	},
	cityName: {
		type: String,
		required: true,
	},
	startDate: {
		type: String,
		required: true,
	},
	endDate: {
		type: String,
		required: true,
	},
});

type TripType = InferSchemaType<typeof TripSchema>;

export type TripDocument = HydratedDocument<TripType>;

export const Trip = mongoose.model<TripType>('Trip', TripSchema);

export const TripEditableFields = ['cityName', 'startDate', 'endDate'];
