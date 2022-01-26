import {useState, useEffect} from "react";
import axios from "axios";

export function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({...state, day});
  //const setDays = days => setState(prev => ({...prev, days}));
  
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then((all) => {
      console.log(all);
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
    .catch(err => console.log(err.message))
  },[])
  
  // function updateSpots(appointments) {
  //   let spots = 0;
  //   for (let appointment in appointments) {
  //     if (!appointment.interview) {
  //       spots++;
  //     }
  //   }
  //   return spots;
  // }

  function updateSpots(state) {
    return state.days.map(day => {
      let spots = 0;
      for (let appointment of day.appointments) {

        if (!state.appointments[appointment].interview) {
          spots++;
        }
      }
      return {...day, spots};
    })
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    // console.log("bookinterview appointment obj", appointment);
  
    const obj = {
      id: appointment.id,
      time: appointment.time,
      interview: {
        student: appointment.interview.student,
        interviewer: appointment.interview ? appointment.interview.interviewer.id : null
      }
    }
  
    const appointments = {
      ...state.appointments,
      [id]: obj
    };

    const newState = {
      ...state,
      appointments
    };
    const daysUpdateSpots = updateSpots(newState);
    //setState((prev) => ({...prev, ...appointments}))
    return axios.put(`/api/appointments/${appointment.id}`, obj)
      .then(() => {
        setState((prev) => ({...prev, appointments, days: daysUpdateSpots}))
      })
     // .catch(err => console.log('axios put error', err.message))
    // console.log("book interview id and interview: ", id, interview);
    // console.log("bookInterview appointments", appointments);
  }
  
  function cancelInterview(id) {
    // state.appointments[id].interview = null;
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newState = {
      ...state,
      appointments
    };
    const daysUpdateSpots = updateSpots(newState);
  
    return axios.delete(`/api/appointments/${appointment.id}`)
      .then(() => {
        setState({...state, appointments, days: daysUpdateSpots});
      })
  }

  return { state, setDay, bookInterview, cancelInterview };
};