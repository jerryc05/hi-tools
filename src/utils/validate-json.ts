import BigNumber from 'bignumber.js'
import JSONBig from 'json-bigint'

type JsonPrimitive = string | number | boolean | null | undefined
type JsonValue = JsonPrimitive | { [key: string]: JsonValue } | JsonValue[]
type SafeJsonPrimitive = JsonPrimitive | BigNumber
type SafeJsonValue =
  | SafeJsonPrimitive
  | { [key: string]: SafeJsonValue }
  | SafeJsonValue[]

export function validateJsonPrecision(rawText: string) {
  const lossyData = JSON.parse(rawText)
  const safeData = JSONBig.parse(rawText)
  const report: {
    field: string
    orig: SafeJsonValue
    origStr: string
    parsed: JsonValue
  }[] = []

  function compare(std: JsonValue, safe: SafeJsonValue, path: string) {
    if (Array.isArray(safe) && Array.isArray(std)) {
      safe.forEach((item, i) => {
        compare(std[i], item, `${path}[${i}]`)
      })
    } else if (
      typeof safe === 'object' &&
      safe !== null &&
      !BigNumber.isBigNumber(safe)
    ) {
      const safeObj = safe as { [key: string]: SafeJsonValue }
      Object.entries(safeObj).forEach(([key, safeVal]) => {
        compare(
          (std as { [key: string]: JsonValue })?.[key],
          safeVal,
          `${path}.${key}`,
        )
      })
    } else {
      comparePrimitive(std, safe, path)
    }
  }

  function comparePrimitive(std: JsonValue, safe: SafeJsonValue, path: string) {
    if (
      (typeof std !== 'string' && typeof std !== 'number') ||
      !BigNumber.isBigNumber(safe)
    )
      return
    if (!safe.isEqualTo(std)) {
      report.push({
        field: path,
        orig: safe,
        origStr: safe.toString(),
        parsed: std,
      })
    }
  }

  compare(lossyData, safeData, '$')
  return report.length ? report : undefined
}

// {
//   "--- 边界值测试 ---": "以下是安全精度的临界点",
//   "123.456": 123.456,
//   "MAX_SAFE_INT_Ends_91": 9007199254740991,
//   "Ends_93": 9007199254740993,
//   "Ends_95": 9007199254740995,

//   "--- 业务场景测试 ---": "模拟后端 Snowflake ID (19位长整数)",
//   "Ends_1905": 1825439754323451905,
//   "Ends_1001": 6825439754323451001,

//   "--- 浮点数测试 ---": "小数精度的丢失场景",
//   "1.0000000000000001": 1.0000000000000001,
//   "0.30000000000000004": 0.30000000000000004
// }
console.log(
  validateJsonPrecision(
    `{
  "--- 边界值测试 ---": "以下是安全精度的临界点",
  "123.456": 123.456,
  "MAX_SAFE_INT_Ends_91": 9007199254740991,
  "Ends_93": 9007199254740993,
  "Ends_95": 9007199254740995,

  "--- 业务场景测试 ---": "模拟后端 Snowflake ID (19位长整数)",
  "Ends_1905": 1825439754323451905,
  "Ends_1001": 6825439754323451001,

  "--- 浮点数测试 ---": "小数精度的丢失场景",
  "1.0000000000000001": 1.0000000000000001,
  "0.30000000000000004": 0.30000000000000004
}`,
  ),
)
