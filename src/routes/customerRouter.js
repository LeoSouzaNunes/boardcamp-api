import { Router } from "express";
import {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
} from "../controllers/customersController.js";
import checkUniqueDataMiddleware from "../middlewares/checkUniqueDataMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import customerSchema from "../schemas/customerSchema.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);

customerRouter.get("/customers/:id", getCustomer);

customerRouter.post(
    "/customers",
    validateSchemaMiddleware(customerSchema),
    checkUniqueDataMiddleware("customers", "cpf"),
    createCustomer
);

customerRouter.put(
    "/customers/:id",
    validateSchemaMiddleware(customerSchema),
    checkUniqueDataMiddleware("customers", "cpf"),
    updateCustomer
);

export default customerRouter;
