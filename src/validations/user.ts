import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "doctor", "patient").required(),
  password: Joi.string().min(6).required(),
  cpf: Joi.string().pattern(/^\d{11}$/).optional(), 
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid("admin", "doctor", "patient").optional(),
  password: Joi.string().min(6).optional(),
  cpf: Joi.string().pattern(/^\d{11}$/).optional(),
});
