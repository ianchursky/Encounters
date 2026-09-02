import { createSlice } from '@reduxjs/toolkit'
import {
  bulkDownloadNotes,
  getEncounters,
  getFilterOptions,
  getPermissions,
  getPractices,
  getUserProviders,
  getPracticeProviders,
  getRoles,
} from './encountersThunk'
import { capitalizeFirstLetterInSentence } from 'src/views/pages/Encounters/components/Utilities/Helpers'
import moment from 'moment/moment'

const initialCurrentFiltersState = {
  encounter_statuses: [],
  note_statuses: [],
  facilities: [],
  providers: [],
  procedure_codes: [],
}

/** This handles the Redux aspects of creating a slice for the encounters page using Redux Toolkit. See: https://redux-toolkit.js.org/api/createslice
 * @param object - An object literal that has the keys name, initialState and reducers, etc.
 * @return object - Exports both the resulting actions and reducer objects on encountersSlice
 */
export const encountersSlice = createSlice({
  name: 'encounters',
  initialState: {
    isAdmin: false,
    isLoading: false,
    currentScope: 'provider', // can be either 'practice' or 'provider'
    currentProviders: [], // will be an array of provider ID's
    currentPage: 1, // used for pagination
    currentPageLimit: 50, // default value is 50... possible values: 25, 50, 75, 100
    permissions: [],
    encounter_statuses: [],
    note_statuses: [],
    facilities: [],
    userProviders: [],
    practiceProviders: [],
    procedure_codes: [],
    currentFilters: { ...initialCurrentFiltersState },
    currentSearch: '',
    currentSort: {
      service_date_from: -1,
    },
    currentSortKey: 'service_date_from',
    currentSortDirection: -1,
    currentSelectedItems: [],
    pagination: {},
    notification: { visible: false, type: '', title: '', message: '' },
    encounters: [],
  },
  reducers: {
    isLoading: (state, action) => {
      state.isLoading = action.payload
    },
    isAdmin: (state, action) => {
      state.isAdmin = action.payload
    },
    switchScope: (state, action) => {
      state.currentScope = action.payload
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setPageLimit: (state, action) => {
      state.currentPageLimit = action.payload
    },
    setCurrentFilter: (state, action) => {
      state.currentFilters[action.payload.key] = action.payload.value
    },
    setCurrentFilters: (state, action) => {
      state.currentFilters = action.payload
    },
    clearCurrentFilters: (state, action) => {
      state.currentFilters = { ...initialCurrentFiltersState }
    },
    setCurrentSearch: (state, action) => {
      state.currentSearch = action.payload
    },
    setCurrentSort: (state, action) => {
      state.currentSort = action.payload
    },
    setCurrentSortKey: (state, action) => {
      state.currentSortKey = action.payload
    },
    setCurrentSortDirection: (state, action) => {
      state.currentSortDirection = action.payload
    },
    setNotification: (state, action) => {
      state.notification = action.payload
    },
    log: (state, action) => console.log(action),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEncounters.pending, (state, action) => {
        state.encounters = []
        state.isLoading = true
      })
      .addCase(getEncounters.fulfilled, (state, action) => {
        state.encounters = action.payload.encounters
        state.pagination = action.payload.pagination
        state.isLoading = false
      })
      .addCase(getEncounters.rejected, (state, action) => {
        state.isLoading = false
      })
      .addCase(getFilterOptions.fulfilled, (state, action) => {
        state.encounter_statuses = action.payload.encounter_statuses
        state.note_statuses = action.payload.note_statuses
        state.facilities = action.payload.facilities
        state.procedure_codes = action.payload.procedure_codes
        state.practiceProviders = action.payload.providers
      })
      .addCase(getPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        // The admin/provider toggle is not rendered by default and only rendered if passing checks here
        let roles = action.payload
        // do any of the description keys in the roles array contain the values that make them an "Admin" anywhere? ("Practice Admin" or "Practice Owner")
        let hasRole = roles.some(
          (role) =>
            role.groupname.indexOf('Practice Admin') !== -1 ||
            role.groupname.indexOf('Practice Owner') !== -1,
        ) // TODO: is this secure? doesn't feel secure or the best way to do this. Might need to re think this one.
        if (hasRole) {
          state.isAdmin = true
        }
        state.currentScope = 'provider' // defaulting to provider tap
      })
      .addCase(getPractices.fulfilled, (state, action) => {
        let practices = action.payload
        let practiceList = []
        practices.forEach((item) => {
          practiceList.push(item.organization_name)
        })
        state.practices = practiceList
      })
      .addCase(bulkDownloadNotes.fulfilled, (state, action) => {
        let result = action.payload
        const blob = new Blob([result.data])
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `charts-${moment().format('YYYY-DD-MMTH-mm-ss')}-charts.zip`
        document.body.appendChild(link)
        link.click()
      })
  },
})
export const {
  isLoading,
  switchScope,
  setCurrentPage,
  setPageLimit,
  setCurrentFilter,
  clearCurrentFilters,
  setCurrentSearch,
  setCurrentSort,
  setCurrentSortKey,
  setCurrentSortDirection,
  setNotification,
  log,
} = encountersSlice.actions

export default encountersSlice.reducer
