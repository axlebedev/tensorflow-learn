/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt'
import React from 'react'
import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import PrettyError from 'pretty-error'
import jss from 'jss'
import preset from 'jss-preset-default'
import { JssProvider, SheetsRegistry } from 'react-jss'
import history from './history'

import App from './components/App'
import Html from './components/Html'
import createStore from './store/createStore'
import ErrorPage from './routes/Error/ErrorPage'
import router from './router'
// import assets from './asset-manifest.json'; // eslint-disable-line import/no-unresolved
import chunks from './chunk-manifest.json' // eslint-disable-line import/no-unresolved
import config from './config'
import tensorMain from './server/tensorflowTutor'

jss.setup(preset())

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason)
  // send entire app down. Process manager will restart it
  process.exit(1)
})

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {}
global.navigator.userAgent = global.navigator.userAgent || 'all'

const app = express()

//
// If you are using proxy from external machine, you can set TRUST_PROXY env
// Default is to trust proxy headers only from loopback interface.
// -----------------------------------------------------------------------------
app.set('trust proxy', config.trustProxy)

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: (req) => {
      return req.cookies.id_token
    },
    algorithms: ['HS256'],
  }),
)
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token)
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token')
  }
  next(err)
})

// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    // console.log('%c11111', 'background:#00FF00', 'start')
    // tensorMain()
    // console.log('%c11111', 'background:#00FF00', 'end')

    const css = new Set()

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // The twins below are wild, be careful!
      pathname: req.path,
      query: req.query,
      store: createStore({}, history),
    }

    const route = await router.resolve(context)

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect)
      return
    }

    const data = { ...route }

    const sheets = new SheetsRegistry()

    data.children = ReactDOM.renderToString(
      <JssProvider registry={sheets}>
        <Provider store={context.store}>
          <ConnectedRouter history={history}>
            <App context={context}>
              {route.component}
            </App>
          </ConnectedRouter>
        </Provider>
      </JssProvider>,
    )
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
      { id: 'jss', cssText: sheets.toString() },
    ]

    const scripts = new Set()
    const addChunk = (chunk) => {
      if (chunks[chunk]) {
        chunks[chunk].forEach((asset) => {
          return scripts.add(asset)
        })
      } else if (__DEV__) {
        throw new Error(`Chunk with name '${chunk}' cannot be found`)
      }
    }
    addChunk('client')
    if (route.chunk) {
      addChunk(route.chunk)
    }
    if (route.chunks) {
      route.chunks.forEach(addChunk)
    }

    data.scripts = Array.from(scripts)
    data.app = {
      apiUrl: config.api.clientUrl,
    }

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />) // eslint-disable-line react/jsx-props-no-spreading, max-len
    res.status(route.status || 200)
    res.send(`<!doctype html>${html}`)
  } catch (err) {
    next(err)
  }
})

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('express')

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err))
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
    >
      {ReactDOM.renderToString(<ErrorPage error={err} />)}
    </Html>,
  )
  res.status(err.status || 500)
  res.send(`<!doctype html>${html}`)
})

//
// Launch the server
// -----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`)
  })
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot
  module.hot.accept('./router')
}

export default app
