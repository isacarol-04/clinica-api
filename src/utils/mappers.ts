import { AppointmentResponseDTO } from "../dtos/appointment.dto";
import { UserResponseDTO } from "../dtos/user.dto";
import { Appointment } from "../entities/Appointment";
import { User } from "../entities/User";
import { UserRole } from "../types/userRoles";

export function toUserResponseDTO(user: User): UserResponseDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    cpf: user.cpf,
  };
}

export function toAppointmentResponseDTO(
  appointment: Appointment
): AppointmentResponseDTO {
  return {
    id: appointment.id,
    patientId: appointment.patient,
    doctorId: appointment.doctor,
    appointmentDate: appointment.appointmentDate,
  };
}
