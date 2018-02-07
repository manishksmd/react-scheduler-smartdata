import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import dates from './utils/dates';
import { accessor, elementType } from './utils/propTypes';
import { accessor as get } from './utils/accessors';
import Img from './img/doctor.png';
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
  isAppointmentRenderedAccessor: accessor,
  isVideoCallAccessor: accessor,
  isAppoinmentCancelledAccessor: accessor,

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
    this.renderStaffs = this.renderStaffs.bind(this);
  }

  renderStaffs(staffs) {
    if (staffs) {
      return staffs.map((obj, index) => {
        return (
          <div className="info-p">
            <img src={obj.image} width="35px" height="35px" />
            <p>{obj.staffName}</p>
          </div>
        );
      });
    }
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
      , isAppointmentRenderedAccessor
      , isVideoCallAccessor
      , isAppoinmentCancelledAccessor
      , slotStart
      , slotEnd
      , onSelect
      , eventComponent: Event
      , eventWrapperComponent: EventWrapper
      , ...props } = this.props;

    let title = get(event, titleAccessor)
      , patientName = get(event, patientNameAccessor)
      , clinicianImage = get(event, clinicianImageAccessor)
      , clinicianName = get(event, clinicianNameAccessor)
      , appointmentType = get(event, appointmentTypeAccessor)
      , appointmentTime = get(event, appointmentTimeAccessor)
      , appointmentAddress = get(event, appointmentAddressAccessor)
      , coPay = get(event, coPayAccessor)
      , soapNoteTitle = get(event, soapNoteTitleAccessor)
      , setProfileTitle = get(event, setProfileTitleAccessor)
      , staffs = get(event, staffsAccessor)
      , isRecurrence = get(event, isRecurrenceAccessor)
      , isRecurrenceEdit = get(event, isRecurrenceEditAccessor)
      , isEdit = get(event, isEditAccessor)
      , isDelete = get(event, isDeleteAccessor)
      , isCancel = get(event, isCancelAccessor)
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
            <div className="appointment_box month_box">
              <div className="topbar">
                <div className="info-title">Appointment info</div>
                <div className="icons">
                    <ul>
                    {isRecurrenceEdit ? <li><a title="Edit recurrence" className="edit" href="#" onClick={(e) => this.hoverDialogActions(event, e, 'edit_recurrence')}><i className="fa fa-repeat" aria-hidden="true"></i></a></li> : ''}
                    {isCancel ? <li><a title="Cancel" className="edit" href="#" onClick={(e) => this.hoverDialogActions(event, e, 'cancel')}><i className="fa fa-ban" aria-hidden="true"></i></a></li> : ''}
                    {isEdit ? <li><a title="Edit" className="edit" href="#" onClick={(e) => this.hoverDialogActions(event, e, 'edit')}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></a></li> : ''}
                    {isDelete ? <li><a title="Delete" className="trash" href="#" onClick={(e) => this.hoverDialogActions(event, e, 'delete')}><i className="fa fa-trash-o" aria-hidden="true"></i></a></li> : ''}
                    </ul>
                </div>
              </div>
              <div className="info-content">
                  <div className="personal-info">
                  <div className="boxicon">
                  {isRecurrence ? <i title="Recurrence Appointment" className="fa fa-repeat" aria-hidden="true"></i> : ''}
                  {isAppointmentRendered ? <i title="Rendered Appointment" className="fa fa-check-circle-o" aria-hidden="true"></i> : ''}
                  {isVideoCall ? <i title="Video Call in Appointment" className="fa fa-video-camera" aria-hidden="true"></i> : ''}
                  {isAppoinmentCancelled ? <i title="Cancelled Appointment" className="fa fa-ban" aria-hidden="true"></i> : ''}
                  </div>
                    {staffs ? this.renderStaffs(staffs) :
                      <div>
                        <div className="info-pic"><img src={clinicianImage} width="80px" height="80px" /></div>
                        <div className="info-p">
                          <div className="name" onClick={(e) => this.hoverDialogActions(event, e, 'view_profile')}>{clinicianName}</div>
                          {/*
                            <a href="#" onClick={(e) => this.hoverDialogActions(event, e, 'view_profile')}>{setProfileTitle}</a>
                          */}
                          <a href="#" onClick={(e) => this.hoverDialogActions(event, e, 'soap_note')}>{soapNoteTitle}</a>
                        </div>
                      </div>
                    }
                  </div>
                  <div className="about-event">
                      <div className="info-p">
                        <p><b>Time: </b><span>{appointmentTime}</span></p>
                        <p><b>Appointment: </b><span>{appointmentType}</span></p>
                        <p><b>Address: </b><span>{appointmentAddress}</span></p>
                        {/*<p><b>Co-Pay: </b><span><i className="fa fa-usd" aria-hidden="true"></i> {coPay ? coPay : '0.00'}</span></p>*/}
                      </div>
                  </div>
              </div>
            </div>
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
