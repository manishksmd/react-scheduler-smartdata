import React from 'react'
import events from '../events'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import resources from './../../stories/resourceEvents';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less';


const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate('prev');
  };

  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    toolbar.onNavigate('next');
  };

  const goToCurrent = () => {
    const now = new Date();
    toolbar.date.setMonth(now.getMonth());
    toolbar.date.setYear(now.getFullYear());
    toolbar.onNavigate('current');
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
    );
  };

  return (
    <div className={sCalendar['toolbar-container']}>
      <label className={sCalendar['label-date']}>{label()}</label>

      <div className={sCalendar['back-next-buttons']}>
        <button className={sCalendar['btn-back']} onClick={goToBack}>&#8249;</button>
        <button className={sCalendar['btn-current']} onClick={goToCurrent}>today</button>
        <button className={sCalendar['btn-next']} onClick={goToNext}>&#8250;</button>
      </div>
    </div >
  );
};


const DragAndDropCalendar = withDragAndDrop(BigCalendar);

class Dnd extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      events: events,
      usersAvailability: [
        {
          'staffID': 52,
          'dayID': 1,
          'isAvailable': true,
          'startDateTime': '2018-01-29T07:00:00',
          'endDateTime': '2018-01-29T18:00:00'
      },
      {
          'staffID': 52,
          'dayID': 1,
          'isAvailable': true,
          'startDateTime': '2018-02-05T07:00:00',
          'endDateTime': '2018-02-05T18:00:00'
      },
        {
            'staffID': 53,
            'dayID': 1,
            'isAvailable': true,
            'startDateTime': '2018-01-29T03:00:00',
            'endDateTime': '2018-01-29T22:00:00'
        },
        {
            'staffID': 53,
            'dayID': 1,
            'isAvailable': true,
            'startDateTime': '2018-02-05T03:00:00',
            'endDateTime': '2018-02-05T22:00:00'
        },
        {
            'staffID': 53,
            'dayID': 1,
            'isAvailable': true,
            'startDateTime': '2018-02-12T03:00:00',
            'endDateTime': '2018-02-12T22:00:00'
        },
        {
            'staffID': 53,
            'dayID': 1,
            'isAvailable': true,
            'startDateTime': '2018-02-19T03:00:00',
            'endDateTime': '2018-02-19T22:00:00'
        },
        {
            'staffID': 53,
            'dayID': 1,
            'isAvailable': true,
            'startDateTime': '2018-02-26T03:00:00',
            'endDateTime': '2018-02-26T22:00:00'
        },
        {
            'staffID': 53,
            'dayID': 2,
            'isAvailable': true,
            'startDateTime': '2018-01-30T03:00:00',
            'endDateTime': '2018-01-30T22:00:00'
        },
        {
            'staffID': 53,
            'dayID': 2,
            'isAvailable': true,
            'startDateTime': '2018-02-06T03:00:00',
            'endDateTime': '2018-02-06T22:00:00'
        },
        {
            'staffID': 53,
            'dayID': 2,
            'isAvailable': true,
            'startDateTime': '2018-02-13T03:00:00',
            'endDateTime': '2018-02-13T22:00:00'
        },
        {
            'staffID': 53,
            'dayID': 2,
            'isAvailable': true,
            'startDateTime': '2018-02-20T03:00:00',
            'endDateTime': '2018-02-20T22:00:00'
        },
        {
            'staffID': 53,
            'dayID': 2,
            'isAvailable': true,
            'startDateTime': '2018-02-27T03:00:00',
            'endDateTime': '2018-02-27T22:00:00'
        },
        {
            'staffID': 53,
            'dayID': 3,
            'isAvailable': true,
            'startDateTime': '2018-01-31T03:00:00',
            'endDateTime': '2018-01-31T23:00:00'
        },
        {
            'staffID': 53,
            'dayID': 3,
            'isAvailable': true,
            'startDateTime': '2018-02-07T03:00:00',
            'endDateTime': '2018-02-07T23:00:00'
        },
        {
            'staffID': 53,
            'dayID': 3,
            'isAvailable': true,
            'startDateTime': '2018-02-14T03:00:00',
            'endDateTime': '2018-02-14T23:00:00'
        },
        {
            'staffID': 53,
            'dayID': 3,
            'isAvailable': true,
            'startDateTime': '2018-02-21T03:00:00',
            'endDateTime': '2018-02-21T23:00:00'
        },
        {
            'staffID': 53,
            'dayID': 3,
            'isAvailable': true,
            'startDateTime': '2018-02-28T03:00:00',
            'endDateTime': '2018-02-28T23:00:00'
        }
    ],

    }

    this.moveEvent = this.moveEvent.bind(this)
  }

  moveEvent({ event, start, end }) {
    const { events } = this.state;

    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents
    })

    alert(`${event.title} was dropped onto ${event.start}`);
  }


  slotPropGetter(date) { // , start, end, isSelected
    // console.log('date.getDate()...', Object.prototype.toString.call(date))
    if ( Object.prototype.toString.call(date) === '[object Date]' ) {
    let style = {
      backgroundColor: '#ccc',
    };
    let style1 = {
      backgroundColor: '#fff',
    };
    if (date.getDate() === 7) {
      
      return {
        style: style,
      };
    } else { return {
      style: style1,
    } }
    }
  }


  render(){
    return (
      <DragAndDropCalendar
        selectable
        // events={this.state.events}
        events={resources.events}
        resources={resources.list}
        // slotProp={this.slotPropGetter(date)}
        // slotPropGetter={(date) => this.slotPropGetter(date) }
        usersAvailability = {this.state.usersAvailability}
        onEventDrop={this.moveEvent}
        defaultView='month'
        defaultDate={new Date(2018, 1, 14)}
        onSelectEvent={event => console.log(event)}
        onSelectSlot={(slotInfo) => alert(
            `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
            `\nend: ${slotInfo.end.toLocaleString()}`
          )}
      />
    )
  }
}

export default DragDropContext(HTML5Backend)(Dnd)
