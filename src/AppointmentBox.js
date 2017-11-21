import PropTypes from 'prop-types';
import React from 'react';

class DaySlot extends React.Component {

  render() {
    return (
        <div className="">
            <div className="topbar">
            <div className="info-title">Appointment info</div>
            <div className="icons">
                <ul>
                    <li><a className="edit" href="#" onClick={(e) => this.hoverDialogActions(event, e, 'edit')}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></a></li>
                    <li><a className="trash" href="#" onClick={(e) => this.hoverDialogActions(event, e, 'delete')}><i className="fa fa-trash-o" aria-hidden="true"></i></a></li>
                </ul>
            </div>
            </div>
            <div className="info-content">
                <div className="personal-info">
                    <div className="info-pic">
                    <img src={Img} width="80px" height="80px" />
                    </div>
                    <div className="info-p">
                    <div className="name">Dr {patientName}</div>
                    {/*<p><b>Phone: </b><span>897-876-6543</span></p>*/}
                    <a href="#" onClick={(e) => this.hoverDialogActions(event, e, 'view_profile')}>View Client Profile</a>
                    <a href="#" onClick={(e) => this.hoverDialogActions(event, e, 'soap_note')}>View Client Profile</a>
                    </div>
                </div>
                <div className="about-event">
                    <div className="info-p">
                    <p><b>Appointment: </b><span>New Patient Consultation</span></p>
                    <p><b>Time: </b><span>02:00-02:30 p.m</span></p>
                    <p><b>Co-Pay: </b><span><i className="fa fa-usd" aria-hidden="true"></i> 00.00</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
    }
  }

export default DaySlot;
