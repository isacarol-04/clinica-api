import { getDoctorAppointmentsByDate, getPatientAppointmentsByDate } from "../services/appointmentService";
import { isValidAppointmentDate } from "./checkDate";
import { checkUserExistsByRole } from "./ckeckUserExists";
import { createError } from "../utils/createError";

export async function validateAppointmentData(
  patientId: number,
  doctorId: number,
  appointmentDate: Date,
  appointmentIdToIgnore?: number 
) {
  const patientExists = await checkUserExistsByRole(patientId, "patient");
  if (!patientExists) {
    throw createError("Patient ID not found or is not a patient.", 404);
  }

  const doctorExists = await checkUserExistsByRole(doctorId, "doctor");
  if (!doctorExists) {
    throw createError("Doctor ID not found or is not a doctor.", 404);
  }

  if (!isValidAppointmentDate(appointmentDate)) {
    throw createError(
      "Scheduled time must be in the future and between 8AM and 8PM.",
      400
    );
  }

  const patientConflict = await getPatientAppointmentsByDate(patientId, appointmentDate);
  if (patientConflict && patientConflict.id !== appointmentIdToIgnore) {
    throw createError("Patient already has an appointment at this time.", 409);
  }

  const doctorConflict = await getDoctorAppointmentsByDate(doctorId, appointmentDate);
  if (doctorConflict && doctorConflict.id !== appointmentIdToIgnore) {
    throw createError("Doctor already has an appointment at this time.", 409);
  }
}
