import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import cn from 'classnames';

import Selection, { getBoundsForNode, isEvent } from './Selection';
import dates from './utils/dates';
import { isSelected } from './utils/selection';
import localizer from './localizer'

import { notify } from './utils/helpers';
import { accessor, elementType, dateFormat } from './utils/propTypes';
import { accessor as get } from './utils/accessors';
import Img from './img/doctor.png';
import getStyledEvents, { positionFromDate, startsBefore } from './utils/dayViewLayout'

import TimeColumn from './TimeColumn'
import AppointmentBox from './AppointmentBox';

function snapToSlot(date, step){
  var roundTo = 1000 * 60 * step;
  return new Date(Math.floor(date.getTime() / roundTo) * roundTo)
}

function startsAfter(date, max) {
  return dates.gt(dates.merge(max, date), max, 'minutes')
}

class DaySlot extends React.Component {

  constructor(props) {
    super(props);
    this.hoverDialogActions = this.hoverDialogActions.bind(this);
  }

  static propTypes = {
    events: PropTypes.array.isRequired,
    step: PropTypes.number.isRequired,
    min: PropTypes.instanceOf(Date).isRequired,
    max: PropTypes.instanceOf(Date).isRequired,
    now: PropTypes.instanceOf(Date),

    rtl: PropTypes.bool,
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


    allDayAccessor: accessor.isRequired,
    startAccessor: accessor.isRequired,
    endAccessor: accessor.isRequired,

    selectRangeFormat: dateFormat,
    eventTimeRangeFormat: dateFormat,
    culture: PropTypes.string,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
    eventOffset: PropTypes.number,

    onSelecting: PropTypes.func,
    onSelectSlot: PropTypes.func.isRequired,
    onSelectEvent: PropTypes.func.isRequired,

    className: PropTypes.string,
    dragThroughEvents: PropTypes.bool,
    eventPropGetter: PropTypes.func,
    dayWrapperComponent: elementType,
    eventComponent: elementType,
    eventWrapperComponent: elementType.isRequired,
    resource: PropTypes.string,
  };

  static defaultProps = { dragThroughEvents: true };
  state = { selecting: false };

  componentDidMount() {
    this.props.selectable
    && this._selectable()
  }

