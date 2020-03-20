import React from 'react';
import { useVisualMode } from 'hooks/useVisualMode';

const EMPTY = "EMPTY";

export default function Empty(props) {
  const {mode, transition, back} = useVisualMode()

  return (
    <main className="appointment__add">
      <img
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        onClick={props.onAdd}
      />
    </main>
  );
}