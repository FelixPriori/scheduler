import { useState, useEffect } from 'react';
import axios from 'axios';

export function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  function changeDay(day) {
    setDay(day);
  }

  function updateSpots(id, type) {
    let days = [ ...state.days ];
    // get the day to update
    let dayToUpdate = days.find(day => day.appointments.includes(id));
    // get the day to update's index
    let indexToUpdate = days.indexOf(dayToUpdate);
    if (type === "DELETING") {
      dayToUpdate.spots += 1;
    } else if (type === "CREATE") {
      dayToUpdate.spots -= 1;
    }
    // const spots = days.appointments.reducer((acc, appId) => acc = state.appointments[appId].interview ? acc : acc + 1)
    days[indexToUpdate] = dayToUpdate;
    return days;
  }

  function bookInterview(id, interview, mode) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(
        `/api/appointments/${id}`,
        { interview }
      ).then(() => {
        const newDays = updateSpots(id, mode);
        setState({...state, days:newDays, appointments})
      })
    //
  }

  function cancelInterview(id){
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    appointments[id].interview = null;
    return axios.delete(
      `/api/appointments/${id}`
    ).then(() => {
      const newDays = updateSpots(id, "DELETING");
      setState({...state, days: newDays, appointments});
    })
  }
  
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({
        ...prev, 
        days: all[0].data, 
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    });
  }, []);

  return {state, changeDay, bookInterview, cancelInterview};

}