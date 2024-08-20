export function reorder<T>(
  items: T[],
  destinationIndex: number,
  sourceIndex: number
) {
  const result = [...items]
  const [removed] = result.splice(sourceIndex, 1)

  result.splice(destinationIndex, 0, removed!)

  return result
}

export function addAndReorder<T>(
  items: T[],
  destinationIndex: number,
  item: T
) {
  const result = [...items]

  result.splice(destinationIndex, 0, item)

  return result
}

export function initialReorder<T extends { order?: number | null }>(
  items: T[]
) {
  const result = [...items]

  for (const item of items) {
    if (typeof item.order === 'number' && item.order <= result.length) {
      const index = result.findIndex(({ order }) => order === item.order)

      if (index === item.order) continue

      result.splice(index, 1)
      result.splice(item.order, 0, item)
    }
  }

  return result
}
