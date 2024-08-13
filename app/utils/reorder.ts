export function reorder<T>(tasks: T[], startIndex: number, endIndex: number) {
  const result = [...tasks]
  const [removed] = result.splice(startIndex, 1)

  result.splice(endIndex, 0, removed!)

  return result
}
