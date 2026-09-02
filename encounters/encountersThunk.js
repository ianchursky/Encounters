import { createAsyncThunk } from '@reduxjs/toolkit'
import { COLLECTOR_URL, SETTINGS_URL, setupInterceptorsTo } from 'src/apiHelper/helper.ts'
import axios from 'axios'

const collectorApi = setupInterceptorsTo(
  axios.create({
    baseURL: COLLECTOR_URL,
  }),
)

const settingsApi = setupInterceptorsTo(
  axios.create({
    baseURL: SETTINGS_URL,
  }),
)

/** Small helper method that handles any particular cases of errors fetching data from the API */
const handleError = (err) => {
  if (err.name === 'AxiosError' && err.response) {
    // Authorization has expired return to home screen for re-login
    console.error(err)
  }
}

/** This thunk returns an encounters table based on the logged in user and or a number of filters
 * @param reqData - An object literal that will have the property keys "limit" and "page." The values will be plugged into the final url string
 * @return object - Returns the response object from the API request
 */
export const getEncounters = createAsyncThunk('/encounters/list', async (reqData) => {
  try {
    let url = `${COLLECTOR_URL}encounters/list?limit=${reqData.limit}&page=${reqData.page}&scope=${reqData.scope}`

    if (reqData?.body?.filter) {
      /** Example object sent through filters in the request body (reqData.body)
       {
         "filter": {
           "encounter_statuses": ["in-progress", "completed"],
           "note_statuses": ["no-note", "draft"],
           "facilities": ["5c3cc0df1dd30f5286995eb8", "5c3cc0d71dd30f5286995d3f"],
           "providers": ["5c3cc0071dd30f5286992455", "5c3cc00e1dd30f52869926f7"],
           "procedure_codes": ["99309", "99306"],
           "service_date_from_ubound": "2023-10-30",
           "service_date_from_lbound": "2022-10-30"
        },
       "sort": {
          "service_date_from": -1
        }
       }
       */

      for (let key in reqData.body.filter) {
        if (Array.isArray(reqData.body.filter[key]) && !reqData.body.filter[key].length) {
          //if the body data we are sending has empty arrays, then remove that key from reqData.body.filter
          delete reqData.body.filter[key]
        }
      }
    }

    let result = await collectorApi.post(url, reqData.body)

    if (result?.status === 500) {
      return 'Server Error'
    } else {
      if (result?.status === 200) {
        return result.data
      }
    }
  } catch (err) {
    console.error('Encounters Page: Error getting encounters data: ', err)
    handleError(err)
    return false
  }
})

/** This thunk returns a list of filters stored in the database
 * @return object - Returns the response object from the API request
 */
export const getFilterOptions = createAsyncThunk('/encounters/filter/options', async (scope) => {
  try {
    let url = `${COLLECTOR_URL}encounters/filter/options`
    if (scope) {
      url += '?scope=' + scope
    }
    let result = await collectorApi.get(url)

    if (result?.status === 500) {
      return 'Server Error'
    } else {
      if (result?.status === 200) {
        return result.data.filter_options
      }
    }
  } catch (err) {
    console.error('Encounters Page: Error getting filters data: ', err)
    handleError(err)
    return false
  }
})

/** This thunk returns a list of the status counts of all the different status group counts: In Progress,
 * @param reqData - An object literal
 * @return object - Returns the response object from the API request
 */
export const getStatusGroupCounts = createAsyncThunk(
  '/encounters/list/status_group/count',
  async (reqData) => {
    try {
      let url = `${COLLECTOR_URL}encounters/list/status_group/count?scope=${reqData.scope}`
      let result = await collectorApi.post(url, JSON.stringify(reqData.body))

      if (result?.status === 500) {
        return 'Server Error'
      } else {
        if (result?.status === 200) {
          return result.data
        }
      }
    } catch (err) {
      console.error('Encounters Page: Error getting status group count data: ', err)
      handleError(err)
      return false
    }
  },
)

/** This thunk returns permissions for the current logged-in user
 * @return object - Returns the response object from the API request
 */
export const getPermissions = createAsyncThunk('/currentuser/permissions', async () => {
  try {
    let url = `${SETTINGS_URL}currentuser/permissions`
    let result = await settingsApi.get(url)

    if (result?.status === 500) {
      return 'Server Error'
    } else {
      if (result?.status === 200) {
        console.log('result roles:')
        return result.data.results
      }
    }
  } catch (err) {
    console.error('Encounters Page: Error getting permissions data: ', err)
    handleError(err)
    return false
  }
})

