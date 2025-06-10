export interface CreateAppointmentDTO {
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {}