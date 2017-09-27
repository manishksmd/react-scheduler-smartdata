import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import EventCell from './EventCell';
import getHeight from 'dom-helpers/query/height';
import { accessor, elementType } from './utils/propTypes';
import { segStyle } from './utils/eventLevels';
import { isSelected } from './utils/selection';

/* eslint-disable react/prop-types */
export default {
  propTypes: {
    slots: PropTypes.number.isRequired,
    end: PropTypes.instanceOf(Date),
    start: PropTypes.instanceOf(Date),

    selected: PropTypes.object,
    eventPropGetter: PropTypes.func,
    titleAccessor: accessor,
    // @Appointment field info declaration
    patientNameAccessor: accessor,
    clinicianImageAccessor: accessor,
    clinicianNameAccessor: accessor,
    appointmentTypeAccessor: accessor,
    appointmentTimeAccessor: accessor,
    coPayAccessor: accessor,

    allDayAccessor: accessor,
    startAccessor: accessor,
    endAccessor: accessor,

    eventComponent: elementType,
    eventWrapperComponent: elementType.isRequired,
    onSelect: PropTypes.func
  },

  defaultProps: {
    segments: [],
    selected: {},
    slots: 7
  },

  renderEvent(props, event) {
    let {
        eventPropGetter, selected, start, end
      , startAccessor
      , endAccessor
      , titleAccessor
      , patientNameAccessor
      , clinicianImageAccessor
      , clinicianNameAccessor
      , appointmentTypeAccessor
      , appointmentTimeAccessor
      , coPayAccessor
      , allDayAccessor, eventComponent
      , eventWrapperComponent
      , onSelect } = props;

    return (
      <EventCell
        event={event}
        eventWrapperComponent={eventWrapperComponent}
        eventPropGetter={eventPropGetter}
        onSelect={onSelect}
        selected={isSelected(event, selected)}
        startAccessor={startAccessor}
        endAccessor={endAccessor}
        titleAccessor={titleAccessor}
        patientNameAccessor={patientNameAccessor}
        clinicianImageAccessor={clinicianImageAccessor}
        clinicianNameAccessor={clinicianNameAccessor}
        appointmentTypeAccessor={appointmentTypeAccessor}
        appointmentTimeAccessor={appointmentTimeAccessor}
        coPayAccessor={coPayAccessor}
        allDayAccessor={allDayAccessor}
        slotStart={start}
        slotEnd={end}
        eventComponent={eventComponent}
      />
    )
  },

  renderSpan(props, len, key, content = ' ', left){
    let { slots } = props;

    let customClass = `rbc-row-segment custom-class-${left}`;
    return (
      <div key={key} className={customClass} style={segStyle(Math.abs(len), slots)}>
        {content}
      </div>
    )
  },

  getRowHeight(){
    getHeight(findDOMNode(this))
  }
}