/** This thunk returns the roles for the currently logged-in user
 * @return object - Returns the response object from the API request
 */
export const getRoles = createAsyncThunk('/currentuser/roles', async () => {
  try {
    let url = `${SETTINGS_URL}currentuser/roles`
    let result = await settingsApi.get(url)

    if (result?.status === 500) {
      return 'Server Error'
    } else {
      if (result?.status === 200) {
        return result.data.results
      }
    }
  } catch (err) {
    console.error('Encounters Page: Error getting roles data: ', err)
    handleError(err)
    return false
  }
})

/** This thunk returns the practices for the current logged-in user
 * @return object - Returns the response object from the API request
 */
export const getPractices = createAsyncThunk('currentuser/practices', async () => {
  try {
    let url = `${SETTINGS_URL}currentuser/practices`
    let result = await settingsApi.get(url)

    if (result?.status === 500) {
      return 'Server Error'
    } else {
      if (result?.status === 200) {
        return result.data.results
      }
    }
  } catch (err) {
    console.error('Encounters Page: Error getting practices data: ', err)
    handleError(err)
    return false
  }
})

/** This thunk returns the facilities for the current provider
 * @return object - Returns the response object from the API request
 */
export const getFacilities = createAsyncThunk('currentprovider/facilities', async () => {
  try {
    let url = `${SETTINGS_URL}currentprovider/facilities?enabled=true&pagesize=1000000000`
    let result = await settingsApi.get(url)

    if (result?.status === 500) {
      return 'Server Error'
    } else {
      if (result?.status === 200) {
        return result.data.resData
      }
    }
  } catch (err) {
    console.error('Encounters Page: Error getting facilities data: ', err)
    handleError(err)
    return false
  }
})

/** This thunk will execute a bulk operation of voiding selected items in the encounters table.
 * /dailycensus/bulkvoid
 * This is a POST request that will take in a payload as a JSON object in the reqData.body {"visitIds": ["6543fc083f2f1bad67a18361, 6543fc083f2f1bad67a18361"], "status": "Checked In", "isVoid": true}
 * The visit_id is a list of visit ID statuses that are selected gathered together in an array
 */
export const bulkVoid = createAsyncThunk('dailycensus/bulkvoid', async (reqData) => {
  try {
    let url = `${COLLECTOR_URL}dailycensus/bulkvoid`
    let result = await collectorApi.post(url, reqData.body)

    if (result?.status === 500) {
      return 'Server Error'
    } else {
      if (result?.status === 200) {
        return result.data
      }
    }
  } catch (err) {
    console.error('Encounters Page: Error getting status group count data: ', err)
    handleError(err)
    return false
  }
})

/** This thunk will execute a bulk operation of recalling submissions of selected items in the encounters table.
 * This is a POST request that will take in a payload as a JSON object in the reqData.body e.g. {visit_id: ["6543fb743f2f1bb825a18270", "6544132d3f2f1b6d09a1a1f2"], messageText: ""}
 * The visit_id is a list of visit ID statuses in an array. The message seems to be irrelevant.
 */
export const bulkRecallSubmissions = createAsyncThunk(
  'dailycensus/v2/visits/bulkrecallbill',
  async (reqData) => {
    try {
      let url = `${COLLECTOR_URL}dailycensus/v2/visits/bulkrecallbill`
      let result = await collectorApi.post(url, reqData.body)

      if (result?.status === 500) {
        return 'Server Error'
      } else {
        if (result?.status === 200) {
          return result.data
        }
      }
    } catch (err) {
      console.error('Encounters Page: Error getting status group count data: ', err)
      handleError(err)
      return false
    }
  },
)

/** This thunk will download all the selected items in PDF format
 * This is a GET request to the endpoint charges/export/charts/series that takes in a visit_ids query string parameter that consists of a comma separated string of ID values.
 * e.g. /charges/export/charts/series?fileFormat=pdf&visit_ids=6432a89118d1b463f3e56026,65329fg812c1c448f1e55c26
 */
export const bulkDownloadNotes = createAsyncThunk(
  'charges/export/charts/series',
  async (reqData) => {
    try {
      let url = `${COLLECTOR_URL}charges/export/charts/series?${reqData.queryString}`
      let result = await collectorApi.get(url, { responseType: 'blob' })

      if (result?.status === 500) {
        return 'Server Error'
      } else {
        if (result?.status === 200) {
          return result
        }
      }
    } catch (err) {
      console.error('Encounters Page: Error downloading notes: ', err)
      handleError(err)
      return false
    }
  },
)
