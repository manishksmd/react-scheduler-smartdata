import PropTypes from 'prop-types'
import React from 'react'
import EventRowMixin from './EventRowMixin'

class EventRow extends React.Component {
  static propTypes = {
    segments: PropTypes.array,
    ...EventRowMixin.propTypes,
  }
  static defaultProps = {
    ...EventRowMixin.defaultProps,
  }
  render() {
    let { segments } = this.props

    let lastEnd = 1
    
    // if (segments.length < 7) {
    //   // segments.push({            
    //   //       'start': new Date(2017, 8, 4, 2, 30, 0, 0),
    //   //       'end': new Date(2017, 8, 4, 4, 30, 0, 0),
    //   //     });
    //   segments.map((obj) => {
    //     console.log(obj);
    //   });
    //   //console.log(segments)
    // }

    return (
      <div className="rbc-row">
        {segments.reduce((row, { event, left, right, span }, li) => {
          let key = '_lvl_' + li
          let gap = left - lastEnd

          let content = EventRowMixin.renderEvent(this.props, event)

          if (gap)
            row.push(EventRowMixin.renderSpan(this.props, gap, key + '_gap', left))

          row.push(EventRowMixin.renderSpan(this.props, span, key, content, left))

          lastEnd = right + 1

          return row
        }, [])}
      </div>
    )
  }
}

export default EventRow
