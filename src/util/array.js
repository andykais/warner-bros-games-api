export const tupleToObject = (acc, [key, value]) => {
  acc[key] = value
  return acc
}
