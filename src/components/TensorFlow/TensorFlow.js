import React, {
  useMemo,
  useCallback,
} from 'react'
import * as tf from '@tensorflow/tfjs'

const TensorFlowComponent = () => {
  const model = useMemo(() => {
    // Define a model for linear regression.
    const modelResult = tf.sequential() // https://js.tensorflow.org/api/latest/#sequential
    modelResult.add(tf.layers.dense({ units: 1, inputShape: [1] }))
    modelResult.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })
    return modelResult
  }, [])

  const xs = useMemo(() => {
    return tf.tensor2d([1, 1, 1, 1], [4, 1])
  }, [])

  const ys = useMemo(() => {
    return tf.tensor2d([1000, 1000, 1000, 1000], [4, 1])
  }, [])

  const onClick = useCallback(
    async () => {
      // Train the model using the data.
      const fitres = await model.fit(xs, ys, { epochs: 10 })
      console.log('%c11111', 'background:#00FF00', 'fitres=', fitres);

      // Use the model to do inference on a data point the model hasn't seen before:
      const predictres = model.predict(tf.tensor2d([5], [1, 1]))
      console.log('%c11111', 'background:#00FF00', 'predictres=', predictres);
      predictres.print() // Look at console!
    },
    [model, xs, ys],
  )

  return (
    <div>
      Look at console!
      <br />
      <input type="button" onClick={onClick} value="RUN" />
    </div>
  )
}

export default TensorFlowComponent
