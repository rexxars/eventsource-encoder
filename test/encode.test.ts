import {describe, expect} from 'vitest'

import {encode, encodeComment, encodeData} from '../src'

describe('encode()', (test) => {
  test('data', () => {
    expect(encode({data: 'foo'})).toEqual('data: foo\n\n')
  })

  test('data + event', () => {
    expect(encode({event: 'foo', data: 'bar'})).toEqual('event: foo\ndata: bar\n\n')
  })

  test('data + event + retry', () => {
    expect(encode({event: 'foo', data: 'bar', retry: 15000})).toEqual(
      'event: foo\nretry: 15000\ndata: bar\n\n',
    )
  })

  test('data + event + retry + id', () => {
    expect(encode({event: 'foo', data: 'bar', retry: 15000, id: 1337})).toEqual(
      'event: foo\nretry: 15000\nid: 1337\ndata: bar\n\n',
    )
  })

  test('multiline data', () => {
    expect(encode({data: 'what\nto\ndo'})).toEqual('data: what\ndata: to\ndata: do\n\n')
  })

  test('multiline data, empty/trailing lines', () => {
    expect(encode({data: 'what\n\nto\ndo\n\n'})).toEqual(
      'data: what\ndata: \ndata: to\ndata: do\ndata: \ndata: \n\n',
    )
  })

  test('comment', () => {
    expect(encode({comment: 'nei dette'})).toEqual(': nei dette\n\n')
  })

  test('comment with newlines', () => {
    expect(encode({comment: 'nei\ndette'})).toEqual(': nei\n: dette\n\n')
  })

  test('comment with newlines and carriage returns', () => {
    expect(encode({comment: 'nei\r\ndette'})).toEqual(': nei\n: dette\n\n')
  })
})

describe('encodeData()', (test) => {
  test('basic', () => {
    expect(encodeData('okay cool')).toEqual('data: okay cool\n\n')
  })

  test('multiline data', () => {
    expect(encodeData('what\nto\ndo')).toEqual('data: what\ndata: to\ndata: do\n\n')
  })

  test('multiline data, empty/trailing lines', () => {
    expect(encodeData('what\n\nto\ndo\n\n')).toEqual(
      'data: what\ndata: \ndata: to\ndata: do\ndata: \ndata: \n\n',
    )
  })
})

describe('encodeComment()', (test) => {
  test('basic', () => {
    expect(encodeComment('nei dette')).toEqual(': nei dette\n\n')
  })

  test('with newlines', () => {
    expect(encodeComment('nei\ndette')).toEqual(': nei\n: dette\n\n')
  })

  test('with newlines and carriage returns', () => {
    expect(encodeComment('nei\r\ndette')).toEqual(': nei\n: dette\n\n')
  })
})
