import React from 'react'
import moment from 'moment'
import {
  capitalizeFirstLetterInSentence,
  getStatusCategory,
  reorderNameFirstToLastNoTitle,
} from '../../Utilities/Helpers'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CTooltip,
} from '@coreui/react-pro'
import { Link } from 'react-router-dom'
/** This returns a date string in a formatted syntax of MM/DD/YYYY
 * @param dateString - a string that is probably in a date format that moment.js will attempt to format if valid
 * @return dateString - a formatted date string in the desired format moment. See: https://momentjs.com/
 */
const dateFormatter = (dateString) => {
  let date = moment(dateString)
  return date.isValid() ? date.format('MM/DD/YYYY') : '--'
}

/** This returns a React &lt;div&gtt; element with a &lt;svg&gt; element rendered as an icon.
 * This will only be shown if the item has notes attached to it.
 * @param status the current note_status value of the item
 * @return JSX.Element &lt;td&gt; element styled note icon as an indicator
 */
const noteIconDisplay = (item) => {
  if (item.note_status === 'Completed') {
    return (
      <div className={`notes completed`}>
        <CTooltip content={'Completed Note'}>
          <svg
            stroke="white"
            fill="white"
            strokeWidth="0"
            viewBox="0 0 1024 1024"
            className="icons file"
            height="1.2em"
            width="1.2em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M480 580H372a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h108v108a8 8 0 0 0 8 8h48a8 8 0 0 0 8-8V644h108a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8H544V472a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v108zm374.6-291.3c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2z"></path>
          </svg>
        </CTooltip>
      </div>
    )
  } else if (item.note_status === 'No Note') {
    return (
      <div className={`notes no-note`}>
        <CTooltip content={'No Note'}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 1024 1024"
            className="icons no-note"
            height="1.2em"
            width="1.2em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M480 580H372a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h108v108a8 8 0 0 0 8 8h48a8 8 0 0 0 8-8V644h108a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8H544V472a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v108zm374.6-291.3c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2z"></path>
          </svg>
        </CTooltip>
      </div>
    )
  } else if (item.note_status === 'Draft') {
    return (
      <div className={`notes draft`}>
        <CTooltip content={'Draft Note'}>
          <Link to={`/progressnote/${item.charge_id}`} target={`_blank`}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 1024 1024"
              className="icons draft"
              height="1.2em"
              width="1.2em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M480 580H372a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h108v108a8 8 0 0 0 8 8h48a8 8 0 0 0 8-8V644h108a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8H544V472a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v108zm374.6-291.3c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2z"></path>
            </svg>
          </Link>
        </CTooltip>
      </div>
    )
  } else {
    return <></>
  }
}

/** This returns a React table data cell &lt;td&gt; with an indicator of the current status that will be styled into an icon
 * @param item data item retrieved from the daily census list
 * @return JSX.Element &lt;td&gt; element styled status info as an indicator
 */
const getStatusIcon = (item) => {
  let statusClass = getStatusCategory(item.status)

  return (
    <td
      className={'status-column-item'}
      onClick={(e) => {
        e.stopPropagation()
        // perform other action, like navigate to somewhere else
      }}
    >
      <div>
        <div className={`status ${statusClass}`}></div>
        {noteIconDisplay(item)}
      </div>
    </td>
  )
}

/** This returns a React table data cell &lt;td&gt; with a text of the current status category
 * @param item - data item retrieved from the encounters/list endpoint.
 * @return JSX.Element - a &lt;td&gt; React element text containing the status based on item's status
 */
const getStatusText = (item) => {
  let status = getStatusCategory(item.status)
  let statusText = ''
  switch (status) {
    case 'green':
      statusText = 'Completed'
      break
    case 'orange':
      statusText = 'Provider Hold'
      break
    case 'red':
      statusText = 'In Progress'
      break
    case 'white':
      statusText = 'Void'
      break
    default:
      statusText = 'No Status'
  }

  return (
    <td className={'status-column-text-item'}>
      <div>{statusText}</div>
    </td>
  )
}

/** This returns a React table data cell &lt;td&gt; element that consists of the patient's name, DOB, and gender
 * @param item - data item retrieved from the encounters/list endpoint.
 * @return JSX.Element - a &lt;td&gt; React element with patient name last, first, DOB, and gender
 */
