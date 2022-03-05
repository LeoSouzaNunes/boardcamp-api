import { Router } from "express";
import {
    getCategories,
    createCategory,
} from "../controllers/categoriesController.js";
import checkUniqueDataMiddleware from "../middlewares/checkUniqueDataMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import categorySchema from "../schemas/categorySchema.js";

const categoryRouter = Router();

categoryRouter.get("/categories", getCategories);

categoryRouter.post(
    "/categories",
    validateSchemaMiddleware(categorySchema),
    checkUniqueDataMiddleware("categories", "name"),
    createCategory
);

export default categoryRouter;
