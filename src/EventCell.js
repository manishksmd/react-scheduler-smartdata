import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import dates from './utils/dates';
import { accessor, elementType } from './utils/propTypes';
import { accessor as get } from './utils/accessors';
import Img from './img/doctor.png';
import AppointmentBox from './AppointmentBox';
let propTypes = {
  event: PropTypes.object.isRequired,
  slotStart: PropTypes.instanceOf(Date),
  slotEnd: PropTypes.instanceOf(Date),

  selected: PropTypes.bool,
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
  isApproveAccessor: accessor,
  cancellationReasonAccessor: accessor,
  isAppointmentRenderedAccessor: accessor,
  isVideoCallAccessor: accessor,
  isAppoinmentCancelledAccessor: accessor,
  practitionerNameAccessor: accessor,

  allDayAccessor: accessor,
  startAccessor: accessor,
  endAccessor: accessor,

  eventComponent: elementType,
  eventWrapperComponent: elementType.isRequired,
  onSelect: PropTypes.func
}

class EventCell extends React.Component {

  constructor(props) {
    super(props);
    this.hoverDialogActions = this.hoverDialogActions.bind(this);
  }

  render() {
    let {
        className
      , event
      , selected
      , eventPropGetter
      , startAccessor
      , endAccessor
      , titleAccessor
      , isAppointmentRenderedAccessor
      , isVideoCallAccessor
      , isAppoinmentCancelledAccessor
      , isRecurrenceAccessor
      , slotStart
      , slotEnd
      , eventComponent: Event
      , eventWrapperComponent: EventWrapper
      , ...props } = this.props;

    let title = get(event, titleAccessor)
    , isRecurrence = get(event, isRecurrenceAccessor)
      , isAppointmentRendered = get(event, isAppointmentRenderedAccessor)
      , isVideoCall = get(event, isVideoCallAccessor)
      , isAppoinmentCancelled = get(event, isAppoinmentCancelledAccessor)
      , end = get(event, endAccessor)
      , start = get(event, startAccessor)
      , isAllDay = get(event, props.allDayAccessor)
      , continuesPrior = dates.lt(start, slotStart, 'day')
      , continuesAfter = dates.gt(end, slotEnd, 'day')

    if (eventPropGetter)
      var { style, className: xClassName } = eventPropGetter(event, start, end, selected);

    return (
      <EventWrapper event={event}>
        <div
          style={{...props.style, ...style}}
          className={cn('rbc-event', className, xClassName, {
            'rbc-selected': selected,
            'rbc-event-allday': isAllDay || dates.diff(start, dates.ceil(end, 'day'), 'day') > 1,
            'rbc-event-continues-prior': continuesPrior,
            'rbc-event-continues-after': continuesAfter
          })}
          // onClick={(e) => onSelect(event, e)}
        >
          <div className='rbc-event-content'>
          <ul className="quickview">
            {isRecurrence === true ? <li><i className="fa fa-repeat" aria-hidden="true"></i></li> : ''}
            {isAppointmentRendered ? <li><i className="fa fa-check-circle-o" aria-hidden="true"></i></li> : ''}
            {isVideoCall ? <li><i className="fa fa-video-camera" aria-hidden="true"></i></li> : ''}
            {isAppoinmentCancelled ? <li><i className="fa fa-ban" aria-hidden="true"></i></li> : ''}
            </ul>
            { Event
              ? <Event event={event} title={title}/>
              : title
            }
            <AppointmentBox
              {...this.props}
              popupClassName="appointment_box month_box"
              hoverDialogActions={this.hoverDialogActions}
            />
          </div>
        </div>
      </EventWrapper>
    );
  }
  hoverDialogActions(event, e, action) {
    e.preventDefault();
    event.action = action;
    this.props.onSelect(event, e);
  }
}

EventCell.propTypes = propTypes;

export default EventCell
