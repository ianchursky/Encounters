import React, { useEffect, useState } from 'react'
import config from '../../../../config'
import './ColumnHeader.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getEncounters } from 'src/features/encounters/encountersThunk'
import {
  setCurrentSort,
  setCurrentSortKey,
  setCurrentSortDirection,
} from 'src/features/encounters/encountersSlice'

/** This component builds the column headers for each of the headers in the table.
 * If sort is set to true there will be an arrow toggle that will change the sort direction when clicked.
 * @param props an object literal that consists of 6 keys/properties:\
 * \
 * &#8227; **title** - a header for the checkbox group category that will serve as a "Title" of sorts above the particular checkbox group.\
 * \
 * &#8227; **sort** - true/false? - setting to determine if the column can be sorted on.\
 * \
 * &#8227; **sortKey** - the "key" to sort the response on.
 * Possible sort keys... patient_name, service_date_from, admission_date, status_group, rendering_provider_name, or facility_name.\
 * &nbsp;
 * @return JSX.Element a React element that will show an icon based off of the current sorting direction if any and will handle setting the sorting direction in Redux.
 */
const ColumnHeader = (props) => {
  const currentFilters = useSelector((state) => state.encounters.currentFilters)
  const currentScope = useSelector((state) => state.encounters.currentScope)
  const currentSort = useSelector((state) => state.encounters.currentSort)
  const currentSortKey = useSelector((state) => state.encounters.currentSortKey)
  const currentSortDirection = useSelector((state) => state.encounters.currentSortDirection)
  const currentSearch = useSelector((state) => state.encounters.currentSearch)
  const currentPageLimit = useSelector((state) => state.encounters.currentPageLimit)
  const [sortDirection, setSortDirection] = useState(-1)
  const dispatch = useDispatch()

  /** This is a React useEffect hook that monitors the current sort key and direction.
   * @returns function An anonymous method that returns whether a useEffect has been completed.
   */
  useEffect(() => {
    //console.log(currentSort)
  }, [currentSort])

  /** Get the encounters based on the current filters, search, and sort settings. */
  const fetchEncounters = async (direction) => {
    let obj = {}
    obj[props.sortKey] = direction
    await dispatch(setCurrentSort(obj))
    let reqBody = {
      filter: {
        ...currentFilters,
      },
      sort: obj,
    }
    if (currentSearch !== '') {
      reqBody.search = { patient_name: currentSearch }
    }
    console.log(`Dispatching ${JSON.stringify(reqBody)}`)
    dispatch(
      getEncounters({
        limit: currentPageLimit,
        page: 1,
        scope: currentScope,
        body: reqBody,
      }),
    )
  }

  /** Swap the direction of the sort column. */
  const toggleDirection = () => {
    if (props.sort) {
      dispatch(setCurrentSortKey(props.sortKey))
      if (sortDirection === 1) {
        setSortDirection(-1)
        dispatch(setCurrentSortDirection(-1))
        fetchEncounters(-1)
      } else if (sortDirection === -1) {
        setSortDirection(1)
        dispatch(setCurrentSortDirection(1))
        fetchEncounters(1)
      } else {
      }
    }
  }

  /** Return the icon based off of the current sort key and direction. */
  const getIcon = () => {
    if (currentSortDirection === 1 && props.sortKey === currentSortKey) {
      return <span className={`up`}>&#8593;</span>
    } else if (currentSortDirection === -1 && props.sortKey === currentSortKey) {
      return <span className={`down`}>&#8595;</span>
    } else if (props.sort) {
      return <span className={`swap`}>&#8597;</span>
    } else {
      return ''
    }
  }

  return (
    <div className={`${config.prefix}-column-header`}>
      <div className={`title`} onClick={toggleDirection}>
        {props.title}
      </div>
      <div className={`sort`} onClick={toggleDirection}>
        {getIcon()}
      </div>
    </div>
  )
}

export default ColumnHeader
