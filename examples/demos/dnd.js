import React from 'react'
import events from '../events'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
// import BigCalendar from 'react-big-calendar'
import BigCalendar from '../../src/index'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import resources from './../../stories/resourceEvents';
// import '../../lib/addons/dragAndDrop/styles.less';


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
      events: resources.events,
      usersAvailability: {
        'staffID': 0,
        'days': [
            {
                'id': 715,
                'dayId': 2,
                'dayName': 'Monday',
                'startTime': '2018-03-05T12:00:39',
                'endTime': '2018-03-05T21:00:44',
                'staffAvailabilityTypeID': 73,
                'staffID': 115,
                'isActive': false,
                'isDeleted': false
            },
            {
                'id': 716,
                'dayId': 4,
                'dayName': 'Wednesday',
                'startTime': '2018-03-05T09:30:18',
                'endTime': '2018-03-05T12:00:25',
                'staffAvailabilityTypeID': 73,
                'staffID': 115,
                'isActive': false,
                'isDeleted': false
            }
        ],
        'available': [],
        'unavailable': [
            {
                'id': 714,
                'startTime': '2018-03-05T15:00:01',
                'endTime': '2018-03-05T17:30:10',
                'date': '2018-03-26T00:00:00',
                'staffAvailabilityTypeID': 75,
                'staffID': 115,
                'isActive': false,
                'isDeleted': false
            }
        ]
    },

    }

    this.moveEvent = this.moveEvent.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);
  }

  moveEvent({ event, start, end, ...rest }) {
    const { events } = this.state;

    const idx = events.indexOf(event);
    const resourceId = rest.resource || event.resourceId;
    const updatedEvent = { ...event, start, end, resourceId };

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

  resizeEvent = (resizeType, { event, start, end }) => {
    const { events } = this.state

    // const nextEvents = events.map(existingEvent => {
    //   return existingEvent.id == event.id
    //     ? { ...existingEvent, start, end }
    //     : existingEvent
    // })

    const idx = events.indexOf(event);
    // const resourceId = rest.resource || event.resourceId;
    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })

    alert(`${event.title} was resized to ${start}-${end}`)
  }

  render(){
    return (
      <DragAndDropCalendar
        selectable
        events={this.state.events}
        // events={resources.events}
        resources={resources.list}
        statusHeadings={[{id:1, title: 'connected'}, {id:2, title: 'Confirmed'}]}
        // slotProp={this.slotPropGetter(date)}
        // slotPropGetter={(date) => this.slotPropGetter(date) }
        usersAvailability = {this.state.usersAvailability}
        resizable
        onEventResize={this.resizeEvent}
        onEventDrop={this.moveEvent}
        defaultView='month'
        draggableAccessor= 'isDragable'
   resizableAccessor= 'isDragable'
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
// export default Dnd
