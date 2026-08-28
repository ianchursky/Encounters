import React from 'react'
import config from '../../../config'
import './Print.scss'
import CIcon from '@coreui/icons-react'
import { cilPrint } from '@coreui/icons'

/** This component shows a print icon that when clicked allows the user to print based off of the currently set practice, provider, and filters.
 * @return '(window.print())' - no return value, only fires off a window.print() dialog
 */
const Print = () => {
  return (
    <div className={`${config.prefix}-print`}>
      <CIcon
        className={'icon'}
        icon={cilPrint}
        onClick={() => {
          window.print()
        }}
      />
    </div>
  )
}

export default Print
