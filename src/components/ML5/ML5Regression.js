import React, {
  useState,
  useEffect,
  useMemo,
} from 'react'

// Make datasets here https://teachablemachine.withgoogle.com/

const getArrayRandomPoints = (length) => {
  const arr = []
  for (let i = 0; i < length; ++i) {
    arr.push([
      Math.floor(Math.random() * 200),
      Math.floor(Math.random() * 200),
    ])
  }

  return arr
}

const classifyPoint = async (model, point) => {
  const result = await model.predict(point)
  console.log('%c11111', 'background:#00FF00', '[point, ...result]=', [point, ...result])
  return result
}

const TensorFlowComponent = () => {
  const model = useMemo(
    () => {
      return ml5.neuralNetwork({
        task: 'regression',
        debug: true,
      })
    },
    [],
  )
  const [inputData] = useState(getArrayRandomPoints(10000))

  useEffect(
    () => {
      inputData.forEach((point) => {
        model.addData(point, [point[0] + point[1]])
      })
      model.normalizeData()
      model.train(
        {
          epochs: 100,
          batchSize: 300,
        },
        async () => {
          classifyPoint(model, [0, 100])
          classifyPoint(model, [100, 100])
          classifyPoint(model, [-100, 100])
          classifyPoint(model, [10000, 100])
        },
      )
    },
    [model, inputData],
  )

  return (
    <div>
      ML5
    </div>
  )
}

export default TensorFlowComponent
