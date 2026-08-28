import config from '../../config'
import React from 'react'
import './Header.scss'
import { CImage } from '@coreui/react-pro'
import Logo from 'src/assets/Logo.svg'
import ScopeToggle from './ScopeToggle/ScopeToggle'
import SettingsDropdown from '../../../../../components/common/PageHeader/SettingsDropdown'
import { useNavigate } from 'react-router-dom'
import Search from './Search/Search'
import Pagination from './Pagination/Pagination'
import FiltersPanel from '../Content/FiltersPanel/FiltersPanel'
import ExportSpreadsheet from './ExportSpreadsheet/ExportSpreadsheet'
import Print from './Print/Print'

/** This is the main header container that displays a number of different components in the header area.
 * @return JSX.Element a React component that serves as the container for a number of different components.
 */
const Header = () => {
  const navigate = useNavigate()

  // Current practice is being stored as a JSON string in local storage which is set elsewhere in the application.
  const practice = localStorage.getItem('currentPractice')
  const name = JSON.parse(practice).organization_name || 'Encounters'

  return (
    <div className={`${config.prefix}-header`}>
      <div className={`${config.prefix}-top-layer`}>
        <div
          className={'title'}
          onClick={(e) => {
            navigate('/selectPractice')
          }}
        >
          {name}
        </div>
        <div className={'logo'}>
          <CImage src={Logo} width={40} height={40} />
          <span>Claimocity</span>
        </div>
        <div className={'toggle'}>
          <ScopeToggle />
        </div>
        <div className={`settings`}>
          <div className={'census-page-right-text'}>
            <SettingsDropdown />
          </div>
        </div>
      </div>
      <div className={`${config.prefix}-second-layer`}>
        <div className={`controls`}>
          <div className={`search`}>
            <Search />
          </div>
          <div className={`pagination-and-icons`}>
            <Pagination />
            <FiltersPanel />
            <ExportSpreadsheet />
            <Print />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
