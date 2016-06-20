'use strict'

let debug = require('debug')('mako-html')
let defaults = require('defaults')
let isUrl = require('is-url')
let jsdom = require('jsdom')
let path = require('path')

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
    let document = jsdom.jsdom(file.contents.toString())
    let tree = build.tree

    if (config.js) {
      Array.from(document.querySelectorAll('script[src]'))
        .filter(script => !isUrl(script.src))
        .forEach(script => addDependency(script.src))
    }

    if (config.css) {
      Array.from(document.querySelectorAll('link[rel=stylesheet]'))
        .filter(link => !isUrl(link.href))
        .forEach(link => addDependency(link.href))
    }

    function addDependency (rel) {
      let dep = path.resolve(file.dirname, rel)
      let depFile = tree.findFile(dep)
      if (!depFile) depFile = tree.addFile(dep)
      file.addDependency(depFile)
    }
  }
}
