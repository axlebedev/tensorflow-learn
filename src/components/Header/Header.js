import React from 'react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import classnames from 'classnames'

import { styles } from '@redxls4/ui'

import Link from '../Link/Link'
import { getCurrentRoute } from '../../store/selectors/base'
import paths from '../../routes/paths'

const useStyles = createUseStyles({
  headerWrapper: styles.headerWrapper,
  headerTitle: styles.headerTitle,
  headerLinksWrapper: styles.headerLinksWrapper,

  active: styles.active,
  headerLink: styles.headerLink,

  flexSpacer: styles.flexSpacer,
})

const pathKeysWithOrder = [
  'home',
]
const Header = () => {
  const classes = useStyles()

  const route = useSelector(getCurrentRoute)

  return (
    <div className={classes.headerWrapper}>
      <div className={classes.headerLinksWrapper}>
        {pathKeysWithOrder.map((key) => {
          return (
            <Link
              key={key}
              to={paths[key].url}
              className={classnames(classes.headerLink, {
                [classes.active]: paths[key].url === route,
                [classes.headerTitle]: key === 'home',
              })}
            >
              {paths[key].title}
            </Link>
          )
        })}
      </div>
      <div className={classes.flexSpacer} />
    </div>
  )
}

export default Header
