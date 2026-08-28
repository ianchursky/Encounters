import React from 'react'
import config from '../../../config'
import './LoadingSpinner.scss'
import { CSpinner } from '@coreui/react-pro'
import { useSelector } from 'react-redux'

/** This component displayes when the encounters page is in the process of loading data.
 * @return JSX.Element a React component that displays an overlay over top of the page and an animated loading spinner.
 */
const LoadingSpinner = () => {
  let isLoading = useSelector((state) => state.encounters.isLoading)

  return (
    <div className={`${config.prefix}-loading-spinner`}>
      <div className={`${config.prefix}-loading-spinner-inner${isLoading ? ' show' : ''}`}>
        <CSpinner />
      </div>
    </div>
  )
}

export default LoadingSpinner
