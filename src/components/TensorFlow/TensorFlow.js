import React, {
  useMemo,
  useCallback,
} from 'react'
import * as tf from '@tensorflow/tfjs'

const TensorFlowComponent = () => {
  const model = useMemo(() => {
    // Define a model for linear regression.
    const result = tf.sequential() // https://js.tensorflow.org/api/latest/#sequential
    result.add(tf.layers.dense({ units: 1, inputShape: [1] }))

    result.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })
    return result
  }, [])

  const xs = useMemo(() => {
    return tf.tensor2d([1, 2, 3, 4], [4, 1])
  }, [])

  const ys = useMemo(() => {
    return tf.tensor2d([1, 3, 5, 7], [4, 1])
  }, [])

  const onClick = useCallback(() => {
    // Train the model using the data.
    model.fit(xs, ys, { epochs: 10 }).then(() => {
      // Use the model to do inference on a data point the model hasn't seen before:
      const res = model.predict(tf.tensor2d([5], [1, 1]))
      res.print() // Look at console!
    })
  }, [model, xs, ys])

  return (
    <div>
      Look at console!
      <br />
      <input type="button" onClick={onClick} value="RUN" />
    </div>
  )
}

export default TensorFlowComponent
