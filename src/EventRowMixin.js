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
    appointmentAddressAccessor: accessor,
    coPayAccessor: accessor,
    soapNoteTitleAccessor: accessor,
    setProfileTitleAccessor: accessor,
    staffsAccessor: accessor,
    isRecurrenceAccessor: accessor,
    isRecurrenceEditAccessor: accessor,
    isEditAccessor: accessor,
    isDeleteAccessor: accessor,
    isCancelAccessor: accessor,
    isUnCancelAccessor: accessor,
    cancellationReasonAccessor: accessor,
    isAppointmentRenderedAccessor: accessor,
    isVideoCallAccessor: accessor,
    isAppoinmentCancelledAccessor: accessor,
    practitionerNameAccessor: accessor,

    usersAvailability: PropTypes.object,

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
      , appointmentAddressAccessor
      , coPayAccessor
      , soapNoteTitleAccessor
      , setProfileTitleAccessor
      , staffsAccessor
      , isRecurrenceAccessor
      , isRecurrenceEditAccessor
      , isEditAccessor
      , isDeleteAccessor
      , isCancelAccessor
      , isUnCancelAccessor
      , cancellationReasonAccessor
      , isAppointmentRenderedAccessor
      , isVideoCallAccessor
      , isAppoinmentCancelledAccessor
      , practitionerNameAccessor
      , usersAvailability
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
        appointmentAddressAccessor={appointmentAddressAccessor}
        coPayAccessor={coPayAccessor}
        soapNoteTitleAccessor={soapNoteTitleAccessor}
        setProfileTitleAccessor={setProfileTitleAccessor}
        staffsAccessor={staffsAccessor}
        isRecurrenceAccessor={isRecurrenceAccessor}
        isRecurrenceEditAccessor={isRecurrenceEditAccessor}
        isEditAccessor={isEditAccessor}
        isDeleteAccessor={isDeleteAccessor}
        isCancelAccessor={isCancelAccessor}
        isUnCancelAccessor={isUnCancelAccessor}
        cancellationReasonAccessor={cancellationReasonAccessor}
        isAppointmentRenderedAccessor={isAppointmentRenderedAccessor}
        isVideoCallAccessor={isVideoCallAccessor}
        isAppoinmentCancelledAccessor={isAppoinmentCancelledAccessor}
        practitionerNameAccessor={practitionerNameAccessor}
        allDayAccessor={allDayAccessor}
        usersAvailability={usersAvailability}
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
