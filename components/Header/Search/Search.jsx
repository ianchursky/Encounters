import React, { useState } from 'react'
import config from '../../../config'
import './Search.scss'
import { CFormInput } from '@coreui/react-pro'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentSearch } from 'src/features/encounters/encountersSlice'
import { getEncounters } from 'src/features/encounters/encountersThunk'
import CIcon from '@coreui/icons-react'
import { cidXCircle, cisSearch } from '@coreui/icons-pro'

/** This component displays a search box. Search is executed when the "Enter" key is pressed.
 * @return JSX.Element a React component that displays a search box.
 */
const Search = () => {
  let currentScope = useSelector((state) => state.encounters.currentScope)
  let currentFilters = useSelector((state) => state.encounters.currentFilters)
  let currentSort = useSelector((state) => state.encounters.currentSort)
  let currentPageLimit = useSelector((state) => state.encounters.currentPageLimit)
  const dispatch = useDispatch()
  const [currentTextValue, setCurrentTextValue] = useState('')

  const search = (val) => {
    dispatch(setCurrentSearch(val))
    let searchValue = val
    let reqBody = {
      filter: {
        ...currentFilters,
      },
      sort: {
        ...currentSort,
      },
    }
    if (searchValue !== '') {
      reqBody.search = { patient_name: searchValue }
    }
    dispatch(
      getEncounters({
        limit: currentPageLimit,
        page: 1,
        scope: currentScope,
        body: reqBody,
      }),
    )
  }

  return (
    <div className={`${config.prefix}-search`}>
      <CIcon
        className={`glass`}
        icon={cisSearch}
        onClick={() => {
          search(currentTextValue)
        }}
      />
      <CFormInput
        className={`${config.prefix}-search-box`}
        type="text"
        placeholder={`Search...`}
        value={currentTextValue}
        onChange={(e) => {
          setCurrentTextValue(e.currentTarget.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            search(currentTextValue)
          }
        }}
      />
      <span
        className={`refresh`}
        onClick={() => {
          search(currentTextValue)
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="icon icon-custom-size"
          height="20"
          role="img"
        >
          <path
            fill="var(--ci-primary-color, currentColor)"
            d="M410.168,133.046,381.21,104.088,464.017,104l-.034-32L328,72.144V208h32V128.132l27.541,27.541A152.5,152.5,0,0,1,279.972,416l.056,32a184.5,184.5,0,0,0,130.14-314.954Z"
            className="ci-primary"
          ></path>
          <path
            fill="var(--ci-primary-color, currentColor)"
            d="M232.028,104l-.056-32a184.5,184.5,0,0,0-130.14,314.954L130.878,416H48v32H184V312H152v79.868l-27.541-27.541A152.5,152.5,0,0,1,232.028,104Z"
            className="ci-primary"
          ></path>
        </svg>
      </span>
      <CIcon
        className={`clear${currentTextValue ? ' show' : ''}`}
        icon={cidXCircle}
        onClick={() => {
          setCurrentTextValue('')
          search('')
        }}
      />
    </div>
  )
}

export default Search
