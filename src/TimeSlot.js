import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cn from 'classnames'
import { elementType } from './utils/propTypes'


export default class TimeSlot extends Component {
  static propTypes = {
    dayWrapperComponent: elementType,
    value: PropTypes.instanceOf(Date).isRequired,
    isNow: PropTypes.bool,
    showLabel: PropTypes.bool,
    content: PropTypes.string,
    culture: PropTypes.string,
    resource: PropTypes.string,
    slotPropGetter: PropTypes.func,
    usersAvailability: PropTypes.object,
  }

  static defaultProps = {
    isNow: false,
    showLabel: false,
    content: ''
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
    const { value, slotPropGetter, resource, usersAvailability } = this.props;
    const Wrapper = this.props.dayWrapperComponent;
    const { className, style } = (slotPropGetter && slotPropGetter(value)) || {};

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
      <Wrapper value={value} resource={resource}>
        <div style={style}
            className={cn(
              'rbc-time-slot',
              className,
              this.props.showLabel && 'rbc-label',
              this.props.isNow && 'rbc-now',
              slot_bg_color,
            )}
          >
          {this.props.showLabel &&
            <span>{this.props.content}</span>
          }
        </div>
      </Wrapper>
    )
  }
}
