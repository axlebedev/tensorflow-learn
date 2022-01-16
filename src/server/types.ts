import { Candle, CandleResolution } from '@tinkoff/invest-openapi-js-sdk'

export type CachedCandle = (Candle & {
  timestamp: number,
  isNull?: boolean,
}) | {
  figi: string,
  interval: CandleResolution,
  isNull: boolean,
  timestamp: number,
}

export type Deal = {
  date: string,
  ticker: string,
  count: number, /// if buy = positive, if sell - negative
}
