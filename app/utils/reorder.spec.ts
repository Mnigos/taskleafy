import { addAndReorder, initialReorder, reorder } from './reorder'

describe('ReorderUtils', () => {
  describe('reorder', () => {
    test('should reorder items', () => {
      const items = [1, 2, 3, 4, 5]
      const destinationIndex = 2
      const sourceIndex = 3

      expect(reorder(items, destinationIndex, sourceIndex)).toEqual([
        1, 2, 4, 3, 5,
      ])
    })
  })

  describe('addAndReorder', () => {
    test('should add and reorder items', () => {
      const items = [1, 2, 3, 4, 5]
      const destinationIndex = 2
      const item = 6

      expect(addAndReorder(items, destinationIndex, item)).toEqual([
        1, 2, 6, 3, 4, 5,
      ])
    })
  })

  describe('initialReorder', () => {
    test('should reorder items', () => {
      const items = [
        { order: null },
        { order: null },
        { order: 0 },
        { order: null },
        { order: 2 },
      ]

      expect(initialReorder(items)).toEqual([
        { order: 0 },
        { order: null },
        { order: 2 },
        { order: null },
        { order: null },
      ])
    })
  })
})
