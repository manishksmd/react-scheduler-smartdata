import PropTypes from 'prop-types';
import React from 'react';
import { accessor } from './utils/propTypes';
import { accessor as get } from './utils/accessors';

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

    // custom proptyes
    popupClassName: PropTypes.string,
    hoverDialogActions: PropTypes.func
  }


class AppointmentBox extends React.Component {

    renderStaffs = (staffs) => {
        if (staffs) {
          return staffs.map((obj, index) => {
            return (
              <div className="info-p" key={index}>
                <img src={obj.image} width="35px" height="35px" />
                <p>{obj.staffName}</p>
              </div>
            );
          });
        }
      }

  render() {

    let {
        popupClassName
        , event
        // , patientNameAccessor
      , clinicianImageAccessor
      , clinicianNameAccessor
      , appointmentTypeAccessor
      , appointmentTimeAccessor
      , appointmentAddressAccessor
    //   , coPayAccessor
      , soapNoteTitleAccessor
    //   , setProfileTitleAccessor
      , staffsAccessor
      , isRecurrenceAccessor
      , isRecurrenceEditAccessor
      , isEditAccessor
      , isDeleteAccessor
      , isCancelAccessor
      , isUnCancelAccessor
      , isApproveAccessor
      , cancellationReasonAccessor
      , isAppointmentRenderedAccessor
      , isVideoCallAccessor
      , isAppoinmentCancelledAccessor
      , practitionerNameAccessor
      , hoverDialogActions
    } = this.props;

      let clinicianImage = get(event, clinicianImageAccessor)
    //   , patientName = get(event, patientNameAccessor)
      , clinicianName = get(event, clinicianNameAccessor)
      , appointmentType = get(event, appointmentTypeAccessor)
      , appointmentTime = get(event, appointmentTimeAccessor)
      , appointmentAddress = get(event, appointmentAddressAccessor)
    //   , coPay = get(event, coPayAccessor)
      , soapNoteTitle = get(event, soapNoteTitleAccessor)
    //   , setProfileTitle = get(event, setProfileTitleAccessor)
      , staffs = get(event, staffsAccessor)
      , isRecurrence = get(event, isRecurrenceAccessor)
      , isRecurrenceEdit = get(event, isRecurrenceEditAccessor)
      , isEdit = get(event, isEditAccessor)
      , isDelete = get(event, isDeleteAccessor)
      , isCancel = get(event, isCancelAccessor)
      , isApprove = get(event, isApproveAccessor)
      , isUnCancel = get(event, isUnCancelAccessor)
      , cancellationReason = get(event, cancellationReasonAccessor)
      , practitionerName = get(event, practitionerNameAccessor)
      , isAppointmentRendered = get(event, isAppointmentRenderedAccessor)
      , isVideoCall = get(event, isVideoCallAccessor)
      , isAppoinmentCancelled = get(event, isAppoinmentCancelledAccessor)

    return (
        <div className={popupClassName}>
              <div className="topbar">
                <div className="info-title">Appointment info</div>
                <div className="icons">
                    <ul>
                    {isRecurrenceEdit ? <li><a title="Edit recurrence" className="edit" href="#" onClick={(e) => hoverDialogActions(event, e, 'edit_recurrence')}><i className="fa fa-repeat" aria-hidden="true"></i></a></li> : ''}
                    {isApprove ? <li><a title="Approve" className="edit" href="#" onClick={(e) => hoverDialogActions(event, e, 'approve')}><i className="fa fa-check" aria-hidden="true"></i></a></li> : ''}
                    {isCancel ?
                      <li>
                        <a title="Cancel" className="edit" href="#" onClick={(e) => hoverDialogActions(event, e, 'cancel')}>
                          <i className="fa fa-ban" aria-hidden="true"></i>
                        </a>
                      </li>
                      : isUnCancel ?
                      <li>
                      <a title="Undo Cancel" className="edit" href="#" onClick={(e) => hoverDialogActions(event, e, 'uncancel')}>
                        <i className="fa fa-undo" aria-hidden="true"></i>
                      </a>
                    </li>
                    : ''}
                    {isEdit ? <li><a title="Edit" className="edit" href="#" onClick={(e) => hoverDialogActions(event, e, 'edit')}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></a></li> : ''}
                    {isDelete ? <li><a title="Delete" className="trash" href="#" onClick={(e) => hoverDialogActions(event, e, 'delete')}><i className="fa fa-trash-o" aria-hidden="true"></i></a></li> : ''}
                    </ul>
                </div>
              </div>
              <div className="info-content">
                  <div className="personal-info">
                  <div className="boxicon">
                  {isRecurrence ? <i title="Recurrence Appointment" className="fa fa-repeat" aria-hidden="true"></i> : ''}
                  {isAppointmentRendered ? <i title="Rendered Appointment" className="fa fa-check-circle-o" aria-hidden="true"></i> : ''}
                  {isVideoCall ? <i title="Video Call in Appointment" className="fa fa-video-camera" aria-hidden="true"></i> : ''}
                  {isAppoinmentCancelled ? <i title={`${cancellationReason}`} className="fa fa-ban" aria-hidden="true"></i> : ''}
                  </div>
                    {staffs ? this.renderStaffs(staffs) :
                      <div>
                        <div className="info-pic">
                        <img src={clinicianImage} width="80px" height="80px" onClick={(e) => hoverDialogActions(event, e, 'view_profile')}/></div>
                        <div className="info-p">
                          <div className="name" onClick={(e) => hoverDialogActions(event, e, 'view_profile')}>{clinicianName}</div>
                          <a href="#" onClick={(e) => hoverDialogActions(event, e, 'soap_note')}>{soapNoteTitle}</a>
                        </div>
                      </div>
                    }
                  </div>
                  <div className="about-event">
                      <div className="info-p">
                      <p><i className="fa fa-clock-o" aria-hidden="true"></i><span>{appointmentTime}</span></p>
                      { practitionerName ? <p><i className="fa fa-user" aria-hidden="true"></i><span>{practitionerName}</span></p> : ''}
                      <p><i className="fa fa-calendar-o" aria-hidden="true"></i><span>{appointmentType}</span></p>
                      <p><i className="fa fa-map-marker" aria-hidden="true"></i><span>{appointmentAddress}</span></p>
                      </div>
                  </div>
              </div>
            </div>
        )
    }
}

AppointmentBox.propTypes = propTypes;

export default AppointmentBox;
