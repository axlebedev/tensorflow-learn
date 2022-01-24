import React, {
  useMemo,
  useCallback,
} from 'react'
import * as tf from '@tensorflow/tfjs'

// Example: train model to find value of function `y=2x-1`
const TensorFlowComponent = () => {
  const model = useMemo(() => {
    // Define a model for linear regression.
    //
    // Create new model instance
    // A sequential model is any model where the outputs of one layer
    // are the inputs to the next layer,
    // i.e. the model topology is a simple ‘stack’ of layers, with no branching or skipping.
    const _model = tf.sequential() // https://js.tensorflow.org/api/latest/#sequential

    // Add layer
    // In a dense layer, every node in the layer is connected to every node in the preceding layer
    _model.add(tf.layers.dense({
      units: 1, // One output value
      inputShape: [1], // One input value
    }))

    // Specify loss and optimiser function
    _model.compile({
      loss: 'meanSquaredError', // model tries to minimize this value
      optimizer: 'sgd', // Stochastic Gradient Descent, ok for linear regression tasks
    })
    return _model
  }, [])

  const onClick = useCallback(
    async () => {
      console.log('%c11111', 'background:#00FF00', Date.now() % 10000, 'TensorFlow:33 onClick')
      // Train the model using the data.

      // Prepare training data for `y=2x-1`
      // const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1])
      // const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1])
      const xs = tf.tensor2d([1, 2, 3, 4, 5, 6], [6, 1])
      const ys = tf.tensor2d([1000, 2000, 3000, 4000, 5000, 6000], [6, 1])

      // Train the model
      console.log('%c11111', 'background:#00FF00', 'start fit')
      await model.fit(xs, ys, { epochs: 500 })
      console.log('%c11111', 'background:#00FF00', 'finish fit')

      // Use model to predict values
      const result = model.predict(tf.tensor([5], [1, 1])) // Look at console
      console.log('%c11111', 'background:#00FF00', 'result=', result)
      console.log('%c11111', 'background:#00FF00', 'Array.from(result.dataSync())=', Array.from(result.dataSync()))
      result.print()
    },
    [model],
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
