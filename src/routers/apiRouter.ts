import {Router} from "express";
import {AuthController} from "@/auth/auth.controller";
import {UsersController} from "@/users/users.controller";
import {TripsController} from "@/trips/trips.controller";

export const apiRouter = Router();

apiRouter.use(AuthController.router);
apiRouter.use(UsersController.router);
apiRouter.use(TripsController.router);
