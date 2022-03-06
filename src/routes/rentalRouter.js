import { Router } from "express";
import {
    createRental,
    deleteRental,
    getRentals,
    returnRental,
} from "../controllers/rentalsController.js";
import checkOngoingRentalMiddleware from "../middlewares/checkOngoingRentalMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import rentalSchema from "../schemas/rentalSchema.js";

const rentalRouter = Router();

rentalRouter.get("/rentals", getRentals);

rentalRouter.post(
    "/rentals",
    validateSchemaMiddleware(rentalSchema),
    createRental
);

rentalRouter.post(
    "/rentals/:id/return",
    checkOngoingRentalMiddleware,
    returnRental
);

rentalRouter.delete("/rentals/:id", checkOngoingRentalMiddleware, deleteRental);

export default rentalRouter;
