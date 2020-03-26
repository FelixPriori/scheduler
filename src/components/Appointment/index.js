import React from 'react';
import "components/Appointment/styles.scss";
import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import { useVisualMode } from 'hooks/useVisualMode';

// mode variable declaration
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIM";
const EDIT = "EDIT";
const ERROR_DELETE = "ERROR_DELETE";
const ERROR_SAVE = "ERROR_SAVE";

export default function Appointment(props) {
  // if interview is defined, then the default mode will be SHOW
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  // called when user clicks save
  function save(name, interviewer) {
    // currentMode will dictate how the spots will be updated
    // here it can be either EDIT or CREATE
    const currentMode = mode;
    //setting up interview object to pass to the bookInterview function
    const interview = {
      student: name,
      interviewer
    };
    // before doing the put request, switching to SAVING mode
    transition(SAVING);
    props.bookInterview(props.id, interview, currentMode)
      // if bookInterview was successful, we show the new appointment
      .then(()=> transition(SHOW))
      // else it will show the error message
      .catch(()=> transition(ERROR_SAVE, true));
  }

  // called when the user clicks cancel
  function cancel() {
    // before doing the delete request, switching to DELETING mode
    transition(DELETING, true);
    props.cancelInterview(props.id)
      // if cancelInterview was successful, showing empty appointment
      .then(() => transition(EMPTY))
      // else, it will show the error message
      .catch(() => transition(ERROR_DELETE, true));
  }

  // What will be shown as an appointment depends on the current mode.
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && props.interview && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={() => transition(CONFIRM)}
            onEdit={() => transition(EDIT)}
          />
        )}
        {mode === CREATE && (
          <Form 
            interviewers={props.interviewers}
            onCancel={() => back()}
            onSave={save}
          />
        )}
        {mode === EDIT && (
          <Form
            interviewers={props.interviewers}
            name={props.interview.student}
            interviewer={props.interview.interviewer.id}
            onCancel={() => back()}
            onSave={save}
          />
        )}
        {mode === SAVING && (<Status message={SAVING} />)}
        {mode === DELETING && (<Status message={DELETING} />)}
        {mode === CONFIRM && (
          <Confirm
            message={"Are you sure you would like to delete?"}
            onCancel={()=> back()}
            onConfirm={()=> cancel()}
          />
        )}
        {mode === ERROR_DELETE && (
          <Error 
            message={"Could not cancel the appointment"}
            onClose={() => back()}
          />
        )}
        {mode === ERROR_SAVE && (
          <Error 
            message={"Could not save the appointment"}
            onClose={() => back()}
          />
        )}
    </article>
  );
}