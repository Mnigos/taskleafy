export function reorder<T>(
  items: T[],
  destinationIndex: number,
  sourceIndex?: number,
  item?: T
) {
  const result = [...items]
  const [removed] = sourceIndex ? result.splice(sourceIndex, 1) : [item]

  result.splice(destinationIndex, 0, removed!)

  return result
}
