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

  for (const [index, item] of items.entries()) {
    if (item.order && item.order !== index && item.order <= result.length) {
      result.splice(index, 1)

      result.splice(item.order, 0, item)
    }
  }

  return result
}