const getPatient = (item) => {
  let name = item.patient_name

  return (
    <td className={'patient-column-item'}>
      <div
        // The fit-content allows the rest of the <td> area to be clickable with the default row behavior
        style={{ width: 'fit-content' }}
        onClick={(e) => {
          e.stopPropagation()
          // perform other action, like navigate to patient details
        }}
      >
        <div className={'name'}>{capitalizeFirstLetterInSentence(name.toLowerCase())}</div>
        <div className={'info'}>
          <span className={'dob'}>{dateFormatter(item.patient_dob)}</span>&nbsp;&nbsp;
          <span className={'gender'}>{item.gender}</span>
        </div>
      </div>
    </td>
  )
}

/** This returns a React table data cell &lt;td&gt; showing the patient's location (i.e., room)
 * @param item - data item retrieved from the encounters/list endpoint.
 * @return JSX.Element - a &lt;td&gt; React element with patient room
 */
const getLocation = (item) => {
  let location = item.room ? `#${item.room}` : '--'

  return (
    <td className={'location-column-item'}>
      <div className={'room'}>{location}</div>
    </td>
  )
}

/** This returns a React table data cell &lt;td&gt; that shows the primary diagnosis information for the patient.
 * @param item - data item retrieved from the encounters/list endpoint.
 * @return JSX.Element - a &lt;td&gt; React element with primary diagnosis data
 */
const getPrimaryDiagnosis = (item) => {
  let primaryDiagnosisCode = '',
    primaryDiagnosisDescription = '',
    missingClass = '' // will be used below if the diagnosis code is missing
  if (item.diagnosis_primary.code) {
    primaryDiagnosisCode = item.diagnosis_primary.code
    primaryDiagnosisDescription = item.diagnosis_primary.description
  } else {
    primaryDiagnosisCode = 'Missing Diagnosis'
    primaryDiagnosisDescription = ''
  }

  // did we get a "Missing Diagnosis" result above?
  if (primaryDiagnosisCode === 'Missing Diagnosis') {
    missingClass = ' missing' // additional styling class to be added below, note the space at the beginning
  }

  // if there are additional diagnosis codes, if so how many additional ones are there? Show the total number minus 1 to show the rest (because the first code is visible).
  let diagnosisCodeCount =
    item.diagnosis_codes.length > 1 ? ` + ${item.diagnosis_codes.length - 1}` : ''

  return (
    <td className={'primary-diagnosis-column-item'}>
      <div
        onClick={(e) => {
          e.stopPropagation()
          // perform other action, like navigate to somewhere else
        }}
      >
        <CTooltip content={item.diagnosis_codes.join(', ')} placement="top">
          <div className={`code${missingClass}`}>
            {primaryDiagnosisCode}
            {diagnosisCodeCount}
          </div>
        </CTooltip>
        <div className={'description'}>{primaryDiagnosisDescription}</div>
      </div>
    </td>
  )
}

/** This gets the primary procedure information for the patient to display in a data table column.
 * @param item - data item retrieved from the encounters/list endpoint.
 * @return JSX.Element - a &lt;td&gt; React element with primary procedure data
 */
const getPrimaryProcedure = (item) => {
  let primaryProcedureCode

  if (item.procedure_codes && item.procedure_codes.length) {
    primaryProcedureCode = item.procedure_codes[0]
  } else {
    primaryProcedureCode = '--'
  }

  // if there are additional procedure codes, how many additional ones are there? Show them as "+ number".
  let procedureCodeCount =
    item.procedure_codes && item.procedure_codes.length > 1
      ? ` + ${item.procedure_codes.length - 1}`
      : ''

  return (
    <td className={'primary-procedure-column-item'}>
      <div
        className={'code'}
        onClick={(e) => {
          e.stopPropagation()
          // perform other action, like navigate to somewhere else
        }}
      >
        <CTooltip content={item.procedure_codes.join(', ')} placement="top">
          <span>
            {primaryProcedureCode}
            {procedureCodeCount}
          </span>
        </CTooltip>
      </div>
    </td>
  )
}

/** This returns a React table data cell &lt;td&gt; that shows the date of service formatted in the proper DD/MM/YYYY format
 * @param item - data item retrieved from the encounters/list endpoint.
 * @return JSX.Element - a &lt;td&gt; React element with service date formatted in proper format
 */
