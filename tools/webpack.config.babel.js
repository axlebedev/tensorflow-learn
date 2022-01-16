/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import WebpackAssetsManifest from 'webpack-assets-manifest'
import nodeExternals from 'webpack-node-externals'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

// For auto-clean tools
import 'babel-loader'
import '@babel/preset-typescript'
import 'worker-loader'
import 'isomorphic-style-loader'
import 'css-loader'
import 'raw-loader'
import 'file-loader'
import 'null-loader'
import 'url-loader'
import 'svg-url-loader'
import 'postcss-loader'

import overrideRules from './lib/overrideRules'
import getPackagesPaths from './getPackagesPaths'
import pkg from '../package.json'

const ROOT_DIR = path.resolve(__dirname, '..')
const resolvePath = (...args) => {
  return path.resolve(ROOT_DIR, ...args)
}
const SRC_DIR = resolvePath('src')
const BUILD_DIR = resolvePath('build')

const isDebug = !process.argv.includes('--release')
const isVerbose = process.argv.includes('--verbose')
const isAnalyze = process.argv.includes('--analyze') || process.argv.includes('--analyse')

const reScript = /\.(mjs|js|jsx|mjs|ts|tsx)$/
const reWorkerScript = /\.worker\.(js|jsx|mjs)$/
const reStyle = /\.(css|less|styl|scss|sass|sss)$/
const reImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/
const staticAssetName = isDebug
  ? '[path][name].[ext]?[contenthash:8]'
  : '[contenthash:8].[ext]'

// CSS Nano options http://cssnano.co/
const minimizeCssOptions = {
  discardComments: { removeAll: true },
}

const packagesPaths = getPackagesPaths(ROOT_DIR)
const packagesPatterns = packagesPaths.map((packagesPath) => {
  return path.relative(ROOT_DIR, packagesPath)
}).join('|')

const nodeModulesRegExp = [ROOT_DIR, ...packagesPaths]
  .reduce((acc, packagePath) => {
    const nodeModulesPath = path.join(packagePath, 'node_modules')

    if (!fs.existsSync(nodeModulesPath)) {
      return acc
    }

    const relativeNodeModulesPath = path.relative(ROOT_DIR, nodeModulesPath)

    // в папке node_modules не нужно пропускать через babel модули,
    // но исключением являются те что в externalES6Modules и packagesPaths
    return acc.concat(
      new RegExp(`${relativeNodeModulesPath}/(?!(${packagesPatterns})/)`),
    )
  }, [])

