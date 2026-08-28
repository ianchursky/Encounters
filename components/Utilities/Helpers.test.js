import { reorderNameFirstToLastNoTitle } from './Helpers'

describe('Helpers tests', () => {
  describe('reorderNameFirstToLastNoTitle tests', () => {
    it('should return empty string for empty vars', () => {
      expect(reorderNameFirstToLastNoTitle(null)).toBe('')
      expect(reorderNameFirstToLastNoTitle(undefined)).toBe('')
      expect(reorderNameFirstToLastNoTitle('')).toBe('')
    })

    it('should remove the comma and put the last name first', () => {
      expect(reorderNameFirstToLastNoTitle('Last, First')).toBe('First Last')
      expect(reorderNameFirstToLastNoTitle('Last, First Middle')).toBe('First Middle Last')
      expect(reorderNameFirstToLastNoTitle('Last, First Middle Med')).toBe('First Middle Med Last')
    })

    it('should return normal names as normal', () => {
      expect(reorderNameFirstToLastNoTitle('First Last')).toBe('First Last')
      expect(reorderNameFirstToLastNoTitle('First Middle Last')).toBe('First Middle Last')
      expect(reorderNameFirstToLastNoTitle(' First Middle Med Last ')).toBe('First Middle Med Last')
    })

    it('should remove dr. and m.d. by default', () => {
      // regular names
      expect(reorderNameFirstToLastNoTitle('First Last M.D.')).toBe('First Last')
      expect(reorderNameFirstToLastNoTitle('First Last M.d.')).toBe('First Last')
      expect(reorderNameFirstToLastNoTitle('First Last m.d.')).toBe('First Last')
      expect(reorderNameFirstToLastNoTitle('First Middle Last dr.')).toBe('First Middle Last')
      expect(reorderNameFirstToLastNoTitle('First Middle Last DR.')).toBe('First Middle Last')

      // comma names
      expect(reorderNameFirstToLastNoTitle('Last, First m.d.')).toBe('First Last')
      expect(reorderNameFirstToLastNoTitle('Last, First M.D.')).toBe('First Last')
      expect(reorderNameFirstToLastNoTitle('Last, First Middle dr.')).toBe('First Middle Last')
      expect(reorderNameFirstToLastNoTitle('Last, First Middle Med DR.')).toBe(
        'First Middle Med Last',
      )
    })
  })
})
