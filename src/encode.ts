import type {EventSourceChunk, EventSourceMessage} from './types'

const NEWLINES_RE = /(\r\n|\r|\n)/g

/**
 * Encode an EventSource message or comment
 *
 * @param chunk - The message/comment to encode
 * @returns A well-formatted string ready to be sent to a client
 * @public
 */
export function encode(chunk: EventSourceChunk): string {
  return 'comment' in chunk ? encodeComment(chunk.comment) : encodeMessage(chunk)
}

/**
 * Encode the given text as a chunk of EventSource data. Note that newlines are normalized to
 * line feed characters (`\n`) - any carriage return (`\r`) are lost in the process.
 *
 * @param text - The text to encode. Each line starts with a `data: `-prefix.
 * @returns A well-formed data-prefixed EventSource chunk
 * @public
 */
export function encodeData(text: string): string {
  const data = `${text}`.replace(NEWLINES_RE, '\n')
  const lines = data.split(/\n/)

  let line = ''
  let output = ''

  for (let i = 0, numLines = lines.length; i < numLines; ++i) {
    line = lines[i]

    output += `data: ${line}`
    output += i + 1 === numLines ? '\n\n' : '\n'
  }

  return output
}

/**
 * Encode a comment as a well-formed EventSource "comment".
 * Each line will be prefixed with a comment prefix, eg `:`.
 *
 * @param comment - The comment to encode
 * @returns A well-formed EventSource "comment"
 * @public
 */
export function encodeComment(comment: string): string {
  return `: ${comment.replace(NEWLINES_RE, '\n: ')}\n\n`
}

function encodeMessage(message: Partial<EventSourceMessage>): string {
  let output = ''
  if (message.event) {
    output += `event: ${message.event}\n`
  }

  if (typeof message.retry === 'number' && Number.isFinite(message.retry)) {
    output += `retry: ${message.retry}\n`
  }

  if (typeof message.id === 'string' || typeof message.id === 'number') {
    output += `id: ${message.id}\n`
  }

  if (typeof message.data === 'string') {
    output += encodeData(message.data)
  } else if (output) {
    // `encodeData()` adds chunk ending itself, so we only need to add newlines here
    // if the chunk does _not_ contain any data.
    output += '\n\n'
  }

  return output
}
