import Joi from "joi";

export const createAppointmentSchema = Joi.object({
  patientId: Joi.number().integer().required(),
  doctorId: Joi.number().integer().required(),
  appointmentDate: Joi.date().required(),
});

export const updateAppointmentSchema = Joi.object({
  patientId: Joi.number().integer(),
  doctorId: Joi.number().integer(),
  appointmentDate: Joi.date(),
}).min(1);
