import { RequestHandler, Response, NextFunction } from "express";
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
import { toAppointmentResponseDTO } from "../utils/mappers";

export function getAppointments(): RequestHandler {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const currentUser = req.user;
      const appointmentFetchers: Record<
        UserRole,
        () => Promise<Appointment[]>
      > = {
        [UserRole.ADMIN]: () => getAllAppointments(),
        [UserRole.DOCTOR]: () => getDoctorAppointments(currentUser.id),
        [UserRole.PATIENT]: () => getPatientAppointments(currentUser.id),
      };
      const appointments: Appointment[] = await appointmentFetchers[
        currentUser.role
      ]();

      res.json(appointments.map(toAppointmentResponseDTO));
    } catch (error) {
      console.error("Error fetching appointments:", error);
      next(error);
    }
  };
}

export function getAppointmentByIdController(): RequestHandler {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const currentUser = req.user;
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw createError("Invalid appointment id", 400);
      }

      const appointmentFetchersById: Record<
        UserRole,
        (id: number) => Promise<Appointment | null>
      > = {
        [UserRole.ADMIN]: (id) => getAppointmentById(id),
        [UserRole.DOCTOR]: (id) => getDoctorAppointment(id, currentUser.id),
        [UserRole.PATIENT]: (id) => getPatientAppointment(id, currentUser.id),
      };

      let appointment: Appointment = await appointmentFetchersById[
        currentUser.role
      ](id);
      if (!appointment) {
        throw createError("Appointment not found", 404);
      }

      res.json(toAppointmentResponseDTO(appointment));
    } catch (error: any) {
      console.error("Error fetching appointment:", error);
      next(error);
    }
  };
}

export function createAppointmentController(): RequestHandler {
  return async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    try {
      const currentUser = req.user;
      const validatedForm = await createAppointmentSchema.validateAsync(
        req.body,
        { abortEarly: false }
      );
      const appointmentForm = validatedForm as CreateAppointmentDTO;

      if (currentUser.role == UserRole.DOCTOR) {
        appointmentForm.doctorId = currentUser.id;
      }

      const appointment = await createAppointment(appointmentForm);

      res.status(201).json(toAppointmentResponseDTO(appointment));
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
      const currentUser = req.user;
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw createError("Invalid appointment id", 400);
      }

      const validatedForm = await updateAppointmentSchema.validateAsync(
        req.body,
        { abortEarly: false }
      );

      const appointmentToUpdate = await getAppointmentById(id);
      if (!appointmentToUpdate) {
        throw createError("Appointment not found", 404);
      }

      const userId =
        currentUser.role != UserRole.ADMIN ? currentUser.id : undefined;
      const updatedAppointment = await updateAppointment(
        id,
        validatedForm,
        userId
      );
      res.json(toAppointmentResponseDTO(updatedAppointment));
    } catch (error: any) {
      console.error("Error updating appointment:", error);
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
      const currentUser = req.user;
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw createError("Invalid appointment id", 400);
      }

      const userId =
        currentUser.role != UserRole.ADMIN ? currentUser.id : undefined;
      const deletedAppointment = await deleteAppointment(id, userId);

      if (!deletedAppointment) {
        throw createError("Appointment not found", 404);
      }
      res.json({ message: "Appointment deleted successfully", id });
    } catch (error: any) {
      console.error("Error deleting appointment:", error);
      next(error);
    }
  };
}
