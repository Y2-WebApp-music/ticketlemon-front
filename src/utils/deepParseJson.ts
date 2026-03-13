const isNumString = (str: string) => !isNaN(Number(str))

function deepParseJson(input: unknown): unknown {
  if (typeof input === "string") {
    if (isNumString(input)) {
      return input
    }
    try {
      return deepParseJson(JSON.parse(input))
    } catch {
      return input
    }
  }

  if (Array.isArray(input)) {
    return input.map((value) => deepParseJson(value))
  }

  if (typeof input === "object" && input !== null) {
    const source = input as Record<string, unknown>
    const parsedEntries = Object.entries(source).map(([key, value]) => {
      const parsedValue =
        typeof value === "string" && isNumString(value)
          ? value
          : deepParseJson(value)
      return [key, parsedValue]
    })

    return Object.fromEntries(parsedEntries)
  }

  return input
}

export default deepParseJson
