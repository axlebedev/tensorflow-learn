/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react'
import PropTypes from 'prop-types'

const ErrorPage = ({ error }) => {
  if (__DEV__ && error) {
    return (
      <div>
        <h1>{error.name}</h1>
        <pre>{error.stack}</pre>
      </div>
    )
  }

  return (
    <div>
      <h1>Error</h1>
      <p>Sorry, a critical error occurred on this page.</p>
    </div>
  )
}

ErrorPage.propTypes = {
  error: PropTypes.shape({
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    stack: PropTypes.string.isRequired,
  }),
}

ErrorPage.defaultProps = {
  error: null,
}

export default ErrorPage
