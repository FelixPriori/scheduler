import React, { useState } from "react";

import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from 'components/Appointment';

const days = [
  {
    id: 1,
    name: "Monday",
    spots: 2,
  },
  {
    id: 2,
    name: "Tuesday",
    spots: 5,
  },
  {
    id: 3,
    name: "Wednesday",
    spots: 0,
  },
];

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "4pm",
    interview: {
      student: "Silo",
      interviewer: {
        id: 5, 
        name: "Sven Jones", 
        avatar: "https://i.imgur.com/twYrpay.jpg" 
      },
    },
  },
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Bob",
      interviewer: { 
        id: 2, 
        name: "Tori Malcolm", 
        avatar: "https://i.imgur.com/Nmx0Qxo.png" },
    }
  },
  {
    id: 5,
    time: "4pm",
    interview: {
      student: "Chicken",
      interviewer: {
        id: 5, 
        name: "Sven Jones", 
        avatar: "https://i.imgur.com/twYrpay.jpg" 
      },
    },
  },
];

export default function Application(props) {

  const [day, setDay] = useState('Monday');

  function changeDay(day) {
    setDay(day)
  }

  const appointmentsList = appointments.map( appointment => {
    return (
      <Appointment 
        key={appointment.id}
        {...appointment}
      />
    );
  });
  appointmentsList.push(<Appointment key="last" id="last" time="5pm"/>)

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
            days={days}
            day={day}
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

