import config from '../../../config'
import React, { useEffect } from 'react'
import './ScopeToggle.scss'
import { useDispatch, useSelector } from 'react-redux'
import { CNav, CNavItem, CNavLink } from '@coreui/react-pro'
import {
  getEncounters,
  getPracticeProviders,
  getRoles,
} from 'src/features/encounters/encountersThunk'
import { switchScope } from 'src/features/encounters/encountersSlice'

/** This component displays a toggle for the current context (Admin or Provider)
 * @return JSX.Element a React component that shows a selectable Admin/Provider toggle
 */
const ScopeToggle = () => {
  const isAdmin = useSelector((state) => state.encounters.isAdmin)
  const currentSort = useSelector((state) => state.encounters.currentSort)
  const currentScope = useSelector((state) => state.encounters.currentScope)
  const currentSearch = useSelector((state) => state.encounters.currentSearch)
  const currentPageLimit = useSelector((state) => state.encounters.currentPageLimit)
  const currentFilters = useSelector((state) => state.encounters.currentFilters)
  const dispatch = useDispatch()

  /** This is a React useEffect hook that ensures the currently logged-in user has the proper permissions.
   * @returns function An anonymous method that returns whether a useEffect dispatch has been completed.
   */
  useEffect(() => {
    let isCancelled = false // flag to ensure the useEffect hook fires only once when getting API data

    if (!isCancelled) {
      dispatch(getRoles())
    }
    return () => {
      isCancelled = true
    }
  }, [dispatch])

  if (isAdmin) {
    return (
      <div className={`${config.prefix}-scope-toggle`}>
        <CNav variant="pills" role="tablist">
          <CNavItem role="presentation">
            <CNavLink
              active={currentScope === 'practice'}
              component="button"
              role="tab"
              aria-controls="admin-tab-pane"
              aria-selected={currentScope === 'practice'}
              onClick={async (selectedItem) => {
                if (currentScope !== 'practice') {
                  await dispatch(switchScope('practice'))
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
                      page: 1,
                      scope: 'practice',
                      body: reqBody,
                    }),
                  )
                }
              }}
            >
              Admin
            </CNavLink>
          </CNavItem>
          <CNavItem role="presentation">
            <CNavLink
              active={currentScope === 'provider'}
              component="button"
              role="tab"
              aria-controls="provider-tab-pane"
              aria-selected={currentScope === 'provider'}
              onClick={async (selectedItem) => {
                await dispatch(switchScope('provider'))
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
                    page: 1,
                    scope: 'provider',
                    body: reqBody,
                  }),
                )
              }}
            >
              Provider
            </CNavLink>
          </CNavItem>
        </CNav>
      </div>
    )
  }
}

export default ScopeToggle
