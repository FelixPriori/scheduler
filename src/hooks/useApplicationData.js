import { useState, useEffect } from 'react';
import axios from 'axios';

export function useApplicationData() {
  // setting up the state object
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

   // this function is called when user clicks on a day
  function changeDay(day) {
    setDay(day);
  }


  function updateSpots(id, type) {
    let days = [ ...state.days ];
    // get the day to update
    let dayToUpdate = days.find(day => day.appointments.includes(id));
    // get the day to update's index
    let indexToUpdate = days.indexOf(dayToUpdate);
    // depending on the type, it will either increment, decrement, or do nothing.
    if (type === "DELETING") {
      dayToUpdate.spots += 1;
    } else if (type === "CREATE") {
      dayToUpdate.spots -= 1;
    }
    days[indexToUpdate] = dayToUpdate;
    return days;
  }

  // function called from the save function
  function bookInterview(id, interview, mode) {
    // setting up the appointments object
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // putting the new interview in the database
    return axios.put(
        `/api/appointments/${id}`,
        { interview }
      ).then(() => {
        // updated spots will be returned in this constant
        const newDays = updateSpots(id, mode);
        // setting the state with the new appointment, and updated spots.
        setState({...state, days:newDays, appointments})
      })
    //
  }

  // function called from the cancel function
  function cancelInterview(id){
    // setting up the appointments object
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // setting the deleted interview to null
    appointments[id].interview = null;
    // deleting the interview from db
    return axios.delete(
      `/api/appointments/${id}`
    ).then(() => {
      // updated spots will be returned in this constant
      const newDays = updateSpots(id, "DELETING");
      // setting the state with the deleted appointment, and updated spots.
      setState({...state, days: newDays, appointments});
    })
  }

  // fetches all the data from db and sets the state
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
    // gets called only once on the first render
  }, []);

  // custom hook, all fnctions here are returned to be used in Appplication
  return {state, changeDay, bookInterview, cancelInterview};
}