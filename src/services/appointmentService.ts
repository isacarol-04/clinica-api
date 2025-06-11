import { dataSource } from "../config/database";
import {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../dtos/appointment.dto";
import { Appointment } from "../entities/Appointment";
import { validateAppointmentData } from "../utils/validateAppointmentData";

const appointmentRepo = dataSource.getRepository(Appointment);

export async function createAppointment(
  form: CreateAppointmentDTO
): Promise<Appointment> {
  const { patientId, doctorId, appointmentDate } = form;

  await validateAppointmentData(patientId, doctorId, appointmentDate);

  const appointment = appointmentRepo.create({
    patient: { id: patientId },
    doctor: { id: doctorId },
    appointmentDate,
  });

  return appointmentRepo.save(appointment);
}

export async function getAllAppointments() {
  return await appointmentRepo.find({
    relations: ["patient", "doctor"],
    order: {
      appointmentDate: "DESC",
    },
  });
}

export async function getDoctorAppointments(doctorId: number) {
  return await appointmentRepo.find({
    relations: ["patient", "doctor"],
    where: [{ doctor: { id: doctorId } }],
    order: {
      appointmentDate: "DESC",
    },
  });
}

export async function getPatientAppointments(patientId: number) {
  return await appointmentRepo.find({
    relations: ["patient", "doctor"],
    where: [{ patient: { id: patientId } }],
    order: {
      appointmentDate: "DESC",
    },
  });
}

export async function getAppointmentsByUserId(userId: number) {
  return await appointmentRepo.find({
    relations: ["patient", "doctor"],
    where: [{ doctor: { id: userId }, patient: { id: userId } }],
  });
}

export async function getDoctorAppointment(id: number, doctorId: number) {
  return await appointmentRepo.findOne({
    relations: ["patient", "doctor"],
    where: {
      id,
      doctor: { id: doctorId },
    },
  });
}

export async function getPatientAppointment(id: number, patientId: number) {
  return await appointmentRepo.findOne({
    relations: ["patient", "doctor"],
    where: {
      id,
      patient: { id: patientId },
    },
  });
}

export async function getAppointmentById(
  id: number
): Promise<Appointment | null> {
  return appointmentRepo.findOne({
    where: { id },
    relations: ["patient", "doctor"],
  });
}

export async function getPatientAppointmentsByDate(
  userId: number,
  appointmentDate: Date
): Promise<Appointment | null> {
  return appointmentRepo.findOne({
    where: {
      patient: { id: userId },
      appointmentDate,
    },
  });
}

export async function getDoctorAppointmentsByDate(
  userId: number,
  appointmentDate: Date
): Promise<Appointment | null> {
  return appointmentRepo.findOne({
    where: {
      doctor: { id: userId },
      appointmentDate,
    },
  });
}

export async function updateAppointment(
  id: number,
  form: UpdateAppointmentDTO,
  userId?: number
): Promise<Appointment | null> {
  let appointment: Appointment;
  if (userId) {
    appointment = await getDoctorAppointment(id, userId);
  } else {
    appointment = await getAppointmentById(id);
  }
  if (!appointment) return null;

  const patientId = form.patientId ?? appointment.patient.id;
  const doctorId = form.doctorId ?? appointment.doctor.id;
  const appointmentDate = form.appointmentDate ?? appointment.appointmentDate;

  await validateAppointmentData(patientId, doctorId, appointmentDate, id);

  const updatedAppointment = await appointmentRepo.preload({
    id,
    ...form,
  });

  if (!updatedAppointment) return null;
  return appointmentRepo.save(updatedAppointment);
}

export async function deleteAppointment(
  id: number,
  userId?: number
): Promise<boolean> {
  let appointment: Appointment;
  if (userId) {
    appointment = await getDoctorAppointment(id, userId);
  } else {
    appointment = await getAppointmentById(id);
  }
  if (!appointment) {
    return false;
  }

  await appointmentRepo.remove(appointment);
  return true;
}
