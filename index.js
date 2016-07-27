'use strict'

let debug = require('debug')('mako-html')
let defaults = require('defaults')
let extract = require('deps-html')
let isUrl = require('is-url')
let parse5 = require('parse5-utils')
let path = require('path')
let utils = require('mako-utils')

module.exports = function (options) {
  debug('initialize %j', options)
  let config = defaults(options, {
    css: true,
    js: true
  })

  return function html (mako) {
    mako.dependencies('html', dependencies)
  }

  function dependencies (file, build) {
    debug('parsing %s', utils.relative(file.path))
    let ast = parse5.parse(file.contents.toString())
    let deps = extract(ast)
    let tree = build.tree

    debug('%d dependencies found:', deps.length)
    deps
      .filter(inspectDependency)
      .forEach(addDependency)

    function addDependency (dep) {
      debug('+ %s (%s)', dep.path, dep.type)
      let abs = path.resolve(file.dirname, dep.path)
      let depFile = tree.findFile(abs)
      if (!depFile) depFile = tree.addFile(abs)
      file.addDependency(depFile)
    }
  }

  function inspectDependency (dep) {
    debug('> %s (%s)', dep.path, dep.type)
    if (isUrl(dep.path)) return false
    switch (dep.type) {
      case 'script': return config.js
      case 'stylesheet': return config.css
      default: return false
    }
  }
}
