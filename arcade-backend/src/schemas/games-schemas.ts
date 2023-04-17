import Joi from "joi";

export const createGameSchema = Joi.object({
	score: Joi.number().required(),
	gameDurationSeconds: Joi.number().required(),
});
