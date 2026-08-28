import config from '../../../../config'
import './BulkActions.scss'
import React, { useState } from 'react'
import { CButton } from '@coreui/react-pro'
import { Prompt } from '../../Messaging/Messages'

/** This is a React component that displays a list of action buttons of different actions that can be taken on the encounters table.
 * Certain buttons are shown conditionally at times depending on the collective values of the items that are selected.
 * @return JSX.Element a &lt;div&gt; React component that displays a list of buttons.
 */
const BulkActions = ({ selectedItems, onDownloadNotes, onVoidAction, onRecallSubmissions }) => {
  const [recallSubmissionsPromptVisible, setRecallSubmissionsPromptVisible] = useState(false)
  const [voidPromptVisible, setVoidPromptVisible] = useState(false)

  let hasCompletedItems = false
  let hasInProgressItems = false
  let hasVoidedItems = false
  let hasNoNoteStatus = false
  let hasClaimAssignedStatusItems = false

  for (let i = 0; i < selectedItems.length; i++) {
    if (selectedItems[i].status_group === 'Completed') {
      hasCompletedItems = true
    } else if (selectedItems[i].status_group === 'In Progress') {
      hasInProgressItems = true
    } else if (selectedItems[i].status_group === 'Void') {
      hasVoidedItems = true
    }
    if (selectedItems[i].note_status === 'No Note') {
      hasNoNoteStatus = true
    }
    if (selectedItems[i].status === 'Claim assigned') {
      hasClaimAssignedStatusItems = true
    }
  }

  return (
    <div className={`${config.prefix}-bulk-actions${!hasCompletedItems ? ' hide' : ''}`}>
      <span className={'item-count'}>Selected {selectedItems.length} items</span>
      <CButton
        className={`recall-submission ${
          hasInProgressItems || hasVoidedItems || hasClaimAssignedStatusItems ? 'hide' : ''
        }`}
        onClick={() => {
          setRecallSubmissionsPromptVisible(true)
        }}
      >
        Recall Submission
      </CButton>
      <Prompt
        visible={recallSubmissionsPromptVisible}
        title={`Confirm Recall Submissions`}
        message={`Are you sure you want to recall submissions on the selected items?`}
        footer={
          <>
            <CButton
              className={`cancel`}
              onClick={() => {
                setRecallSubmissionsPromptVisible(false)
              }}
            >
              Cancel
            </CButton>
            <CButton
              className={`confirm`}
              onClick={async () => {
                let visitIdArray = selectedItems.map((a) => a.charge_id)
                onRecallSubmissions(visitIdArray)
                setRecallSubmissionsPromptVisible(false)
              }}
            >
              OK
            </CButton>
          </>
        }
      />
      <CButton
        className={`void ${hasVoidedItems || hasClaimAssignedStatusItems ? 'hide' : ''}`}
        onClick={() => {
          setVoidPromptVisible(true)
        }}
      >
        Void
      </CButton>
      <Prompt
        visible={voidPromptVisible}
        title={`Confirm Void`}
        message={`Are you sure you want to void the selected encounters? Any draft progress notes will be deleted.`}
        footer={
          <>
            <CButton
              className={`cancel`}
              onClick={() => {
                setVoidPromptVisible(false)
              }}
            >
              Cancel
            </CButton>
            <CButton
              className={`confirm`}
              onClick={() => {
                let visitIdArray = selectedItems.map((a) => a.charge_id)
                onVoidAction(visitIdArray)
                setVoidPromptVisible(false)
              }}
            >
              OK
            </CButton>
          </>
        }
      />
      <CButton
        className={`download-notes ${hasNoNoteStatus ? 'hide' : ''}`}
        onClick={() => {
          let visitIdList = selectedItems.map((a) => a.charge_id)
          visitIdList = visitIdList.join(',') // condense the array into string of comma-separated values.
          onDownloadNotes(visitIdList)
        }}
      >
        Download Notes
      </CButton>
    </div>
  )
}

export default BulkActions
