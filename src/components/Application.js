import React from "react";

import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from 'components/Appointment';

import { useApplicationData } from 'hooks/useApplicationData'
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from 'helpers/selectors'

export default function Application() {

  const {
    state,
    changeDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const interviewers = getInterviewersForDay(state, state.day);
  const appointmentsList = getAppointmentsForDay(state, state.day).map( appointment => {
    const interview = getInterview(state, appointment.interview);
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
        <Appointment key="last" id="last" time="5pm"/>
      </section>
    </main>
  );
}

