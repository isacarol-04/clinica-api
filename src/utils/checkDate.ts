export const isValidAppointmentDate = (date: Date): boolean => {
  const now = new Date();
  if (date <= now) return false;

  const hour = date.getHours();
  if (hour < 8 || hour > 20) return false;

  return true;
};
