import {  RequestHandler, Response, NextFunction } from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  getPatientAppointment,
  updateAppointment,
} from "../services/appointmentService";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "../validations/appointment";
import { CreateAppointmentDTO } from "../dtos/appointment.dto";
import { createError } from "../utils/createError";
import { AuthorizedRequest } from "../types/request";
import { UserRole } from "../types/userRoles";
import { Appointment } from "../entities/Appointment";

export function getAppointments(): RequestHandler {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const access = req.user;
      const appointmentFetchers: Record<
        UserRole,
        () => Promise<Appointment[]>
      > = {
        [UserRole.ADMIN]: () => getAllAppointments(),
        [UserRole.DOCTOR]: () => getDoctorAppointments(access.id),
        [UserRole.PATIENT]: () => getPatientAppointments(access.id),
      };
      const appointments: Appointment[] = await appointmentFetchers[
        access.role
      ]();
      
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      next(error);
    }
  };
}

export function getAppointmentByIdController(): RequestHandler {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const access = req.user;
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw createError("Invalid Appointment id", 400);
      }

      const appointmentFetchersById: Record<
        UserRole, 
        (id: number) => Promise<Appointment | null>
      > = {
        [UserRole.ADMIN]: (id) => getAppointmentById(id),
        [UserRole.DOCTOR]: (id) => getDoctorAppointment(id, access.id),
        [UserRole.PATIENT]: (id) => getPatientAppointment(id, access.id),
      };

      let appointment: Appointment = await appointmentFetchersById[access.role](id);
      if (!appointment) {
        throw createError("Appointment not found", 404);
      }

      res.json(appointment);
    } catch (error: any) {
      console.error("Error fetching appointment:", error);
      next(error);
    }
  };
}

export function createAppointmentController(): RequestHandler {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedForm = await createAppointmentSchema.validateAsync(
        req.body
      );
      const appointmentForm = validatedForm as CreateAppointmentDTO;
      const appointment = await createAppointment(appointmentForm);

      res.status(201).json(appointment);
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      if (error.isJoi) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
}

export function updateAppointmentController(): RequestHandler {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const access = req.user;
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw createError("Invalid Appointment id", 400);
      }

      const validatedForm = await updateAppointmentSchema.validateAsync(
        req.body
      );

      const appointmentToUpdate = await getAppointmentById(id);
      if (!appointmentToUpdate) {
        throw createError("Appointment not found", 404);
      }
      
      const userId = access.role != UserRole.ADMIN ? access.id : undefined;
      const updatedAppointment = await updateAppointment(id, validatedForm, userId);
      res.json(updatedAppointment);
    } catch (error: any) {
      console.error("Error updating Appointment:", error);
      if (error.isJoi) {
        res.status(400).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
}

export function deleteAppointmentController(): RequestHandler {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const access = req.user;
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw createError("Invalid Appointment id", 400);
      }

      const userId = access.role != UserRole.ADMIN ? access.id : undefined;
      const deletedAppointment = await deleteAppointment(id, userId);

      if (!deletedAppointment) {
        throw createError("Appointment not found", 404);
      }
      res.json({ message: "Appointment deleted successfully", id });
    } catch (error: any) {
      console.error("Error deleting Appointment:", error);
      next(error);
    }
  };
}
