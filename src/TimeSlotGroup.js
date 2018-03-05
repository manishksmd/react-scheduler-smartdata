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

    usersAvailability: PropTypes.object,
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


  isAvailableDateTime(availibilityArray, slotInfo, isDayAvailibility, resource) {
    let isValidDateTime = false,
      tempArray = availibilityArray;
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let SlotStartDate = new Date(slotInfo.start).toDateString(),
    nowDate = new Date(),
    year = nowDate.getFullYear(), month = nowDate.getMonth(), date = nowDate.getDate(),
    slotStart = new Date(slotInfo.start),
    slotStartTime = new Date(year, month, date, slotStart.getHours(), slotStart.getMinutes()),
    SlotDayName = days[new Date(slotInfo.start).getDay()];

    for (let index = 0;index < tempArray.length;index++) {
      let isValidDay = false;
      if (isDayAvailibility) {
        let availableDayName = tempArray[index].dayName || '';
        isValidDay = (SlotDayName.toLowerCase() === availableDayName.toLowerCase());
      } else {
        let availableDate = new Date(tempArray[index].date).toDateString();
        isValidDay = availableDate === SlotStartDate;
      }
      let availStartTime = new Date(tempArray[index].startTime),
        avialEndTime = new Date(tempArray[index].endTime),
        startTime = new Date(year, month, date, availStartTime.getHours(), availStartTime.getMinutes()),
        endTime = new Date(year, month, date, avialEndTime.getHours(), avialEndTime.getMinutes());

      let isResourceId = (resource ? (resource === (tempArray[index].staffID) || '') : true);
      let isValidTime = (startTime <= slotStartTime && endTime > slotStartTime);
    if (isResourceId && isValidDay && isValidTime) {
        isValidDateTime = true;
        break;
      }
    }
    return isValidDateTime;
  }

  render() {
    let { value, usersAvailability, resource } = this.props;

    // if (slotPropGetter)
    //     var { style: xStyle } = (slotPropGetter && slotPropGetter(date)) || {};
        // console.log('this.props time Slot Group ...', this.props)
    let slot_bg_color = '';
    if (usersAvailability) {
      let isAvailable = false;
      let isUnavailable = false;
      let slotInfo = {
        'start': value,
      }
        let availableArray = usersAvailability;
        if (availableArray.unavailable && availableArray.unavailable.length) {
          let isDayAvailibility = false;
          isUnavailable = this.isAvailableDateTime(availableArray.unavailable, slotInfo, isDayAvailibility, resource);
        }
        if (isUnavailable) {
          isAvailable = false;
        } else {
          if (availableArray.available && availableArray.available.length) {
            let isDayAvailibility = false;
            isAvailable = this.isAvailableDateTime(availableArray.available, slotInfo, isDayAvailibility, resource);
          }
          if (!isAvailable && availableArray.days && availableArray.days.length) {
            let isDayAvailibility = true;
            isAvailable = this.isAvailableDateTime(availableArray.days, slotInfo, isDayAvailibility, resource);
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
