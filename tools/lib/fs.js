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
import glob from 'glob'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'

export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      'utf8',
      (err, data) => {
        return (err
          ? reject(err)
          : resolve(data)
        )
      },
    )
  })
}

export const writeFile = (file, contents) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      file,
      contents,
      'utf8',
      (err) => {
        return (err
          ? reject(err)
          : resolve()
        )
      },
    )
  })
}

export const renameFile = (source, target) => {
  return new Promise((resolve, reject) => {
    fs.rename(source, target, (err) => {
      return (err
        ? reject(err)
        : resolve()
      )
    })
  })
}

export const copyFile = (source, target) => {
  return new Promise((resolve, reject) => {
    let cbCalled = false
    function done(err) {
      if (!cbCalled) {
        cbCalled = true
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    }

    const rd = fs.createReadStream(source)
    rd.on('error', (err) => {
      return done(err)
    })
    const wr = fs.createWriteStream(target)
    wr.on('error', (err) => {
      return done(err)
    })
    wr.on('close', (err) => {
      return done(err)
    })
    rd.pipe(wr)
  })
}

export const readDir = (pattern, options) => {
  return new Promise((resolve, reject) => {
    return glob(
      pattern,
      options,
      (err, result) => {
        return (err
          ? reject(err)
          : resolve(result)
        )
      },
    )
  },
  )
}

export const makeDir = (name) => {
  return new Promise((resolve, reject) => {
    mkdirp(name)
      .then(resolve)
      .catch(reject)
  })
}

export const moveDir = async (source, target) => {
  const dirs = await readDir('**/*.*', {
    cwd: source,
    nosort: true,
    dot: true,
  })
  await Promise.all(
    dirs.map(async (dir) => {
      const from = path.resolve(source, dir)
      const to = path.resolve(target, dir)
      await makeDir(path.dirname(to))
      await renameFile(from, to)
    }),
  )
}

export const copyDir = async (source, target) => {
  const dirs = await readDir('**/*.*', {
    cwd: source,
    nosort: true,
    dot: true,
  })
  await Promise.all(
    dirs.map(async (dir) => {
      const from = path.resolve(source, dir)
      const to = path.resolve(target, dir)
      await makeDir(path.dirname(to))
      await copyFile(from, to)
    }),
  )
}

export const cleanDir = (pattern, options) => {
  return new Promise((resolve, reject) => {
    return rimraf(
      pattern,
      { glob: options },
      (err, result) => {
        return (err
          ? reject(err)
          : resolve(result)
        )
      },
    )
  },
  )
}

export default {
  readFile,
  writeFile,
  renameFile,
  copyFile,
  readDir,
  makeDir,
  copyDir,
  moveDir,
  cleanDir,
}
