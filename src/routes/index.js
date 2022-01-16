import paths from './paths'

// The top-level (parent) route
const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: paths.home.url,
      load: () => {
        return import(/* webpackChunkName: 'Home' */ './Home')
      },
    },

    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () => {
        return import(/* webpackChunkName: 'NotFound' */ './NotFound')
      },
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next()

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'}`
    route.description = route.description || ''

    return route
  },
}

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/Error',
    action: require('./Error').default, // eslint-disable-line global-require
  })
}

export default routes
