import config from '../../../config'
import './Pagination.scss'
import React, { useEffect } from 'react'
import { CSmartPagination } from '@coreui/react-pro'
import { setCurrentPage, setPageLimit } from 'src/features/encounters/encountersSlice'
import { getEncounters } from 'src/features/encounters/encountersThunk'
import { useDispatch, useSelector } from 'react-redux'

/** This component displays pagination to page through the different pages of results depending on the filters, search, and sort.
 * @return JSX.Element a React component allowing you to page through different pages of results.
 */
const Pagination = () => {
  const pagination = useSelector((state) => state.encounters.pagination)
  const currentPageLimit = useSelector((state) => state.encounters.currentPageLimit)
  const currentScope = useSelector((state) => state.encounters.currentScope)
  const currentFilters = useSelector((state) => state.encounters.currentFilters)
  const currentSort = useSelector((state) => state.encounters.currentSort)
  const currentSearch = useSelector((state) => state.encounters.currentSearch)
  const currentPage = useSelector((state) => state.encounters.currentPage)
  const dispatch = useDispatch()
  /** This is a React useEffect hook that gets filter options stored in the database
   * @returns function An anonymous method that returns whether a useEffect dispatch has been completed.
   */
  useEffect(() => {
    let isCancelled = false // flag to ensure the useEffect hook fires only once when getting API data

    if (!isCancelled) {
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

      dispatch(
        getEncounters({
          limit: currentPageLimit,
          page: currentPage,
          scope: currentScope,
          body: reqBody,
        }),
      )
    }
    return () => {
      isCancelled = true
    }
  }, [dispatch])
  // currentFilters, currentPage, currentPageLimit, currentScope, currentSearch, currentSort

  const getPagination = () => {
    if (pagination && pagination.page_count) {
      return pagination.page_count
    } else {
      return 1
    }
  }

  const handlePageLimitChange = (num) => {
    dispatch(setPageLimit(num))
    let val = num ? num : currentPageLimit
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

    dispatch(
      getEncounters({
        limit: val,
        page: 1,
        scope: currentScope,
        body: reqBody,
      }),
    )
  }

  return (
    <div className={`${config.prefix}-pagination`}>
      <div className={`pagination-container`}>
        <CSmartPagination
          activePage={currentPage}
          pages={getPagination()}
          onActivePageChange={async (page) => {
            await dispatch(setCurrentPage(page))
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
            console.log(`Dispatching with filters: ${JSON.stringify(reqBody)}`)
            await dispatch(
              getEncounters({
                limit: currentPageLimit,
                page: page,
                scope: currentScope,
                body: reqBody,
              }),
            )
          }}
        />
      </div>
      <div className={`${config.prefix}-page-count`}>
        &nbsp;of&nbsp;{pagination ? pagination.page_count : ''}
      </div>
      <div className={`${config.prefix}-page-limit`}>
        <span className={`show-text`}>Show:</span>
        <span
          className={`${currentPageLimit === 25 ? 'active' : ''}`}
          onClick={() => {
            handlePageLimitChange(25)
          }}
        >
          25
        </span>
        |
        <span
          className={`${currentPageLimit === 50 ? 'active' : ''}`}
          onClick={() => {
            handlePageLimitChange(50)
          }}
        >
          50
        </span>
        |
        <span
          className={`${currentPageLimit === 75 ? 'active' : ''}`}
          onClick={() => {
            handlePageLimitChange(75)
          }}
        >
          75
        </span>
        |
        <span
          className={`${currentPageLimit === 100 ? 'active' : ''}`}
          onClick={() => {
            handlePageLimitChange(100)
          }}
        >
          100
        </span>
      </div>
    </div>
  )
}

export default Pagination
