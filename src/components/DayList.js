import React from 'react';
import DayListItem from 'components/DayListItem';

export default function DayList(props) {
  const { days } = props;
  const dayListItems = days.map( day => 
    <DayListItem
      name={day.name}
      spots={day.spots}
      selected={day.name === props.day}
      setDay={props.setDay} 
    />)
  return (<ul>{dayListItems}</ul>);
}