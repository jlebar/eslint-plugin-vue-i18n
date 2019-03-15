/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-missing-keys')

const baseDir = './tests/fixtures/no-missing-keys/locales'
const resolve = file => `${baseDir}/${file}`

const settings = {
  'vue-i18n': {
    localeDir: `${baseDir}/*.json`
  }
}

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-missing-keys', rule, {
  valid: [{
    // basic key
    settings,
    code: `$t('hello')`
  }, {
    // nested key
    settings,
    code: `t('messages.nested.hello')`
  }, {
    // linked key
    settings,
    code: `$tc('messages.hello.link')`
  }, {
    // hypened key
    settings,
    code: `tc('hello-dio')`
  }, {
    // key like the message
    settings,
    code: `$t('hello {name}')`
  }, {
    // instance member
    settings,
    code: `i18n.t('hello {name}')`
  }, {
    // identifier
    settings,
    code: `$t(key)`
  }, {
    // using mustaches in template block
    settings,
    code: `<template>
      <p>{{ $t('hello') }}</p>
    </template>`
  }, {
    // using custom directive in template block
    settings,
    code: `<template>
      <p v-t="'hello'"></p>
    </template>`
  }],

  invalid: [{
    // basic
    settings,
    code: `$t('missing')`,
    errors: [
      `'missing' does not exist in '${resolve('en.json')}'`,
      `'missing' does not exist in '${resolve('ja.json')}'`
    ]
  }, {
    // using mustaches in template block
    settings,
    code: `<template>
      <p>{{ $t('missing') }}</p>
    </template>`,
    errors: [
      `'missing' does not exist in '${resolve('en.json')}'`,
      `'missing' does not exist in '${resolve('ja.json')}'`
    ]
  }, {
    // using custom directive in template block
    settings,
    code: `<template>
      <p v-t="'missing'"></p>
    </template>`,
    errors: [
      `'missing' does not exist in '${resolve('en.json')}'`,
      `'missing' does not exist in '${resolve('ja.json')}'`
    ]
  }, {
    // settings.vue-i18n.localeDir' error
    code: `$t('missing')`,
    errors: [
      `You need to 'localeDir' at 'settings. See the 'eslint-plugin-vue-i18n documentation`
    ]
  }]
})
