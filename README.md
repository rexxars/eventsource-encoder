# eventsource-encoder

[![npm version](https://img.shields.io/npm/v/eventsource-encoder.svg?style=flat-square)](https://www.npmjs.com/package/eventsource-encoder)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/eventsource-encoder?style=flat-square)](https://bundlephobia.com/result?p=eventsource-encoder)[![npm weekly downloads](https://img.shields.io/npm/dw/eventsource-encoder.svg?style=flat-square)](https://www.npmjs.com/package/eventsource-encoder)

An encoding utility package for [server-sent events/eventsource](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events).

While the protocol is very simple in theory, there are some common pitfalls - in particular handling of newlines. This package makes it extremely simple to implement a Server-Sent Events endpoint with well-formed messages.

## Installation

```bash
npm install --save eventsource-encoder
```

## Usage

```js
import {createServer} from 'node:http'
import {encode} from 'eventsource-encoder'

createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  })

  for (let id = 0; id < 100; id++) {
    res.write(
      encode({
        id,
        event: 'time',
        data: new Date().toISOString(),
      }),
    )
  }
})
```

## Encoding data chunks only

If you want to encode only the data part of the event, you can use the `encodeData` function:

```js
import {encodeData} from 'eventsource-encoder'

console.log(encodeData('Hello, world!')) // data: Hello, world!\n\n
console.log(encodeData('Hello\nworld!')) // data: Hello\ndata: world!\n\n
```

## Encoding comments

"Comments" in Server-Sent Events are lines that start with a `:` character. You can use the `encodeComment` function to encode comments. Note that most EventSource clients have no way of interacting with comments, but they can be useful for debugging or for keeping the connection alive with "heartbeats".

```js
import {encodeComment} from 'eventsource-encoder'

console.log(encodeComment('This is a comment')) // : This is a comment\n
console.log(encodeComment('This\nis\na\nmultiline\ncomment')) // : This\n: is\n: a\n: multiline\n: comment\n
```

## License

MIT © [Espen Hovlandsdal](https://espen.codes/)
