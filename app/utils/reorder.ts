interface ObjectWithOrder {
  order?: number | null
}

export function reorder<T extends ObjectWithOrder>(
  items: T[],
  destinationIndex: number,
  sourceIndex: number
) {
  const result = [...items]
  const [removed] = result.splice(sourceIndex, 1)

  const itemWithDestinationOrder = result.find(
    item => item.order === destinationIndex
  )

  console.log(itemWithDestinationOrder)

  if (itemWithDestinationOrder) {
    result.splice(destinationIndex, 1)
    result.splice(destinationIndex - 1, 0, itemWithDestinationOrder)
  }

  result.splice(destinationIndex, 0, removed!)

  return result
}

export function addAndReorder<T extends ObjectWithOrder>(
  items: T[],
  destinationIndex: number,
  item: T
) {
  const result = [...items]

  const itemWithDestinationOrder = result.find(
    item => item.order === destinationIndex
  )

  if (itemWithDestinationOrder) {
    result.splice(destinationIndex, 1)
    result.splice(destinationIndex - 1, 0, itemWithDestinationOrder)
  }

  result.splice(destinationIndex, 0, item)

  return result
}

export function initialReorder<T extends ObjectWithOrder>(items: T[]) {
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
