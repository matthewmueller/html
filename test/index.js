/* eslint-env mocha */

'use strict'

let buffer = require('mako-buffer')
let chai = require('chai')
let html = require('..')
let mako = require('mako')
let path = require('path')

chai.use(require('chai-as-promised'))
let assert = chai.assert
let fixture = path.resolve.bind(path, __dirname, 'fixtures')

describe('html plugin', function () {
  it('should detect js dependencies', function () {
    let root = fixture('simple')
    let entry = fixture('simple/index.html')
    let js = fixture('simple/index.js')
    let builder = mako({ root }).use(plugins())

    return builder.build(entry).then(function (build) {
      let htmlFile = build.tree.findFile(entry)
      let jsFile = build.tree.findFile(js)
      assert.isTrue(htmlFile.hasDependency(jsFile))
    })
  })

  it('should detect css dependencies', function () {
    let root = fixture('simple')
    let entry = fixture('simple/index.html')
    let css = fixture('simple/index.css')
    let builder = mako({ root }).use(plugins())

    return builder.build(entry).then(function (build) {
      let htmlFile = build.tree.findFile(entry)
      let cssFile = build.tree.findFile(css)
      assert.isTrue(htmlFile.hasDependency(cssFile))
    })
  })

  it('should ignore absolute urls', function () {
    let root = fixture('absolute-urls')
    let entry = fixture('absolute-urls/index.html')
    let builder = mako({ root }).use(plugins())

    return builder.build(entry).then(function (build) {
      let file = build.tree.findFile(entry)
      assert.lengthOf(file.dependencies(), 0)
    })
  })

  context('with options', function () {
    describe('.css', function () {
      it('should not add css dependencies', function () {
        let root = fixture('simple')
        let entry = fixture('simple/index.html')
        let css = fixture('simple/index.css')
        let builder = mako({ root }).use(plugins({ css: false }))

        return builder.build(entry).then(function (build) {
          let htmlFile = build.tree.findFile(entry)
          let cssFile = build.tree.findFile(css)
          assert.isFalse(htmlFile.hasDependency(cssFile))
        })
      })
    })

    describe('.js', function () {
      it('should not add js dependencies', function () {
        let root = fixture('simple')
        let entry = fixture('simple/index.html')
        let js = fixture('simple/index.js')
        let builder = mako({ root }).use(plugins({ js: false }))

        return builder.build(entry).then(function (build) {
          let htmlFile = build.tree.findFile(entry)
          let jsFile = build.tree.findFile(js)
          assert.isFalse(htmlFile.hasDependency(jsFile))
        })
      })
    })
  })
})

function plugins (options) {
  return [ buffer('html'), html(options) ]
}
