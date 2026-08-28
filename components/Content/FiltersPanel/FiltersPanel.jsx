import config from '../../../config'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getEncounters,
  getFacilities,
  getFilterOptions,
} from 'src/features/encounters/encountersThunk'
import './FiltersPanel.scss'
import {
  CButton,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilArrowThickRight, cilFilter } from '@coreui/icons-pro'
import CheckBoxGroup from './FilterTypes/CheckBoxGroup'
import DateRangePicker from './FilterTypes/DateRangePicker'
import { clearCurrentFilters } from '../../../../../../features/encounters/encountersSlice'

/**
 * Checks the current filters in redux to see if any filters have been selected in the filters panel
 * @param currentFilters
 * @return boolean whether or not filters have been chosen
 */
function checkIfFiltersAreBeingUsed(currentFilters) {
  return Object.values(currentFilters).some((filterArray) => filterArray?.length > 0)
}

/** This is the main filters panel. It'll have a number of different types of filters in it.
 * The actual panel is rendered outside the element that triggers it in the actual HTML. It is usually at the bottom just before the closing </body> tag
 * See: https://coreui.io/react/docs/components/offcanvas/ for more information
 * @return JSX.Element a React component that displays a filter icon and shows a panel of different types of filters when the icon is clicked.
 */
const FiltersPanel = () => {
  const [visible, setVisible] = useState(false)
  const currentPageLimit = useSelector((state) => state.encounters.currentPageLimit)
  const encounter_statuses = useSelector((state) => state.encounters.encounter_statuses)
  const note_statuses = useSelector((state) => state.encounters.note_statuses)
  const facilities = useSelector((state) => state.encounters.facilities)
  const practiceProviders = useSelector((state) => state.encounters.practiceProviders)
  const procedure_codes = useSelector((state) => state.encounters.procedure_codes)
  const currentFilters = useSelector((state) => state.encounters.currentFilters)
  const currentSort = useSelector((state) => state.encounters.currentSort)
  const currentScope = useSelector((state) => state.encounters.currentScope)
  const currentSearch = useSelector((state) => state.encounters.currentSearch)
  const dispatch = useDispatch()

  /** This is a React useEffect hook that gets filter options stored in the database
   * @returns function An anonymous method that returns whether a useEffect dispatch has been completed.
   */
  useEffect(() => {
    let isCancelled = false // flag to ensure the useEffect hook fires only once when getting API data

    if (!isCancelled) {
      dispatch(getFilterOptions(currentScope))
      dispatch(getFacilities())
    }
    return () => {
      isCancelled = true
    }
  }, [dispatch, currentScope])

  /** This method returns a React element for the filters panel that allows for selecting providers depending on if the user is an admin.
   * NOTE: The admin determination is made in the code in encountersSlice.js and encountersThunk.js
   * @returns JSX.Element for filtering based off of providers if the signed-in user is an admin. If not, (i.e., just a provider) an empty string is returned and the filter is not rendered.
   */
  const getProviderFilter = () => {
    if (currentScope === 'practice') {
      return (
        <CheckBoxGroup
          id={'provider_selection'}
          title={'Providers'}
          labelkey={'fullname'}
          filterkey={'providers'}
          options={practiceProviders}
          showSearch={true}
        />
      )
    } else {
      return null
    }
  }

  return (
    <div className={`${config.prefix}-filters-panel`}>
      <div className={`${config.prefix}-filters-icon`}>
        <CIcon icon={cilFilter} onClick={() => setVisible(true)} />
      </div>
      <COffcanvas
        className={`${config.prefix}-filters-panel-offcanvas`}
        placement="end"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <COffcanvasHeader>
          <div className={'title'}>
            <COffcanvasTitle>Filters</COffcanvasTitle>
          </div>
          <div className={'arrow'} onClick={() => setVisible(false)}>
            <CIcon icon={cilArrowThickRight} />
          </div>
          <div className={'filters-panel-buttons'}>
            {checkIfFiltersAreBeingUsed(currentFilters) && (
              <CButton
                color={'secondary'}
                onClick={() => {
                  dispatch(clearCurrentFilters())
                }}
              >
                Clear All
              </CButton>
            )}
            <CButton
              onClick={() => {
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
                setVisible(false)
              }}
            >
              Apply
            </CButton>
          </div>
        </COffcanvasHeader>
        <COffcanvasBody>
          <div className={'filters-panel-filters'}>
            <CheckBoxGroup
              id={'encounter_statuses'}
              title={'Encounter Statuses'}
              labelkey={'name'}
              filterkey={'encounter_statuses'}
              options={encounter_statuses}
              showSearch={false}
            />
            <CheckBoxGroup
              id={'note_statuses'}
              title={'Note Statuses'}
              labelkey={'name'}
              filterkey={'note_statuses'}
              options={note_statuses}
              showSearch={false}
            />
            <DateRangePicker
              id={'service_date_from'}
              title={'Date of Service'}
              filterkeyl={'service_date_from_lbound'}
              filterkeyu={'service_date_from_ubound'}
            />
            <DateRangePicker
              id={'posting_date'}
              title={'Posting Date'}
              filterkeyl={'posting_date_lbound'}
              filterkeyu={'posting_date_ubound'}
            />
            <CheckBoxGroup
              id={'facility_id'}
              title={'Facilities'}
              labelkey={'facility_name'}
              filterkey={'facilities'}
              options={facilities}
              showSearch={true}
            />
            {getProviderFilter()}
            <CheckBoxGroup
              id={'procedure_codes'}
              title={'Procedure Codes'}
              labelkey={'procedure_code'}
              filterkey={'procedure_codes'}
              options={procedure_codes}
              showSearch={true}
            />
          </div>
        </COffcanvasBody>
      </COffcanvas>
    </div>
  )
}

export default FiltersPanel
