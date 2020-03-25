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
    if (type === "delete") {
      dayToUpdate.spots += 1;
    } else if (type === "book") {
      dayToUpdate.spots -= 1;
    }

    days[indexToUpdate] = dayToUpdate;
    setState({...state, days});
  }

  function bookInterview(id, interview) {
    return axios.put(
        `http://localhost:8001/api/appointments/${id}`,
        { interview }
      ).then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setState({...state, appointments})
      }).then(() => {
        updateSpots(id, "book");
      }).catch(e => console.log(e));
    //
  }

  function cancelInterview(id){
    return axios.delete(
      `http://localhost:8001/api/appointments/${id}`
    ).then(() => {
      const appointment = {
        ...state.appointments[id],
        interview: null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      appointments[id].interview = null;
      setState({...state, appointments});
    }).then(() => {
      updateSpots(id, "delete");
    }).catch(e => console.log(e));
  }
  
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
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