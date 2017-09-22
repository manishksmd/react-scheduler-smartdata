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
      events: events
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

  render(){
    return (
      <DragAndDropCalendar
        selectable
        // events={this.state.events}
        events={resources.events}
        resources={resources.list}
        onEventDrop={this.moveEvent}
        defaultView='month'
        defaultDate={new Date(2017, 8, 1)}
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
