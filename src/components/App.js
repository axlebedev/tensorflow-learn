import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

const ContextType = {
  // Universal HTTP client
  pathname: PropTypes.string.isRequired,
  query: PropTypes.object, // eslint-disable-line
  store: PropTypes.object, // eslint-disable-line
  storeSubscription: PropTypes.func,
}

const App = ({ context, children }) => {
  // TODO: зачем он нужен?
  const AppContext = useMemo(
    () => React.createContext(context),
    [context],
  )

  return (
    <React.StrictMode>
      <AppContext.Provider value={context}>
        {children}
      </AppContext.Provider>
    </React.StrictMode>
  )
}

App.propTypes = {
  context: PropTypes.shape(ContextType).isRequired,
  children: PropTypes.element.isRequired,
}

export default App
