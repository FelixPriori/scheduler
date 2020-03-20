
export function getAppointmentsForDay (state, day){
  const dayObject = state.days.find(dayKey => dayKey.name === day);
  if (!dayObject) {
    return [];
  };

  const { appointments } = dayObject;
  const filteredAppointments = appointments.map(appointment => state.appointments[appointment]);
  
  return filteredAppointments;
}

export function getInterviewersForDay(state, day) {
  const dayObject = state.days.find(dayKey => dayKey.name === day);
  if (!dayObject) {
    return [];
  };

  const { interviewers } = dayObject;
  const filteredInterviewers = interviewers.map(interviewer => state.interviewers[interviewer]);

  return filteredInterviewers;
};

// passed as interview: { student: "Archie Cohen", interviewer: 2 }
export function getInterview(state, interview) {
  if (interview) {
    return {...interview, interviewer: state.interviewers[interview.interviewer]};
  }
  return null;
}
