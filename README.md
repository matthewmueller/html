# mako-html

> A mako plugin bundle for parsing HTML files for other front-end asset dependencies.

[![npm version](https://img.shields.io/npm/v/mako-html.svg)](https://www.npmjs.com/package/mako-html)
[![build status](https://img.shields.io/travis/makojs/html.svg)](https://travis-ci.org/makojs/html)
[![coverage](https://img.shields.io/coveralls/makojs/html.svg)](https://coveralls.io/github/makojs/html)
[![npm dependencies](https://img.shields.io/david/makojs/html.svg)](https://david-dm.org/makojs/html)
[![npm dev dependencies](https://img.shields.io/david/dev/makojs/html.svg)](https://david-dm.org/makojs/html#info=devDependencies)
[![code style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Purpose

Parses an HTML file (using [jsdom](https://github.com/tmpvar/jsdom)), adding to the dependency tree:

 - CSS
   - query the DOM for `link[rel=stylesheet]`
   - filter out absolute urls
   - resolve the `href` relative to the html file's directory
 - JS
   - query the DOM for `script[src]`
   - filter out absolute urls
   - resolve the `src` relative to the html file's directory

This plugin only adds the aforementioned files to the dependency tree, the rest of the build logic is deferred
to other plugins. (eg: [mako-js](https://github.com/makojs/js), [mako-css](https://github.com/makojs/css))

## API

### html([options])

Initializes the plugin, available `options` include:

 - `css` whether or not to parse CSS dependencies (default: `true`)
 - `js` whether or not to parse JS dependencies (default: `true`)
