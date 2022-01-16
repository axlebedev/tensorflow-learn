import * as localStorageController from '@redxls4/localStorageController'

import {
  SAMPLE_ACTION,
} from './reducer'

export const sampleAction = (args) => {
  return (dispatch) => {
    dispatch({ type: SAMPLE_ACTION, args })
  }
k}