const whitelist = packagesPaths.map((packagePath) => {
  // get only last folder name
  return new RegExp(packagePath.split(path.sep).pop())
})

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
  context: ROOT_DIR,

  mode: isDebug
    ? 'development'
    : 'production',

  output: {
    path: resolvePath(BUILD_DIR, 'public/assets'),
    publicPath: '/assets/',
    pathinfo: isVerbose,
    filename: isDebug
      ? '[name].js'
      : '[name].[chunkhash:8].js',
    chunkFilename: isDebug
      ? '[name].chunk.js'
      : '[name].[chunkhash:8].chunk.js',

    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: (info) => {
      return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },
  },

  resolve: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // Keep in sync with .flowconfig and .eslintrc
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.ts', '.tsx'],
    fallback: {
      fs: false,
      net: false,
      tls: false,
    },
  },

  module: {
    // Make missing exports an error instead of warning
    strictExportPresence: true,

    rules: [
      // Rules for JS / JSX
      {
        test: reScript,
        include: [SRC_DIR, ...whitelist, resolvePath('tools')],
        loader: 'babel-loader',
        exclude: nodeModulesRegExp,
        options: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: isDebug,

          // https://babeljs.io/docs/usage/options/
          babelrc: false,
          configFile: false,
          presets: [
            ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
            // A Babel preset that can automatically determine the Babel plugins and polyfills
            // https://github.com/babel/babel-preset-env
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: pkg.browserslist,
                },
                forceAllTransforms: !isDebug, // for UglifyJS
                modules: false,
                useBuiltIns: false,
                debug: false,
              },
            ],
            // JSX
            // https://github.com/babel/babel/tree/master/packages/babel-preset-react
            ['@babel/preset-react', { development: isDebug }],
          ],
          retainLines: true,
          plugins: [
            // Stage 2
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-proposal-function-sent',
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-numeric-separator',
            '@babel/plugin-proposal-throw-expressions',

            // Stage 3
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-syntax-import-meta',
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-proposal-json-strings',

            ['@babel/plugin-proposal-private-methods', { loose: true }],

            // Treat React JSX elements as value types and hoist them to the highest scope
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements
            ...(isDebug
              ? []
              : ['@babel/transform-react-constant-elements']
            ),

            // Replaces the React.createElement function
            // with one that is more optimized for production
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements
            ...(isDebug
              ? []
              : ['@babel/transform-react-inline-elements']
            ),

            // Remove unnecessary React propTypes from the production build
            // https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
            ...(isDebug
              ? []
              : ['transform-react-remove-prop-types']
            ),

            ['@babel/plugin-transform-runtime', { regenerator: true }],
          ],
          ignore: nodeModulesRegExp,
        },
      },
      {
        test: reWorkerScript,
        exclude: nodeModulesRegExp,
        use: {
          loader: 'worker-loader',
        },
      },

      // Rules for Style Sheets
      {
        test: reStyle,
        rules: [
          // Convert CSS into JS module
          {
            issuer: { not: [reStyle] },
            use: 'isomorphic-style-loader',
          },

          // Process external/third-party styles
          {
            exclude: SRC_DIR,
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
              minimize: isDebug
                ? false
                : minimizeCssOptions,
            },
          },

          // Process internal/project styles (from src folder)
          {
            include: SRC_DIR,
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              importLoaders: 1,
              sourceMap: isDebug,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: isDebug
                ? '[name]-[local]-[contenthash:base64:5]'
                : '[contenthashhash:base64:5]',
              // CSS Nano http://cssnano.co/
              minimize: isDebug
                ? false
                : minimizeCssOptions,
            },
          },

          // Apply PostCSS plugins including autoprefixer
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './tools/postcss.config.js',
              },
            },
          },

          // Compile Less to CSS
          // https://github.com/webpack-contrib/less-loader
          // Install dependencies before uncommenting: yarn add --dev less-loader less
          // {
          //   test: /\.less$/,
          //   loader: 'less-loader',
          // },

          // Compile Sass to CSS
          // https://github.com/webpack-contrib/sass-loader
          // Install dependencies before uncommenting: yarn add --dev sass-loader node-sass
          // {
          //   test: /\.(scss|sass)$/,
          //   loader: 'sass-loader',
          // },
        ],
      },

      // Rules for images
      {
        test: reImage,
        oneOf: [
          // Inline lightweight images into CSS
          {
            issuer: reStyle,
            oneOf: [
              // Inline lightweight SVGs as UTF-8 encoded DataUrl string
              {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },

              // Inline lightweight images as Base64 encoded DataUrl string
              {
                loader: 'url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },
            ],
          },

          // Or return public URL to image resource
          {
            loader: 'file-loader',
            options: {
              name: staticAssetName,
            },
          },
        ],
      },

      // Convert plain text into JS module
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },

      // Return public URL for all assets unless explicitly excluded
      // DO NOT FORGET to update `exclude` list when you adding a new loader
      {
        exclude: [reScript, reStyle, reImage, /\.json$/, /\.txt$/],
        loader: 'file-loader',
        options: {
          name: staticAssetName,
        },
      },

      // Exclude dev modules from production build
      ...(isDebug
        ? []
        : [{
          test: resolvePath('node_modules/react-deep-force-update/lib/index.js'),
          loader: 'null-loader',
        }]
      ),
    ],
  },

  // Don't attempt to continue if there are any errors.
  bail: !isDebug,

  cache: isDebug,

  // Specify what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: {
    cached: isVerbose,
    cachedAssets: isVerbose,
    chunks: isVerbose,
    chunkModules: isVerbose,
    colors: true,
    hash: isVerbose,
    modules: isVerbose,
    reasons: isDebug,
    timings: true,
    version: isVerbose,
  },

  // Choose a developer tool to enhance debugging
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: (
    isDebug
      // ? 'eval-source-map'
      ? 'inline-cheap-module-source-map'
      : 'source-map'
  ),
  plugins: [
    // fix "process is not defined" error:
    // (do "npm install process" before running the build)
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  optimization: {
  },
}

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig = {
  ...config,

  name: 'client',
  target: 'web',

  entry: {
    client: ['./src/client.js'],
  },

  plugins: [
    ...config.plugins,
    // Define free variables
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      'process.env.NODE_ENV': isDebug
        ? JSON.stringify('development')
        : JSON.stringify('production'),
      __DEV__: isDebug,
      __CLIENT__: true,
    }),

    // Emit a file with assets paths
    // https://github.com/webdeveric/webpack-assets-manifest#options
    new WebpackAssetsManifest({
      output: `${BUILD_DIR}/asset-manifest.json`,
      publicPath: true,
      writeToDisk: true,
      customize: ({ key, value }) => {
        // You can prevent adding items to the manifest by returning false.
        if (key.toLowerCase().endsWith('.map')) {
          return false
        }
        return { key, value }
      },
      done: (manifest, stats) => {
        // Write chunk-manifest.json.json
        const chunkFileName = `${BUILD_DIR}/chunk-manifest.json`
        try {
          const fileFilter = (file) => {
            return !file.endsWith('.map')
          }
          const addPath = (file) => {
            return manifest.getPublicPath(file)
          }
          const chunkFiles = stats.compilation.chunkGroups.reduce((acc, c) => {
            acc[c.name] = [
              ...(acc[c.name] || []),
              ...c.chunks.reduce(
                (files, cc) => {
                  return [
                    ...files,
                    ...cc.files.filter(fileFilter).map(addPath),
                  ]
                },
                [],
              ),
            ]
            return acc
          }, Object.create(null))
          fs.writeFileSync(chunkFileName, JSON.stringify(chunkFiles, null, 2))
        } catch (err) {
          console.error(`ERROR: Cannot write ${chunkFileName}: `, err)
          if (!isDebug) {
            process.exit(1)
          }
        }
      },
    }),

    ...(isDebug
      ? []
      : [
        // Webpack Bundle Analyzer
        // https://github.com/th0r/webpack-bundle-analyzer
        ...(isAnalyze
          ? [new BundleAnalyzerPlugin()]
          : []
        ),
      ]),
  ],

  // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
  optimization: {
    ...config.optimization,
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          idHint: 'vendors',
        },
      },
    },
  },
}

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = {
  ...config,

  name: 'server',
  target: 'node',

  entry: {
    server: ['./src/server.js'],
  },

  output: {
    ...config.output,
    path: BUILD_DIR,
    filename: '[name].js',
    chunkFilename: 'chunks/[name].js',
    libraryTarget: 'commonjs2',
  },

  // Webpack mutates resolve object, so clone it to avoid issues
  // https://github.com/webpack/webpack/issues/4817
  resolve: {
    ...config.resolve,
  },

  module: {
    ...config.module,

    rules: overrideRules(config.module.rules, (rule) => {
      // Override babel-preset-env configuration for Node.js
      if (rule.loader === 'babel-loader') {
        return {
          ...rule,
          options: {
            ...rule.options,
            presets: rule.options.presets.map(
              (preset) => {
                return (preset[0] !== '@babel/preset-env'
                  ? preset
                  : [
                    '@babel/preset-env',
                    {
                      targets: {
                        node: pkg.engines.node.match(/(\d+\.?)+/)[0],
                      },
                      modules: false,
                      useBuiltIns: false,
                      debug: false,
                    },
                  ])
              },
            ),
          },
        }
      }

      // Override paths to static assets
      if (
        rule.loader === 'file-loader'
        || rule.loader === 'url-loader'
        || rule.loader === 'svg-url-loader'
      ) {
        return {
          ...rule,
          options: {
            ...rule.options,
            emitFile: false,
          },
        }
      }

      return rule
    }),
  },

  externals: [
    './chunk-manifest.json',
    './asset-manifest.json',
    nodeExternals({
      allowlist: [reStyle, reImage, ...whitelist],
    }),
  ],

  plugins: [
    ...config.plugins,
    // Define free variables
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      'process.env.NODE_ENV': isDebug
        ? JSON.stringify('development')
        : JSON.stringify('production'),
      __DEV__: isDebug,
      __CLIENT__: false,
    }),

    // Adds a banner to the top of each generated chunk
    // https://webpack.js.org/plugins/banner-plugin/
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],
}

export default [clientConfig, serverConfig]
