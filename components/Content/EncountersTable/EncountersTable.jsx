import config from '../../../config'
import React, { useState } from 'react'
import './EncountersTable.scss'
import {
  getStatusIcon,
  getStatusText,
  getPatient,
  getServiceDate,
  getPrimaryDiagnosis,
  getPrimaryProcedure,
  getPatientAdmitInfoDate,
  getProvider,
  getFacility,
} from './EncountersTableHelper'
import BulkActions from './BulkActions/BulkActions'
import ColumnHeader from './ColumnHeader/ColumnHeader'
import { CSmartTable } from '@coreui/react-pro'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  bulkDownloadNotes,
  bulkRecallSubmissions,
  bulkVoid,
  getEncounters,
} from 'src/features/encounters/encountersThunk'
import { setNotification } from 'src/features/encounters/encountersSlice'
import { getPatientData } from '../../../../../../helper/backendHelper'

// takes in a patient data object from the DB and prepares
// missing fields that will be added to the encounter
function mapPatientFieldsToChargeFields(patientData) {
  if (!patientData) {
    return {}
  }

  // make sure these are patient exclusive fields
  return {
    patient_hospiceEnrolled: patientData?.hospiceEnrolled,
    patient_acoEnrolled: patientData?.acoEnrolled,
    patient_admit_info: patientData?.patient_admit_info,
  }
}

/** This is the main encounters table that displays all the data as needed depending on the admin/provider context or the selected filters, search, and sort.
 * This component is implemented using the CSmartTable component in CoreUI React.
 * See: https://coreui.io/react/docs/components/smart-table for more information.
 * @return JSX.Element a React component that shows the main table of the content in the encounters page.
 */
