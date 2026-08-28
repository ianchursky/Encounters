import config from '../../../config'
import './StatusCheckboxes.scss'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setAllStatusCheckbox,
  setCurrentFilter,
  setStatusCheckboxes,
} from 'src/features/encounters/encountersSlice'
import { CFormCheck } from '@coreui/react-pro'
import { getEncounters, getStatusGroupCounts } from 'src/features/encounters/encountersThunk'

/** The status checkboxes are essentially the checkboxes across the top off the main content show 4 different components representing "All," "In Progress," "Completed," "Provider Hold," and "Void," based off of status.
 * @return JSX.Element a React component that shows a collection of checkboxes of filters
 */
const StatusCheckboxes = () => {
  const [isCheckAll, setIsCheckAll] = useState(true)
  const [isCheck, setIsCheck] = useState(['in-progress', 'completed', 'provider-hold', 'void'])
  const [options, setOptions] = useState([
    { _id: 'in-progress', label: 'In Progress' },
    { _id: 'completed', label: 'Completed' },
    { _id: 'provider-hold', label: 'Provider Hold' },
    { _id: 'void', label: 'Void' },
  ])
  const pagination = useSelector((state) => state.encounters.pagination)
  const currentPageLimit = useSelector((state) => state.encounters.currentPageLimit)
  const currentFilters = useSelector((state) => state.encounters.currentFilters)
  const currentSort = useSelector((state) => state.encounters.currentSort)
  const currentSearch = useSelector((state) => state.encounters.currentSearch)
  const currentScope = useSelector((state) => state.encounters.currentScope)
  const statusInProgressCount = useSelector((state) => state.encounters.statusInProgressCount)
  const statusCompletedCount = useSelector((state) => state.encounters.statusCompletedCount)
  const statusProviderHoldCount = useSelector((state) => state.encounters.statusProviderHoldCount)
  const statusVoidCount = useSelector((state) => state.encounters.statusVoidCount)
  const dispatch = useDispatch()

  /** This is a React useEffect hook that gets the different status group counts
   * @returns function An anonymous method that returns whether a useEffect dispatch has been completed.
   */
  useEffect(() => {
    let isCancelled = false // flag to ensure the useEffect hook fires only once when getting API data

    if (!isCancelled) {
      dispatch(
        getStatusGroupCounts({
          scope: currentScope,
        }),
      )
    }
    return () => {
      isCancelled = true
    }
  }, [])

  /** Get the encounters based on the current filters, search, and sort settings. */
  const fetchEncounters = () => {
    let reqBody = {
      filter: {
        ...currentFilters,
      },
      sort: {
        ...currentSort,
      },
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

  /** Renders a &lt;CFormCheck /&gt; component See: https://coreui.io/react/docs/forms/checkbox.
   * @param object - an object literal with the property keys { id, title, label, name, handleClick, isChecked }.
   * @returns JSX.Element - a React element that is a &lt;CFormCheck /&gt; component
   * */
  const CheckboxComponent = ({ id, title, label, name, handleClick, isChecked }) => {
    if (id) {
      id = id.toString() // Fix for a warning message in the console because some id values can be numbers and it was complaining that the component was expecting a string.
    }
    return (
      <CFormCheck
        id={id}
        title={title}
        label={label}
        name={name}
        onChange={handleClick}
        checked={isChecked}
      />
    )
  }

  /** Display the number of encounters in different status categories */
  const getStatusGroupCount = (id) => {
    // eslint-disable-next-line default-case
    switch (id) {
      case 'in-progress':
        return statusInProgressCount.toLocaleString('en-US')
      case 'completed':
        return statusCompletedCount.toLocaleString('en-US')
      case 'provider-hold':
        return statusProviderHoldCount.toLocaleString('en-US')
      case 'void':
        return statusVoidCount.toLocaleString('en-US')
    }
  }

  const handleSelectAll = async (e) => {
    let val = !isCheckAll
    setIsCheckAll(val)
    dispatch(setAllStatusCheckbox(val))
    setIsCheck(options.map((item) => item._id))
    if (isCheckAll) {
      setIsCheck([])
    }
    await dispatch(setCurrentFilter({ key: 'encounter_statuses', value: isCheck })) // dispatch event here when checkbox grouping changes
    fetchEncounters()
  }

  const handleClick = async (e) => {
    const { id, checked } = e.target
    setIsCheck([...isCheck, id])
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id))
    }
    await dispatch(setStatusCheckboxes(isCheck))
    await dispatch(setCurrentFilter({ key: 'encounter_statuses', value: isCheck })) // dispatch event here when checkbox grouping changes
    fetchEncounters()
  }

  return (
    <div className={`${config.prefix}-status-checkboxes`}>
      <div className={'checkbox-item'}>
        <CheckboxComponent
          name="selectAll"
          id="selectAll"
          title="All"
          label="All"
          handleClick={handleSelectAll}
          isChecked={isCheckAll}
        />
        &nbsp;
        {pagination && pagination.record_count
          ? `(${pagination.record_count.toLocaleString(`en-US`)})`
          : ''}
      </div>
      {options.map((item, index) => {
        return (
          <div className={'checkbox-item'} key={item._id}>
            <CheckboxComponent
              id={item._id}
              type="checkbox"
              name={item._id}
              label={item.label}
              title={item._id}
              handleClick={handleClick}
              isChecked={isCheck.includes(item._id)}
            />
            &nbsp;({getStatusGroupCount(item._id)})
          </div>
        )
      })}
    </div>
  )
}

export default StatusCheckboxes
