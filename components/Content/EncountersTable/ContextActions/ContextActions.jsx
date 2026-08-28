import React from 'react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react-pro'
import { useNavigate } from 'react-router-dom'

// is this being used?

/** This component displays a context menu with a clickable "..." that allows you to take particular actions on a particular encounter.
 * @return JSX.Element a React component that displays an ellipses that displays a dropdown with different actions that can be taken based off of the context.
 */
const ContextActions = (props) => {
  const navigate = useNavigate()

  return (
    <CDropdown>
      <CDropdownToggle color="secondary">...</CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem
          onClick={() => {
            navigate('/newEncounter', {
              state: {
                pid: props.item.charge_id,
                pdata: props.item,
                isEdit: true,
                previousPage: 'Encounters',
              },
            })
          }}
        >
          Edit Encounter
        </CDropdownItem>
        <CDropdownItem
          onClick={() => {
            console.log(props.item)
          }}
        >
          Discharge
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default ContextActions