const EncountersTable = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const encounters = useSelector((state) => state.encounters.encounters)
  const currentPage = useSelector((state) => state.encounters.currentPage)
  const currentPageLimit = useSelector((state) => state.encounters.currentPageLimit)
  const currentFilters = useSelector((state) => state.encounters.currentFilters)
  const currentSort = useSelector((state) => state.encounters.currentSort)
  const currentScope = useSelector((state) => state.encounters.currentScope)
  const currentSearch = useSelector((state) => state.encounters.currentSearch)
  const [selectedItems, setSelectedItems] = useState([])

  /** This is an array of objects that define the table header &lt;th&gt; items used in the encounters &lt;CSmartTable /&gt; table.
   * Note that the label is actually a component in itself... &lt;ColumnHeader />*/
  const columns = [
    {
      key: 'status',
      _props: { id: 'status' },
      label: 'Status',
      filter: false,
      sorter: false,
    },
    {
      key: 'patient_name',
      _props: { id: 'patient_name' },
      label: <ColumnHeader title={`Patient Name`} sortKey={`patient_name`} sort={true} />,
      filter: false,
      sorter: true,
    },
    {
      key: 'service_date_from',
      _props: { id: 'service_date_from' },
      label: <ColumnHeader title={`Date of Service`} sortKey={`service_date_from`} sort={true} />,
      filter: false,
      sorter: true,
    },
    {
      key: 'admission_date',
      _props: { id: 'admission_date' },
      label: <ColumnHeader title={`Admission Date`} sortKey={`admission_date`} sort={true} />,
      filter: false,
      sorter: true,
    },
    {
      key: 'encounter_status',
      _props: { id: 'encounter_status' },
      label: <ColumnHeader title={`Encounter Status`} sortKey={`encounter_status`} sort={false} />,
      filter: false,
      sorter: false,
    },
    {
      key: 'diagnosis_code_primary',
      _props: { id: 'diagnosis_code_primary' },
      label: (
        <ColumnHeader title={`Primary Diagnosis`} sortKey={`diagnosis_code_primary`} sort={false} />
      ),
      filter: false,
      sorter: false,
    },
    {
      key: 'procedure_code_primary',
      _props: { id: 'procedure_code_primary' },
      label: <ColumnHeader title={`Procedures`} sortKey={`procedure_code_primary`} sort={false} />,
      filter: false,
      sorter: false,
    },
    {
      key: 'rendering_provider_name',
      _props: { id: 'rendering_provider_name' },
      label: <ColumnHeader title={`Provider`} sortKey={`rendering_provider_name`} sort={true} />,
      filter: false,
      sorter: true,
    },
    {
      key: 'facility_name',
      _props: { id: 'facility_name' },
      label: <ColumnHeader title={`Facility`} sortKey={`facility_name`} sort={true} />,
      filter: false,
      sorter: true,
    },
  ]

  const refreshItems = async () => {
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
    console.log(`Dispatching ${JSON.stringify(reqBody)}`)
    dispatch(
      getEncounters({
        limit: currentPageLimit,
        page: currentPage,
        scope: currentScope,
        body: reqBody,
      }),
    )
  }

  const onRecallSubmissions = async (visitIdArray) => {
    let obj = { visit_id: visitIdArray, messageText: '' }
    await dispatch(
      bulkRecallSubmissions({
        body: obj,
      }),
    )

    await refreshItems()

    await dispatch(
      setNotification({
        type: `success`,
        visible: true,
        title: `Success`,
        message: `Items recalled successfully`,
      }),
    )
  }

  const onVoidAction = async (visitIdArray) => {
    let obj = { visitIds: visitIdArray, status: 'Checked In', isVoid: true }
    await dispatch(
      bulkVoid({
        body: obj,
      }),
    )

    await refreshItems()

    await dispatch(
      setNotification({
        type: `success`,
        visible: true,
        title: `Success`,
        message: `Items voided successfully`,
      }),
    )
  }

  const onDownloadNotes = async (idsString) => {
    let queryString = `fileFormat=pdf&visit_ids=${idsString}`
    console.log(queryString)
    await dispatch(
      bulkDownloadNotes({
        queryString: queryString,
      }),
    )
    await dispatch(
      setNotification({
        type: `success`,
        visible: true,
        title: `Notes Downloaded`,
        message: `Notes downloaded successfully`,
      }),
    )
  }

  return (
    <>
      <div className={`bulk-actions${selectedItems.length ? ' show' : ''}`}>
        <BulkActions
          selectedItems={selectedItems}
          onDownloadNotes={onDownloadNotes}
          onVoidAction={onVoidAction}
          onRecallSubmissions={onRecallSubmissions}
        />
      </div>
      <div className={`${config.prefix}-table`}>
        <CSmartTable
          activePage={1}
          clickableRows
          columns={columns}
          columnSorter={{ resetable: false, external: true }}
          header={true}
          items={encounters}
          itemsPerPageSelect
          pagination
          itemsPerPage={currentPageLimit}
          // tableFilter
          // tableFilterLabel={''} // label will also be hidden in EncountersTable.scss
          // tableFilterPlaceholder={'Filter Items...'}
          onFilteredItemsChange={(items) => {}}
          onSelectedItemsChange={(items) => {
            setSelectedItems(items)
          }}
          scopedColumns={{
            status: (item) => getStatusIcon(item),
            patient_name: (item) => getPatient(item),
            service_date_from: (item) => getServiceDate(item),
            admission_date: (item) => getPatientAdmitInfoDate(item),
            encounter_status: (item) => getStatusText(item),
            diagnosis_code_primary: (item) => getPrimaryDiagnosis(item),
            procedure_code_primary: (item) => getPrimaryProcedure(item),
            rendering_provider_name: (item) => getProvider(item),
            facility_name: (item) => getFacility(item),
          }}
          selectable
          sorterValue={{ column: 'service_date_from', state: 'desc' }}
          tableProps={{
            className: `${config.prefix}-table-data`,
            responsive: true,
            striped: true,
            hover: true,
          }}
          tableBodyProps={{
            className: 'align-middle',
          }}
          onRowClick={async (rowDetails, index, columnName, event) => {
            // because of a coreUI bug, onClick columns are off by 1
            // so to not open an encounter when clicking a checkbox, we have to ignore the column to the right, 'status'
            if (columnName === columns[0].key) {
              return
            }

            // dont open completed or voided encounters
            if (rowDetails.status_group === 'Completed' || rowDetails.status_group === 'Void') {
              return
            }
            const { status, data: patientData } = await getPatientData(rowDetails.patient_id)
            if (status !== 'success') {
              dispatch(
                setNotification({
                  type: `error`,
                  visible: true,
                  title: `Error`,
                  message: 'Unable to open encounter',
                }),
              )
              return
            }

            navigate('/newEncounter', {
              state: {
                pid: rowDetails.charge_id,
                pdata: {
                  ...rowDetails,
                  _id: rowDetails.charge_id,
                  ...mapPatientFieldsToChargeFields(patientData?.[0]),
                },
                isEdit: true,
                previousPage: 'Encounters',
                // new encounter table show multiple dates at a time
                // so treat it as a history, so we show the right date
                fromVisitHistory: true,
                // and as a continued visit so we use the right _id
                isContinueVisit: true,
              },
            })
          }}
        />
      </div>
    </>
  )
}

export default EncountersTable
