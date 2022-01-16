const fs = require('fs')
const path = require('path')

function getSubFolders(folderPath) {
  return fs.readdirSync(folderPath)
    .map((dirName) => {
      return path.join(folderPath, dirName)
    })
    .filter((subpath) => {
      return fs.lstatSync(subpath).isDirectory()
    })
}

function getPackagesPaths(repositoryRootPath) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const packageInfo = require(path.join(repositoryRootPath, 'package.json'))
  const { workspaces } = packageInfo
  const result = []

  workspaces.forEach((workspace) => {
    const isWildcardExist = workspace.endsWith('/*')
    const workspacePath = isWildcardExist
      ? workspace.substring(0, workspace.length - 2)
      : workspace
    const fullPath = path.join(repositoryRootPath, workspacePath)

    if (isWildcardExist) {
      result.push(...getSubFolders(fullPath))
    } else {
      result.push(fullPath)
    }
  })

  return result
}

module.exports = getPackagesPaths
