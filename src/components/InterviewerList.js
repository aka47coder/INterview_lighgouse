import React from "react";

import PropTypes from 'prop-types';

import "components/InterviewerList.scss"

import InterviewerListItem from "./InterviewerListItem";

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};


export default function InterviewerList(props) {
  const InterviewerListItems = props.interviewers.map( interviewer => {
    return (
      <InterviewerListItem 
        key={interviewer.id} 
        name={interviewer.name} 
        avatar={interviewer.avatar} 
        selected = {interviewer.id === (props.value ? props.value.id : "")}
        interviewer={interviewer} 
        setInterviewer = {props.onChange}
      />
    );
  });
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{InterviewerListItems}</ul>
    </section>
  );
};