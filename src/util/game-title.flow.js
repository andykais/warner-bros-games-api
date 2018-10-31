const allowedScalars = [Number, String, Date, Boolean]
const scalarNames = allowedScalars.map(s => s.name)

const assertScalarsOnly = obj => {
  if (!obj) {
    throw new TypeError('schema object missing')
  }
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (
      !allowedScalars.includes(value) &&
      !allowedScalars.includes(value.type)
    ) {
      throw new TypeError(`'${key}' type must be one of [${scalarNames}]`)
    }
  }
}
const assertAllFieldsDocumented = (obj, documentation) => {
  if (!documentation) {
    throw new TypeError('missing documentation')
  }
  for (const key of Object.keys(obj)) {
    const { name, description } = documentation[key] || {}
    if (name === undefined) {
      throw new TypeError(`'${key}' missing 'name' documentation field`)
    }
    if (description === undefined) {
      throw new TypeError(`'${key}' missing 'description' documentation field`)
    }
  }
}

export const assertGameSchema = schemaObject => {
  assertScalarsOnly(schemaObject.schema.statsMap)
  assertScalarsOnly(schemaObject.schema.achievementsMap)
  assertAllFieldsDocumented(
    schemaObject.schema.statsMap,
    schemaObject.documentation.statsMap
  )
  assertAllFieldsDocumented(
    schemaObject.schema.achievementsMap,
    schemaObject.documentation.achievementsMap
  )
}
