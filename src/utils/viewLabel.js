import { views } from './constants'
import defaultFormats from '../formats'
import localizer from '../localizer'

import VIEWS from '../Views'

const Formats = {
  [views.MONTH]: 'monthHeaderFormat',
  [views.WEEK]: 'dayRangeHeaderFormat',
  [views.WORK_WEEK]: 'dayRangeHeaderFormat',
  [views.DAY]: 'dayHeaderFormat',
  [views.AGENDA]: 'agendaHeaderFormat',
  [views.RESOURCE]: 'dayHeaderFormat'
}

function getRangeBounds(range) {
  if (Array.isArray(range)) {
    let start = range[0]
    let end = range[range.length - 1]
    return { start, end }
  }
  return range;
}

export default function viewLabel(date, view, formats, culture) {
  let View = VIEWS[view]
  let headerSingle = view === views.MONTH || view === views.DAY || view === views.RESOURCE || view === views.STATUS

  formats = defaultFormats(formats || {})

  let headerFormat = formats[Formats[view]]

  return headerSingle
    ? localizer.format(date, headerFormat, culture)
    : localizer.format(
        getRangeBounds(View.range(date, { culture })),
        headerFormat,
        culture
      )
}
