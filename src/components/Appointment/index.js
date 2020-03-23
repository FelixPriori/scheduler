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
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(()=> transition(SHOW))
      .catch(()=> transition(ERROR_SAVE, true));
  }

  function cancel() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  }
  return (
    <article className="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
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