/* eslint-disable no-console */
export default function clientLoggerMiddleware({ getState }) {
  return (next) => {
    return (action) => {
      if (__CLIENT__) {
        console.log(
          `%c${action.type}`,
          'background: #F4FBB7; color: #000',
          { action, currentState: getState() },
        )
      }

      return next(action)
    }
  }
}
