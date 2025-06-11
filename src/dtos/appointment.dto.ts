import { User } from "../entities/User";

export interface CreateAppointmentDTO {
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {}

export interface AppointmentResponseDTO {
  id: number;
  patient: User;
  doctor: User;
  appointmentDate: Date;
}
