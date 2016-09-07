/* eslint-env mocha */

'use strict'

let chai = require('chai')
let fs = require('fs')
let html = require('..')
let mako = require('mako')
let path = require('path')

chai.use(require('chai-as-promised'))
let assert = chai.assert
let fixture = path.resolve.bind(path, __dirname, 'fixtures')

describe('html plugin', function () {
  it('should detect js dependencies', function () {
    let runner = mako({ root: fixture('simple') }).use(html())
    let entry = runner.tree.addFile(fixture('simple/index.html'))
    entry.contents = fs.readFileSync(entry.path)

    return runner.build(entry).then(function (build) {
      let file = build.tree.findFile(entry.path)
      let deps = file.dependencies().filter(file => file.type === 'js')
      assert.lengthOf(deps, 1)
    })
  })

  it('should detect css dependencies', function () {
    let runner = mako({ root: fixture('simple') }).use(html())
    let entry = runner.tree.addFile(fixture('simple/index.html'))
    entry.contents = fs.readFileSync(entry.path)

    return runner.build(entry).then(function (build) {
      let file = build.tree.findFile(entry.path)
      let deps = file.dependencies().filter(file => file.type === 'css')
      assert.lengthOf(deps, 1)
    })
  })

  it('should ignore absolute urls', function () {
    let runner = mako({ root: fixture('absolute-urls') }).use(html())
    let entry = runner.tree.addFile(fixture('absolute-urls/index.html'))
    entry.contents = fs.readFileSync(entry.path)

    return runner.build(entry).then(function (build) {
      let file = build.tree.findFile(entry.path)
      assert.lengthOf(file.dependencies(), 0)
    })
  })

  it('should only add dependencies once', function () {
    let runner = mako({ root: fixture('duplicate') }).use(html())
    let entry = runner.tree.addFile(fixture('duplicate/index.html'))
    entry.contents = fs.readFileSync(entry.path)

    return runner.build(entry).then(function (build) {
      assert.equal(build.tree.size(), 3)
    })
  })

  context('with options', function () {
    describe('.css', function () {
      it('should not add css dependencies', function () {
        let runner = mako({ root: fixture('simple') }).use(html({ css: false }))
        let entry = runner.tree.addFile(fixture('simple/index.html'))
        entry.contents = fs.readFileSync(entry.path)

        return runner.build(entry).then(function (build) {
          let file = build.tree.findFile(entry.path)
          let deps = file.dependencies().filter(file => file.type === 'css')
          assert.lengthOf(deps, 0)
        })
      })
    })

    describe('.js', function () {
      it('should not add js dependencies', function () {
        let runner = mako({ root: fixture('simple') }).use(html({ js: false }))
        let entry = runner.tree.addFile(fixture('simple/index.html'))
        entry.contents = fs.readFileSync(entry.path)

        return runner.build(entry).then(function (build) {
          let file = build.tree.findFile(entry.path)
          let deps = file.dependencies().filter(file => file.type === 'js')
          assert.lengthOf(deps, 0)
        })
      })
    })
  })
})