  componentWillUnmount() {
    this._teardownSelectable();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectable && !this.props.selectable)
      this._selectable();
    if (!nextProps.selectable && this.props.selectable)
      this._teardownSelectable();
  }

  render() {
    const {
      min,
      max,
      step,
      now,
      selectRangeFormat,
      culture,
      ...props
    } = this.props

    this._totalMin = dates.diff(min, max, 'minutes')

    let { selecting, startSlot, endSlot } = this.state
    let style = this._slotStyle(startSlot, endSlot)

    let selectDates = {
      start: this.state.startDate,
      end: this.state.endDate
    };

    let lastNodeOfWeek = document.getElementsByClassName('rbc-day-slot');
    let len = lastNodeOfWeek.length;

    // @Week add class to last column - for sat
    let lastelement = len < 1 ? '' : lastNodeOfWeek[len-1];
    if(lastelement.classList !== undefined) {
      lastelement.classList.add('custom-class-sat')
    }

    // @Week add class to last column - for friday
    let secondLastElement = len < 2 ? '' : lastNodeOfWeek[len-2];
    if(secondLastElement.classList !== undefined) {
      secondLastElement.classList.add('custom-class-sat')
    }

    return (
      <TimeColumn
        {...props}
        className={cn(
          'rbc-day-slot',
          dates.isToday(max) && 'rbc-today'
        )}
        now={now}
        min={min}
        max={max}
        step={step}
      >
        {this.renderEvents()}

        {selecting &&
          <div className='rbc-slot-selection' style={style}>
              <span>
              { localizer.format(selectDates, selectRangeFormat, culture) }
              </span>
          </div>
        }
      </TimeColumn>
    );
  }

  renderEvents = () => {
    let {
        events
      , min
      , max
      , culture
      , eventPropGetter
      , selected, eventTimeRangeFormat, eventComponent
      , eventWrapperComponent: EventWrapper
      , rtl: isRtl
      , step
      , startAccessor
      , endAccessor
      , titleAccessor
      , isRecurrenceAccessor
      , isAppointmentRenderedAccessor
      , isVideoCallAccessor
      , isAppoinmentCancelledAccessor } = this.props;


    let EventComponent = eventComponent

    let styledEvents = getStyledEvents({
      events, startAccessor, endAccessor, min, totalMin: this._totalMin, step
    })

    return styledEvents.map(({ event, style }, idx) => {
      let start = get(event, startAccessor)
      let end = get(event, endAccessor)

      let continuesPrior = startsBefore(start, min)
      let continuesAfter = startsAfter(end, max)

      let title = get(event, titleAccessor)

      // @Appointment associate appointment data with the fields
      , isRecurrence = get(event, isRecurrenceAccessor)
      let isAppointmentRendered = get(event, isAppointmentRenderedAccessor);
      let isVideoCall = get(event, isVideoCallAccessor);
      let isAppoinmentCancelled = get(event, isAppoinmentCancelledAccessor);

      let label = localizer.format({ start, end }, eventTimeRangeFormat, culture)
      let _isSelected = isSelected(event, selected)
      let viewClass = '';
      let getEndHour = end.getHours();
      let maxEndHourForHoverup = max.getHours();

      if (getEndHour > (maxEndHourForHoverup - 6)) {
        viewClass = this.props.view === 'week' ? 'appointment_box dayslot hoverup' : 'appointment_box hoverup';
      } else {
        viewClass = this.props.view === 'week' ? 'appointment_box dayslot' : 'appointment_box';
      }

      let dayClass = this.props.view === 'day' ? 'colwrap' : '';

      if (eventPropGetter)
        var { style: xStyle, className } = eventPropGetter(event, start, end, _isSelected)

      let { height, top, width, xOffset } = style

      return (
        <EventWrapper event={event} key={'evt_' + idx}>
          <div
            style={{
              ...xStyle,
              top: `${top}%`,
              height: `${height}%`,
              [isRtl ? 'right' : 'left']: `${Math.max(0, xOffset)}%`,
              width: `${width}%`
            }}
            // title={label + ': ' + title }
            //onClick={(e) => this._select(event, e)}
            className={cn(`rbc-event ${dayClass}`, className, {
              'rbc-selected': _isSelected,
              'rbc-event-continues-earlier': continuesPrior,
              'rbc-event-continues-later': continuesAfter
            })}
          >
                      {/* <div className="rbc-event-label">{label}</div> */}

            <div className='rbc-event-label rbc-event-content textoverflow'>
              {isRecurrence ? <i className="fa fa-repeat pr5" aria-hidden="true"></i> : ''}
              {isAppointmentRendered ? <i className="fa fa-check-circle-o pr5" aria-hidden="true"></i> : ''}
              {isVideoCall ? <i className="fa fa-video-camera pr5" aria-hidden="true"></i> : ''}
              {isAppoinmentCancelled ? <i className="fa fa-ban pr5" aria-hidden="true"></i> : ''}
              { EventComponent
                ? <EventComponent event={event} />
                : title
              } {label}
            </div>
            <AppointmentBox
              {...this.props}
              event={event}
              popupClassName={viewClass}
              hoverDialogActions={this.hoverDialogActions}
            />
            </div>
        </EventWrapper>
      )
    })
  };

  _slotStyle = (startSlot, endSlot) => {
    let top = ((startSlot / this._totalMin) * 100);
    let bottom = ((endSlot / this._totalMin) * 100);

    return {
      top: top + '%',
      height: bottom - top + '%'
    }
  };

  _selectable = () => {
    let node = findDOMNode(this);
    let selector = this._selector = new Selection(()=> findDOMNode(this))

    let maybeSelect = (box) => {
      let onSelecting = this.props.onSelecting
      let current = this.state || {};
      let state = selectionState(box);
      let { startDate: start, endDate: end } = state;

      if (onSelecting) {
        if (
          (dates.eq(current.startDate, start, 'minutes') &&
          dates.eq(current.endDate, end, 'minutes')) ||
          onSelecting({ start, end }) === false
        )
          return
      }

      this.setState(state)
    }

    let selectionState = ({ y }) => {
      let { step, min, max } = this.props;
      let { top, bottom } = getBoundsForNode(node)

      let mins = this._totalMin;

      let range = Math.abs(top - bottom)

      let current = (y - top) / range;

      current = snapToSlot(minToDate(mins * current, min), step)

      if (!this.state.selecting)
        this._initialDateSlot = current

      let initial = this._initialDateSlot;

      if (dates.eq(initial, current, 'minutes'))
        current = dates.add(current, step, 'minutes')

      let start = dates.max(min, dates.min(initial, current))
      let end = dates.min(max, dates.max(initial, current))

      return {
        selecting: true,
        startDate: start,
        endDate: end,
        startSlot: positionFromDate(start, min, this._totalMin),
        endSlot: positionFromDate(end, min, this._totalMin)
      }
    }

    selector.on('selecting', maybeSelect)
    selector.on('selectStart', maybeSelect)

    selector.on('mousedown', (box) => {
      if (this.props.selectable !== 'ignoreEvents') return

      return !isEvent(findDOMNode(this), box)
    })

    selector
      .on('click', (box) => {
        if (!isEvent(findDOMNode(this), box))
          this._selectSlot({ ...selectionState(box), action: 'click' })

        this.setState({ selecting: false })
      })

    selector
      .on('select', () => {
        if (this.state.selecting) {
          this._selectSlot({ ...this.state, action: 'select' })
          this.setState({ selecting: false })
        }
      })
  };

  _teardownSelectable = () => {
    if (!this._selector) return
    this._selector.teardown();
    this._selector = null;
  };

  _selectSlot = ({ startDate, endDate, action }) => {
    let current = startDate
      , slots = [];

    while (dates.lte(current, endDate)) {
      slots.push(current)
      current = dates.add(current, this.props.step, 'minutes')
    }

    notify(this.props.onSelectSlot, {
      slots,
      start: startDate,
      end: endDate,
      resourceId: this.props.resource,
      action
    })
  };

  _select = (...args) => {
    notify(this.props.onSelectEvent, args)
  };

  hoverDialogActions(event, e, action) {
    e.preventDefault();
    event.action = action;
    this._select(event, e);
  }
}



function minToDate(min, date){
  var dt = new Date(date)
    , totalMins = dates.diff(dates.startOf(date, 'day'), date, 'minutes');

  dt = dates.hours(dt, 0);
  dt = dates.minutes(dt, totalMins + min);
  dt = dates.seconds(dt, 0)
  return dates.milliseconds(dt, 0)
}

export default DaySlot;
