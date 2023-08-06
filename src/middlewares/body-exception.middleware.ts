import { ResponseDTO } from '@/dtos/response.dto';
import { NextFunction, Request, Response } from 'express';

export const bodyExceptionMiddleware = (
	err: SyntaxError | unknown,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (process.env.NODE_ENV === 'dev') {
		console.log(err);
	}
	if (err instanceof SyntaxError && 'body' in err) {
		return res.status(400).json(new ResponseDTO(err.message, 400)); // Bad request
	}
	next();
};
