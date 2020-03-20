import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from 'components/Appointment';

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from 'helpers/selectors'

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));

  function changeDay(day) {
    setDay(day);
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(
      `http://localhost:8001/api/appointments/${id}`,
      appointment
    ).then(() => {
      setState({...state, appointments})
    });
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
      `http://localhost:8001/api/appointments/${id}`
    ).then(() => {
      setState({...state, appointments})
    });
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

  const interviewers = getInterviewersForDay(state, state.day);
  const appointmentsList = getAppointmentsForDay(state, state.day).map( appointment => {
    const interview = getInterview(state, appointment.interview)
    return (
      <Appointment 
        key={appointment.id}
        id={appointment.id}
        interviewers={interviewers}
        time={appointment.time}
        interview={interview}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  appointmentsList.push(<Appointment key="last" id="last" time="5pm"/>);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={day => changeDay(day)}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsList}
      </section>
    </main>
  );
}