const getServiceDate = (item) => {
  let serviceDate = dateFormatter(item.service_date_from)
  return (
    <td className={'service-date-column-item'}>
      <div
        className={'date'}
        onClick={(e) => {
          e.stopPropagation()
          // perform other action, like navigate to somewhere else
        }}
      >
        {serviceDate}
      </div>
    </td>
  )
}

/** This gets the patient_admit_info date information for the patient's admission date to display in a data column.
 * @param item - data item retrieved from the encounters/list endpoint.
 * @return JSX.Element - a &lt;td&gt; React element with the admission date and room number
 */
const getPatientAdmitInfoDate = (item) => {
  let date = dateFormatter(item.admission_date) || '--'
  return (
    <td className={'patient-admit-info-date-item'}>
      <div
        className={'date'}
        onClick={(e) => {
          e.stopPropagation()
          // perform other action, like navigate to somewhere else
        }}
      >
        {date}
      </div>
    </td>
  )
}

/** This gets the patient_admit_info room information for the patient's admission room number to display in a data column.
 * @param item - data item retrieved from the encounters/list endpoint.
 * @return JSX.Element - a &lt;td&gt; React element with the admission room number
 */
const getPatientAdmitInfoRoom = (item) => {
  let room
  if (Array.isArray(item.patient_admit_info) && item.patient_admit_info.length) {
    room = item.patient_admit_info[0].room
  }

  return (
    <td className={'patient-admit-info-room-item'}>
      <div className={'room'}>{room}</div>
    </td>
  )
}

/** This returns a React table data cell &lt;td&gt; that consists of the provider
 * @param item - data item retrieved from the encounters/list endpoint.
 * @return JSX.Element - a &lt;td&gt; React element with the provider name
 */
const getProvider = (item) => {
  let name = reorderNameFirstToLastNoTitle(item.rendering_provider_name)
  return <td className={'provider-column-item'}>{name}</td>
}

/** This returns a React table data cell &lt;td&gt; that consists of the facility name
 * @param item - data item retrieved from the encounters/list endpoint.
 * @return JSX.Element - a &lt;td&gt; React element with the facility name
 */
const getFacility = (item) => {
  return <td className={'facility-column-item'}>{item.facility_name}</td>
}

/** This returns a React table data cell &lt;td&gt; with an ellipses link of actions
 @param item - data item retrieved from the encounters/list endpoint.
 @param onDownloadNotes - function to call when notes are told to downloaded
 @param onVoidAction - function to call when an item is voided
 @param onRecallSubmissions - function to call when an item is recalled
 * @return JSX.Element - a &lt;td&gt; React element with a popup of actionable items.
 */
const getContextActions = (item, onDownloadNotes, onVoidAction, onRecallSubmissions) => {
  let hasInProgressItems = item?.status_group === 'In Progress'
  let hasVoidedItems = item?.status_group === 'Void'
  let hasNoNoteStatus = item?.note_status === 'No Note'

  return (
    <td
      className={`context-column-item`}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <CDropdown>
        <CDropdownToggle color="secondary">...</CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem href="#">Discharge</CDropdownItem>
          {!hasInProgressItems && (
            <CDropdownItem
              onClick={() => {
                onRecallSubmissions([item.charge_id])
              }}
            >
              Recall Submission
            </CDropdownItem>
          )}
          {!hasVoidedItems && (
            <CDropdownItem
              onClick={() => {
                onVoidAction([item.charge_id])
              }}
            >
              Void
            </CDropdownItem>
          )}
          {!hasNoNoteStatus && (
            <CDropdownItem
              onClick={() => {
                onDownloadNotes(item.charge_id)
              }}
            >
              Download Notes
            </CDropdownItem>
          )}
        </CDropdownMenu>
      </CDropdown>
    </td>
  )
}

export {
  dateFormatter,
  getStatusIcon,
  getStatusText,
  getPatient,
  getLocation,
  getServiceDate,
  getPatientAdmitInfoDate,
  getPatientAdmitInfoRoom,
  getPrimaryDiagnosis,
  getPrimaryProcedure,
  getProvider,
  getFacility,
  getContextActions,
}
