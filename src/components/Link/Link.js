/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'

function isLeftClickEvent(event) {
  return event.button === 0
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

const Link = ({ to, onClick, children, ...props }) => {
  const dispatch = useDispatch()
  const handleClick = useCallback(
    (event) => {
      if (onClick) {
        onClick(event)
      }

      if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
        return
      }

      if (event.defaultPrevented === true) {
        return
      }

      event.preventDefault()
      dispatch(push(to))
    },
    [to, onClick],
  )

  return (
    <a href={to} {...props} onClick={handleClick}>
      {children}
    </a>
  )
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
}

Link.defaultProps = {
  onClick: null,
}

export default Link
