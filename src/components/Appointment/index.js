import React from "react";

import Header from "./Header";

import Show from "./Show";

import Empty from "./Empty";

import Form from "./Form";

import Status from "./Status";

import Confirm from "./Confirm";

import Error from "./Error";

import "components/Appointment/styles.scss";

import { useVisualMode } from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE ="CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const {mode, transition, back} = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer: interviewer
    };

    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW, true);
    })
    .catch(() => {
      transition(ERROR_SAVE, false);
    });
  }

  function cancel() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(() => {transition(ERROR_DELETE, true)})
  }
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview ? props.interview.student : ""}
          interviewer={props.interview ? props.interview.interviewer : null}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          student={props.interview ? props.interview.student : ''}
          interviewer={props.interview ? props.interview.interviewer.id : ''}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => transition(EMPTY)}
        />
      )}
      {mode === SAVING && (
        <Status message="Saving"/>
      )}
      {mode === DELETING && (
        <Status message="Deleting"/>
      )}
      {mode === CONFIRM && (
        <Confirm 
        message="Confirm"
        onCancel={() => transition(SHOW)}
        onConfirm={cancel}
        />
      )}

      {mode === EDIT && (
        <Form
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        interviewers={props.interviewers}
        onSave={save}
        onCancel={() => transition(SHOW)}
      />
      )}
      {mode === ERROR_SAVE && (
        <Error 
        message="Save"
        onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
         <Error 
         message="Delete"
         onClose={back}
         />
      )}
    </article>
  );
}