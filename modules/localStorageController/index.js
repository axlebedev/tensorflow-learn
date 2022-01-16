import debounce from 'lodash/debounce'

import { getIsDemo } from '@redxls4/commonHelpers/utils'

const keys = {
  period: 'period',
  xBounds: 'xBounds',
  yBounds: 'yBounds',
}

const setValue = (key, value) => {
  if (__CLIENT__ && !getIsDemo()) {
    localStorage.setItem(key, value)
  }
}

const getValue = (key) => {
  if (__CLIENT__ && !getIsDemo()) {
    return localStorage.getItem(key)
  }
  return undefined
}

export const setPeriod = (period) => {
  setValue(keys.period, period)
}

export const getPeriod = () => {
  return getValue(keys.period)
}

export const setXBounds = debounce(
  (min, max) => {
    const stringValue = JSON.stringify({
      min: min.valueOf(),
      max: max.valueOf(),
    })
    setValue(keys.xBounds, stringValue)
  },
  500,
)

export const getXBounds = () => {
  const stringValue = getValue(keys.xBounds)
  if (!stringValue) {
    return undefined
  }

  const parsed = JSON.parse(stringValue)
  return {
    min: new Date(parsed.min),
    max: new Date(parsed.max),
  }
}

export const setYBounds = debounce(
  (min, max) => {
    const stringValue = JSON.stringify({ min, max })
    setValue(keys.yBounds, stringValue)
  },
  500,
)

export const getYBounds = () => {
  const stringValue = getValue(keys.yBounds)
  if (!stringValue) {
    return undefined
  }

  return JSON.parse(stringValue)
}
