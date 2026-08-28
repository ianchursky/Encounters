import React from 'react'
import config from '../../config'
import './Content.scss'
import { CCol, CRow } from '@coreui/react-pro'
import EncountersTable from './EncountersTable/EncountersTable'
import LoadingSpinner from './LoadingSpinner/LoadingSpinner'
import { useSelector } from 'react-redux'
import { Notification } from './Messaging/Messages'

/** This is the main content container that displays a number of different components in the content area.
 * @return JSX.Element a React component that serves as the container for a number of different components.
 */
const Content = () => {
  let isLoading = useSelector((state) => state.encounters.isLoading)
  let notification = useSelector((state) => state.encounters.notification)

  return (
    <div className={`${config.prefix}-content${isLoading ? ' hide' : ''}`}>
      <CRow className={`${config.prefix}-content-row`}>
        <CCol className={`${config.prefix}-content-column`} xs={4} md={6} lg={12}>
          <LoadingSpinner />
          <EncountersTable />
          <Notification
            visible={notification.visible}
            type={notification.type}
            title={notification.title}
            message={notification.message}
          />
        </CCol>
      </CRow>
    </div>
  )
}

export default Content
