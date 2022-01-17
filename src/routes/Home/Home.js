import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'

import { styles } from '@redxls4/ui'
// import TensorFlow from '../../components/TensorFlow/TensorFlow'
import ML5 from '../../components/ML5/ML5'

const useStyles = createUseStyles({
  flexDivRow: styles.flexDivRow,
})

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(
    () => {
      if (window) {
        setIsLoaded(true)
      }
    },
    [setIsLoaded],
  )
  const classes = useStyles()

  if (isLoaded) {
    return (
      <div className={classes.flexDivRow}>
        <ML5 />
      </div>
    )
  }

  return null
}

export default Home
