import React from 'react'
import { createUseStyles } from 'react-jss'

import { styles } from '@redxls4/ui'
import TensorFlow from '../../components/TensorFlow/TensorFlow'

const useStyles = createUseStyles({
  flexDivRow: styles.flexDivRow,
})

const Home = () => {
  const classes = useStyles()
  if (!__CLIENT__) {
    return null
  }

  return (
    <div className={classes.flexDivRow}>
      <TensorFlow />
    </div>
  )
}

export default Home
