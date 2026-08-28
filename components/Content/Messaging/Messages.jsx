import React from 'react'
import config from '../../../config'
import './Messages.scss'
import {
  CToast,
  CToastClose,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from '@coreui/react-pro'
import { useDispatch } from 'react-redux'
import { setNotification } from 'src/features/encounters/encountersSlice'

/** This component shows a toast/notification when an event occurs.
 * Possible values include: "success," "error," "warning," or "info."
 * @return JSX.Element a React component that shows a notification/toast when an event happens
 */
export const Notification = (props) => {
  const dispatch = useDispatch()

  return (
    <div className={`${config.prefix}-toast`}>
      <CToast
        className={props.type}
        visible={props.visible}
        delay={5000}
        autohide={true}
        onShow={() => {}}
        onClose={() => {
          dispatch(setNotification({ visible: false, type: '', title: '', message: '' }))
        }}
      >
        <div>{props.title}</div>
        <CToastClose className={`closeX`} />
        {props.message}
      </CToast>
    </div>
  )
}

/** This component displays a prompt where the user can either confirm or cancel the chosen action.
 * @return JSX.Element a React component that displays a prompt to confirm/cancel an event.
 */
export const Prompt = (props) => {
  return (
    <CModal
      className={`${config.prefix}-prompt`}
      alignment={`center`}
      unmountOnClose={false}
      visible={props.visible}
      onClose={props.onClose}
    >
      <CModalHeader>
        <CModalTitle>{props.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{props.message}</CModalBody>
      <CModalFooter>{props.footer}</CModalFooter>
    </CModal>
  )
}
