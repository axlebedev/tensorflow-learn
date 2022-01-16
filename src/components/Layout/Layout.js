import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { createUseStyles } from 'react-jss'

import { styles } from '@redxls4/ui'

import Header from '../Header/Header'

const useStyles = createUseStyles({
  layoutWrapperDiv: styles.layoutWrapperDiv,
  layoutMiddleDiv: styles.layoutMiddleDiv,
})

const Layout = ({ children }) => {
  const layoutRef = useRef(null)
  const classes = useStyles()

  return (
    <div
      className={classes.layoutWrapperDiv}
      ref={layoutRef}
    >
      <Header />
      <div className={classes.layoutMiddleDiv}>
        {children}
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
