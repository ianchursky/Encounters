import { createClassStringFromTitle } from '../../../Utilities/Helpers'
import React, { useEffect, useState } from 'react'
import { CFormCheck, CFormInput } from '@coreui/react-pro'
import { cidArrowThickCircleUp, cidArrowThickCircleDown, cidXCircle } from '@coreui/icons-pro'
import CIcon from '@coreui/icons-react'
import config from '../../../../config'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentFilter } from 'src/features/encounters/encountersSlice'

/** This will be a reusable collection of checkboxes as a filter "type."
 * Each filter CheckBoxGroup will display a list of checkboxes with all the available filters that can be selected from as well as a special "All" checkbox that will check or uncheck all the filters.
 * Optionally, you can also render a client side search filter box that can be used to filter values further if you have a large number of filter items to display.
 * The prop "showSearch" will handle rendering a search box if the value is set to true.
 * @param props an object literal that consists of 6 keys/properties:\
 * \
 * &#8227; **id** - an id that will be rendered as the id property of the element\
 * \
 * &#8227; **title** - a header for the checkbox group category that will serve as a "Title" of sorts above the particular checkbox group.\
 * \
 * &#8227; **labelkey** - the key of the object that will be used as the display value as well as the value searched against when searching in the search filter box\
 * \
 * &#8227; **filterkey** - this is the key that will be added to or removed from in the main filters list (filtersList) that will ultimately be used to query the options based on filters.\
 * \
 * &#8227; **options** - an array of objects with the keys/properties id. Each options item will use the labelkey prop for display, however, the value of the field will be the _id value. Sometimes these (display name and value) will be the same, other times not.\
 * \
 * &#8227; **showSearch** (true/false?) - a boolean value on whether to show a search box to enable the ability to search through the different labels. Default is false.\
 * &nbsp;
 * @return JSX.Element a React component that is a &lt;div&gt; and a generated list of checkboxes based off the options prop
 */
const CheckBoxGroup = (props) => {
  let title = props.title || ''
  let classString = createClassStringFromTitle(title)
  const dispatch = useDispatch()
  const currentFilters = useSelector((state) => state.encounters.currentFilters)
  const checked = currentFilters[props?.filterkey] || []
  const [options, setOptions] = useState([])
  const [visibleOptions, setVisibleOptions] = useState(10)
  const [isExpanded, setIsExpanded] = useState(false)
  let [searchBoxValue, setSearchBoxValue] = useState('')

  const allOptionsSelected = options?.length === checked?.length

  useEffect(() => {
    setOptions(props.options)
  }, [props.options])

  /** Renders a &lt;div&gt; with a &lt;CFormCheck /&gt; item inside of it. See: https://coreui.io/react/docs/forms/checkbox.
   * @param Object - an object literal with the property keys { id, title, label, name, handleClick, isChecked }.
   * @returns JSX.Element - a React element that is a &lt;div&gt; with a &lt;CFormCheck /&gt; item inside of it.
   * */
  const CheckboxComponent = ({ id, title, label, name, handleClick, isChecked }) => {
    if (id) {
      id = id.toString() // Fix for a warning message in the console because some id values can be numbers and it was complaining that the component was expecting a string.
    }
    // Check for label due to occasions where bad data exists which results in blank checkboxes as a result.
    if (label) {
      return (
        <div className={`filters-panel-checkbox-group-checkbox`}>
          <CFormCheck
            id={id}
            title={title}
            label={label}
            name={name}
            onChange={handleClick}
            checked={isChecked}
          />
        </div>
      )
    }
  }

  const handleSelectAll = (e) => {
    let updatedCheckedList = []
    // if all options are not selected
    if (!allOptionsSelected) {
      updatedCheckedList = options.map((item) => item._id)
      // else leave checked array as empty
    }

    dispatch(setCurrentFilter({ key: props.filterkey, value: updatedCheckedList }))
  }

  const handleClick = (e) => {
    const { id, checked: isChecked } = e.target
    let updatedCheckedList = []
    if (isChecked) {
      updatedCheckedList = [...checked, id]
    } else {
      updatedCheckedList = checked.filter((item) => item !== id)
    }

    // dispatch event here when checkbox grouping changes
    dispatch(setCurrentFilter({ key: props.filterkey, value: updatedCheckedList }))
  }

  const moreLink = () => {
    if (options.length > 10 && searchBoxValue === '') {
      if (isExpanded) {
        return (
          <div
            className={`more`}
            onClick={() => {
              setIsExpanded(false)
              setVisibleOptions(10)
            }}
          >
            <CIcon icon={cidArrowThickCircleUp} />
            &nbsp;Collapse
          </div>
        )
      } else {
        return (
          <div
            className={`more`}
            onClick={() => {
              setIsExpanded(true)
              setVisibleOptions(props.options.length)
            }}
          >
            <CIcon icon={cidArrowThickCircleDown} />
            &nbsp;Show More (+{options.length - 10})
          </div>
        )
      }
    }
  }

  return (
    <div className={`filters-panel-checkbox-group ${classString}-filters-panel-checkbox-group`}>
      <div className={'filters-panel-filter-item-header filters-panel-checkbox-group-header'}>
        <div className={'filters-panel-filter-item-title'}>{title}</div>
        <CheckboxComponent
          name="selectAll"
          id="selectAll"
          title="All"
          label="All"
          handleClick={handleSelectAll}
          isChecked={allOptionsSelected}
        />
        {props.showSearch ? (
          <div className={`filters-panel-checkbox-group-search`}>
            <CFormInput
              type="text"
              placeholder={`Search ${title}...`}
              value={searchBoxValue}
              onChange={(e) => {
                if (e.currentTarget.value) {
                  setSearchBoxValue(e.currentTarget.value)
                } else {
                  setSearchBoxValue('')
                }
              }}
            />
          </div>
        ) : (
          ''
        )}
        {checked.length > 0 && (
          <div
            className={`clear`}
            onClick={() => {
              dispatch(setCurrentFilter({ key: props.filterkey, value: [] }))
            }}
          >
            <CIcon icon={cidXCircle} /> Clear
          </div>
        )}
      </div>
      <div
        className={`filters-panel-filter-item-body ${config.prefix}-filters-panel-checkbox-group`}
      >
        {options
          .filter((data) => {
            if (searchBoxValue === '') {
              return data
            } else if (
              data[props.labelkey]?.toLowerCase()?.includes(searchBoxValue.toLowerCase())
            ) {
              return data
            }
          })
          .map((item, index) => {
            return (
              <CheckboxComponent
                id={item._id}
                key={index}
                type="checkbox"
                name={item._id}
                label={item[props.labelkey]}
                title={item._id}
                handleClick={handleClick}
                isChecked={checked.includes(item._id)}
              />
            )
          })
          .slice(0, visibleOptions)}
        {moreLink()}
      </div>
    </div>
  )
}

export default CheckBoxGroup
