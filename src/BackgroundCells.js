import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import cn from 'classnames';

import dates from './utils/dates';
import { segStyle } from './utils/eventLevels';
import { notify } from './utils/helpers';
import { elementType } from './utils/propTypes';
import { dateCellSelection, slotWidth, getCellAtX, pointInBox } from './utils/selection';
import Selection, { getBoundsForNode, isEvent } from './Selection';

class BackgroundCells extends React.Component {

  static propTypes = {
    cellWrapperComponent: elementType,
    container: PropTypes.func,
    selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),

    onSelectSlot: PropTypes.func.isRequired,
    onSelectEnd: PropTypes.func,
    onSelectStart: PropTypes.func,

    usersAvailability: PropTypes.object,

    range: PropTypes.arrayOf(
      PropTypes.instanceOf(Date)
    ),
    rtl: PropTypes.bool,
    type: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      selecting: false
    };
  }

  componentDidMount(){
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

  isAvailableDateTime(availibilityArray, slotInfo, isDayAvailibility, isMonthView) {
    let isValidDateTime = false,
      tempArray = availibilityArray;

    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let SlotStartDate = new Date(slotInfo.start).toDateString(),
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
      if (isValidDay && (isMonthView)) {
        isValidDateTime = true;
        break;
      }
    }
    return isValidDateTime;
  }

  render(){
    let { range, cellWrapperComponent: Wrapper, usersAvailability } = this.props;
    let { selecting, startIdx, endIdx } = this.state;
    // console.log('this.props background cells...', this.props)
    return (
      <div className='rbc-row-bg'>
        {range.map((date, index) => {
          let selected =  selecting && index >= startIdx && index <= endIdx;
          let slot_bg_color = '';
          if (usersAvailability) {
            let isAvailable = false;
            let isUnavailable = false;
            let slotInfo = {
              'start': date,
              'end': date,
            }
              let availableArray = usersAvailability;
              if (availableArray.unavailable && availableArray.unavailable.length) {
                let isDayAvailibility = false,
                  isMonthView = true;
                isUnavailable = this.isAvailableDateTime(availableArray.unavailable, slotInfo, isDayAvailibility, isMonthView);
              }
        
              if (isUnavailable) {
                isAvailable = false;
              } else {
                if (availableArray.available && availableArray.available.length) {
                  let isDayAvailibility = false,
                    isMonthView = true;
                  isAvailable = this.isAvailableDateTime(availableArray.available, slotInfo, isDayAvailibility, isMonthView);
                }
        
                if (!isAvailable && availableArray.days && availableArray.days.length) {
                  let isDayAvailibility = true,
                    isMonthView = true;
                  isAvailable = this.isAvailableDateTime(availableArray.days, slotInfo, isDayAvailibility, isMonthView);
                }
        
              }
              slot_bg_color = isAvailable ? 'available-slot-color' : '';
            }
          return (
            <Wrapper
              key={index}
              value={date}
              range={range}
            >
              <div
                style={segStyle(1, range.length)}
                className={cn(
                  'rbc-day-bg',
                  selected && 'rbc-selected-cell',
                  dates.isToday(date) && 'rbc-today',
                  slot_bg_color,
                )}
              />
            </Wrapper>
          )
        })}
      </div>
    )
  }

  _selectable(){
    let node = findDOMNode(this);
    let selector = this._selector = new Selection(this.props.container)

    selector.on('selecting', box => {
      let { range, rtl } = this.props;

      let startIdx = -1;
      let endIdx = -1;

      if (!this.state.selecting) {
        notify(this.props.onSelectStart, [box]);
        this._initial = { x: box.x, y: box.y };
      }
      if (selector.isSelected(node)) {
        let nodeBox = getBoundsForNode(node);

        ({ startIdx, endIdx } = dateCellSelection(
            this._initial
          , nodeBox
          , box
          , range.length
          , rtl));
      }

      this.setState({
        selecting: true,
        startIdx, endIdx
      })
    })

    selector.on('mousedown', (box) => {
      if (this.props.selectable !== 'ignoreEvents') return

      return !isEvent(findDOMNode(this), box)
    })

    selector
      .on('click', point => {
        if (!isEvent(findDOMNode(this), point)) {
          let rowBox = getBoundsForNode(node)
          let { range, rtl } = this.props;

          if (pointInBox(rowBox, point)) {
            let width = slotWidth(getBoundsForNode(node),  range.length);
            let currentCell = getCellAtX(rowBox, point.x, width, rtl, range.length);

            this._selectSlot({
              startIdx: currentCell,
              endIdx: currentCell,
              action: 'click',
            })
          }
        }

        this._initial = {}
        this.setState({ selecting: false })
      })

    selector
      .on('select', () => {
        this._selectSlot({ ...this.state, action: 'select' })
        this._initial = {}
        this.setState({ selecting: false })
        notify(this.props.onSelectEnd, [this.state]);
      })
  }

  _teardownSelectable() {
    if (!this._selector) return
    this._selector.teardown();
    this._selector = null;
  }

  _selectSlot({ endIdx, startIdx, action }) {
    if (endIdx !== -1 && startIdx !== -1)
      this.props.onSelectSlot &&
        this.props.onSelectSlot({
          start: startIdx,
          end: endIdx,
          action
        })
  }
}

export default BackgroundCells;
