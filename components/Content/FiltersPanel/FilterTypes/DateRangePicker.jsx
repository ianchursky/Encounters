import { createClassStringFromTitle } from '../../../Utilities/Helpers'
import config from '../../../../config'
import { CDateRangePicker } from '@coreui/react-pro'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentFilter } from 'src/features/encounters/encountersSlice'

/** This will render a date picker control where you can set a range of dates. See: https://coreui.io/react/docs/forms/date-range-picker/
 * @param props an object literal that consists of 2 object properties (i.e. { title: '', data: {} })\
 * \
 * &#8227; **id** - an id that will be rendered as the id property of the element\
 * \
 * &#8227; **title** - a header for the checkbox group category that will serve as a "Title" of sorts above the particular group\
 * \
 * &#8227; **filterkeyl** - a Date object that will serve as the lower bound date (i.e., start date) for the date range.\
 * \
 * &#8227; **filterkeyu** - a Date object that will serve as the upper bound date (i.e., end date) for the date range.\
 * &nbsp;
 * @return JSX.Element - a React component with 2 calendar controls to set a particular date range.
 */
const DateRangePicker = ({ title }) => {
  let newTitle = title || ''
  let dispatch = useDispatch()
  const { service_date_from_lbound, service_date_from_ubound } = useSelector(
    (state) => state.encounters.currentFilters,
  )

  // ref lets us hack-click the clear date range button
  const calendarRef = useRef()

  useEffect(() => {
    // TODO - end date selection only does not clear properly
    if (!service_date_from_lbound && !service_date_from_ubound) {
      // all filters were cleared, manually change date picker values
      calendarRef?.current?.querySelector('.picker-input-group-cleaner')?.click()
    }
  }, [service_date_from_lbound, service_date_from_ubound])

  return (
    <div
      className={`filters-panel-date-range-picker ${createClassStringFromTitle(
        newTitle,
      )}-filters-panel-date-range-picker`} // <-- I don't naturally write things all ugly like this. This is based on the prettier rules set and the compiler complaining.
    >
      <div className={'filters-panel-filter-item-header filters-panel-date-range-picker-header'}>
        <div className={'filters-panel-filter-item-title filters-panel-date-range-picker-title'}>
          {newTitle}
        </div>
      </div>
      <div
        className={`filters-panel-filter-item-body ${config.prefix}-filters-panel-date-range-picker`}
      >
        <CDateRangePicker
          ref={calendarRef}
          startDate={service_date_from_lbound}
          onStartDateChange={(date) => {
            if (date) {
              dispatch(
                setCurrentFilter({ key: 'service_date_from_lbound', value: date.toISOString() }),
              )
            }
          }}
          endDate={service_date_from_ubound}
          onEndDateChange={(date) => {
            if (date) {
              dispatch(
                setCurrentFilter({ key: 'service_date_from_ubound', value: date.toISOString() }),
              )
            }
          }}
          locale="en-US"
        />
      </div>
    </div>
  )
}

export default DateRangePicker
