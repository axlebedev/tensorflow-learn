import {
  useMemo,
  useEffect,
} from 'react'
import map from 'lodash/map'

import { useFetch } from '../../helpers/useFetch'

/*
 * Convert array of objects tensors.
 * Do also _shuffling_ and _normalizing_
 */
export const convertToTensor = (_data) => {
  const data = [..._data]
  // wrap into 'tidy'
  return tf.tidy(() => {
    // Step 1. Shuffle data
    tf.util.shuffle(data)

    // Step 2. Convert it to tensors
    const inputs = map(data, 'horsepower')
    const labels = map(data, 'mpg') // miles per gallon

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
    const labelTensor = tf.tensor2d(labels, [labels.length, 1])

    // Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max()
    const inputMin = inputTensor.min()
    const labelMax = labelTensor.max()
    const labelMin = labelTensor.min()

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin))

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  })
}

export const useCars = (isVisShown = false) => {
  if (!__CLIENT__) {
    return []
  }

  const dirtyCars = useFetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json', [])
  const cars = useMemo(
    () => {
      return dirtyCars
        .map((car) => ({
          mpg: car.Miles_per_Gallon,
          horsepower: car.Horsepower,
        }))
        .filter((car) => (car.mpg !== null && car.horsepower !== null))
    },
    [dirtyCars],
  )

  useEffect(
    () => {
      const values = cars.map((d) => ({
        x: d.horsepower,
        y: d.mpg,
      }))

      if (__CLIENT__ && isVisShown) {
        tfvis.render.scatterplot(
          { name: 'Horsepower v MPG' },
          { values },
          {
            xLabel: 'Horsepower',
            yLabel: 'MPG',
            height: 300,
          },
        )
      }
    },
    [cars],
  )

  return cars
}

export const useModel = (isVisShown = false) => {
  const model = useMemo(
    () => {
      // Create a sequential model
      const _model = tf.sequential()

      // Add a single input layer
      _model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }))

      // Add an output layer
      _model.add(tf.layers.dense({ units: 1, useBias: true }))

      return _model
    },
    [],
  )

  useEffect(
    () => {
      if (isVisShown) {
        tfvis.show.modelSummary({ name: 'Model Summary' }, model)
      }
    },
    [model],
  )
  return model
}

export const trainModel = async ({ model, inputs, labels }) => {
  // Prepare the model for training.
  model.compile({
    // 'adam' requires no config, so take it here
    optimizer: tf.train.adam(),
    // 'loss' is a function that will tell the model how well it is doing
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  })

  // size of the data subsets that the model will see on each iteration of training
  const batchSize = 32
  // number of times the model is going to look at the entire dataset that you provide it
  const epochs = 50

  const result = await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'],
      { height: 200, callbacks: ['onEpochEnd'] },
    ),
  })
  return result
}
