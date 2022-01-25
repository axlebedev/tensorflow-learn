import {
  useEffect,
  useState,
} from 'react'

export const useFetch = (url, defaultValue) => {
  const [data, setData] = useState(defaultValue)

  useEffect(
    async () => {
      if (__CLIENT__) {
        const response = await fetch(url)
        const json = await response.json()
        setData(json)
      }
    },
    [],
  )

  return data
}
