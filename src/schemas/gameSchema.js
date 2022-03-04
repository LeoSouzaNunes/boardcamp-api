import joi from "joi";

const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi
        .string()
        .pattern(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i)
        .required(),
    stockTotal: joi
        .string()
        .pattern(/^[0-9]+$/)
        .required(),
    categoryId: joi.number().integer().required(),
    pricePerDay: joi
        .string()
        .pattern(/^[0-9]+$/)
        .required(),
});

export default gameSchema;
