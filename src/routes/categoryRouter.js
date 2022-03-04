import { Router } from "express";
import {
    getCategories,
    createCategory,
} from "../controllers/categoriesController.js";
import checkUniqueNameMiddleware from "../middlewares/checkUniqueNameMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import categorySchema from "../schemas/categorySchema.js";

const categoryRouter = Router();

categoryRouter.get("/categories", getCategories);
categoryRouter.post(
    "/categories",
    validateSchemaMiddleware(categorySchema),
    checkUniqueNameMiddleware("categories"),
    createCategory
);

export default categoryRouter;
