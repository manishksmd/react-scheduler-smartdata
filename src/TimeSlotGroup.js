import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TimeSlot from './TimeSlot'
import date from './utils/dates.js'
import localizer from './localizer'
import { elementType, dateFormat } from './utils/propTypes'

export default class TimeSlotGroup extends Component {
  static propTypes = {
    dayWrapperComponent: elementType,
    timeslots: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    value: PropTypes.instanceOf(Date).isRequired,
    showLabels: PropTypes.bool,
    isNow: PropTypes.bool,
    slotPropGetter: PropTypes.func,
    timeGutterFormat: dateFormat,
    culture: PropTypes.string,
    resource: PropTypes.string,

    usersAvailability: PropTypes.array,
  }
  static defaultProps = {
    timeslots: 2,
    step: 30,
    isNow: false,
    showLabels: false
  }

  renderSlice(slotNumber, content, value) {
    const { dayWrapperComponent, showLabels, isNow, culture, slotPropGetter, resource, usersAvailability } = this.props;
    return (
      <TimeSlot
        key={slotNumber}
        slotPropGetter={slotPropGetter}
        dayWrapperComponent={dayWrapperComponent}
        showLabel={showLabels && !slotNumber}
        content={content}
        culture={culture}
        isNow={isNow}
        value={value}
        resource={resource}
      />
    )
  }

  renderSlices() {
    const ret = []
    const sliceLength = this.props.step
    let sliceValue = this.props.value
    for (let i = 0; i < this.props.timeslots; i++) {
      const content = localizer.format(sliceValue, this.props.timeGutterFormat, this.props.culture)
      ret.push(this.renderSlice(i, content, sliceValue))
      sliceValue = date.add(sliceValue, sliceLength, 'minutes')
    }
    return ret
  }
  render() {
    let { value, usersAvailability, resource } = this.props;

    // if (slotPropGetter)
    //     var { style: xStyle } = (slotPropGetter && slotPropGetter(date)) || {};
        // console.log('this.props time Slot Group ...', this.props)
    let slot_bg_color = '';

    if (usersAvailability && usersAvailability.length) {
      let slotDate = value;
      let isAvailable = false;
        for (let index = 0; index < usersAvailability.length; index++) {
          let dateObj = usersAvailability[index];
            let availableStartDateTime = new Date(dateObj.startDateTime);
            let availableEndDateTime = new Date(dateObj.endDateTime);
            let isAvailableDateTime = (availableStartDateTime <= slotDate && availableEndDateTime >= slotDate);
            let isResourceId = (resource ? (resource === dateObj.staffID) : true);
            if (isAvailableDateTime && isResourceId) {
              isAvailable = true;
              break;
            }
        }
      slot_bg_color = isAvailable ? 'available-slot-color' : '';

    }

    return (
      <div className={`rbc-timeslot-group ${slot_bg_color}`}>
        {this.renderSlices()}
      </div>
    )
  }
}
