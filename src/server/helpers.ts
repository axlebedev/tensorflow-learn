import { CandleResolution } from '@tinkoff/invest-openapi-js-sdk'

export const sleep = (ms: number): Promise<null> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), ms)
  })
}

const regex: RegExp = /([0-9]+)([a-z]+)/
type TimeValueType = 'minute' | 'hour' | 'day' | 'week' | 'month'
export const getFixedInterval = (interval: CandleResolution): { timeValue: TimeValueType, count: number,  } => {
  const fixedInterval: string = (/^[0-9]/.test(interval)
    ? interval
    : `1${interval}`)
    .replace('min', 'minute')
  const [, strCount, timeValueStr] = fixedInterval.match(regex)
  const timeValue: TimeValueType = timeValueStr as TimeValueType
  const count: number = parseInt(strCount, 10)

  return { count, timeValue }
}
