import React, { useState } from 'react'
import config from '../../../config'
import './ExportSpreadsheet.scss'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { CSpinner } from '@coreui/react-pro'
import { COLLECTOR_URL, setupInterceptorsTo, getToken } from 'src/apiHelper/helper.ts'
import axios from 'axios'
import moment from 'moment'
import { useSelector } from 'react-redux'

const collectorApi = setupInterceptorsTo(
  axios.create({
    baseURL: COLLECTOR_URL,
  }),
)

/** This component shows a download icon that when clicked exports an Excel spreadsheet (.xlsx) based off of the currently set practice, provider, and filters.
 * @return '.xlsx' - no return value, just prompts an Excel file for download
 */
const ExportSpreadsheet = () => {
  const [isLoading, setIsLoading] = useState(false)
  let currentScope = useSelector((state) => state.encounters.currentScope)
  let currentFilters = useSelector((state) => state.encounters.currentFilters)
  let currentSearch = useSelector((state) => state.encounters.currentSearch)
  let currentSort = useSelector((state) => state.encounters.currentSort)

  const getExcelExport = async () => {
    setIsLoading(true)
    try {
      let url = `${COLLECTOR_URL}encounters/export?scope=${currentScope}&limit=30000`
      let token = await getToken()

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
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        // Include any data needed for the request
        body: JSON.stringify(reqBody),
      })

      if (response.ok) {
        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `encounters-${moment().format('YYYY-DD-MMTH-mm-ss')}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(blobUrl)
        document.body.removeChild(a)
      } else {
        console.error('API request failed')
      }
    } catch (err) {
      console.error('Encounters Page: Error downloading Excel file: ', err)
      return false
    }
  }

  return (
    <div className={`${config.prefix}-export-spreadsheet`}>
      <div className={`${config.prefix}-export-spreadsheet-icon${isLoading ? ' hide' : ''}`}>
        <CIcon
          icon={cilCloudDownload}
          onClick={() => {
            getExcelExport().then(() => {
              setIsLoading(false)
            })
          }}
          download
        />
      </div>
      <div className={`spinner${isLoading ? ' show' : ''}`}>
        <CSpinner />
      </div>
    </div>
  )
}

export default ExportSpreadsheet
