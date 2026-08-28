import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import FiltersPanel from './FiltersPanel'
import { renderWithProviders } from '../../../../../../test-utils'

describe('FiltersPanel test', () => {
  it('renders learn react link', () => {
    renderWithProviders(<FiltersPanel />)

    const button = screen.getByText('Apply')
    expect(button.type).toBe('button')
  })
})
