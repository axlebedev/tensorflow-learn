import React from 'react'
import PropTypes from 'prop-types'

import serialize from 'serialize-javascript'

import config from '../config'

/* eslint-disable react/no-danger */

const Html = ({
  title,
  description,
  styles,
  scripts,
  app,
  children,
}) => {
  return (
    <html className="no-js" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          {`* {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              flex-grow: 1;
            }
            html, body, div#app { height: 100%; }
            `}
        </style>
        {scripts.map((script) => {
          return (
            <link key={script} rel="preload" href={script} as="script" />
          )
        })}
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/icon.png" />
        {styles.map((style) => {
          return (
            <style
              key={style.id}
              id={style.id}
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />
          )
        })}
        <script src="https://apis.google.com/js/api.js" />

        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.min.js" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/addons/p5.sound.min.js" />
        <script src="https://unpkg.com/ml5@latest/dist/ml5.min.js" />
      </head>
      <body>
        <div
          id="app"
          dangerouslySetInnerHTML={{ __html: children }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }}
        />
        {scripts.map((script) => {
          return (
            <script key={script} src={script} />
          )
        })}
        {config.analytics.googleTrackingId && (
          <script
            dangerouslySetInnerHTML={{
              __html:
                'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;'
                  + `ga('create','${
                    config.analytics.googleTrackingId
                  }','auto');ga('send','pageview')`,
            }}
          />
        )}
        {config.analytics.googleTrackingId && (
          <script src="https://www.google-analytics.com/analytics.js" async defer />
        )}
      </body>
    </html>
  )
}

Html.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  styles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      cssText: PropTypes.string.isRequired,
    }).isRequired,
  ),
  scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
  app: PropTypes.object, // eslint-disable-line
  children: PropTypes.string.isRequired,
}

Html.defaultProps = {
  styles: [],
  scripts: [],
}

export default Html
