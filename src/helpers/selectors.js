
export function getAppointmentsForDay(state, day) {
  let filteredArray = [];
  if (state.days.length === 0) {
    return filteredArray;
  }
  const arrayOfDays = state.days.filter((obj) => obj.name === day);

  if (arrayOfDays.length === 0) {
    return filteredArray;
  }

  arrayOfDays[0].appointments.forEach(el => {
    for (let appointment in state.appointments) {
      if (el === state.appointments[appointment].id) {
        filteredArray.push(state.appointments[appointment]);
      }
    }
  });

  return filteredArray;
}

export function getInterviewersForDay(state, day) {
  let filteredArray = [];
  if (state.days.length === 0) {
    return filteredArray;
  }

  const arrayOfDays = state.days.filter((obj) => obj.name === day);

  if (arrayOfDays.length === 0) {
    return filteredArray;
  }

  arrayOfDays[0].interviewers.forEach(el => {
    for (let interviewer in state.interviewers) {
      if (el === state.interviewers[interviewer].id) {
        filteredArray.push(state.interviewers[interviewer]);
      }
    }
  });

  return filteredArray;
}

export function getInterview(state, interview) {
  let interviewObj = {};

  if (interview == null) {
    return null;
  }

  for (let appointment in state.appointments) {
    if (state.appointments[appointment].interview == null) {
      continue;
    }
    const interviewId = interview[Object.keys(interview)[1]];
    const appointInterviewerId = state.appointments[appointment]["interview"]["interviewer"];
    if (appointInterviewerId === interviewId) {
      interviewObj["student"] = state.appointments[appointment]["interview"]["student"];
      interviewObj = {...interview};
      interviewObj["interviewer"] = {...state.interviewers[`${state.appointments[appointment]["interview"]["interviewer"]}`]};
    }
  }
  return interviewObj;
}