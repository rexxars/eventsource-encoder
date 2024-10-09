/**
 * An EventSource message to send
 *
 * @public
 */
export interface EventSourceMessage {
  /**
   * The data to send to the client. Always a string.
   */
  data: string

  /**
   * The event type. Browsers treat `undefined` as `"message"`.
   */
  event?: string

  /**
   * ID of the message, used to set `Last-Event-ID` header on subsequent reconnects.
   * Note that while you can theoretically send only an ID (eg no event/data), this
   * does not trigger any event - but does (on most clients) update the last event ID.
   */
  id?: string | number

  /**
   * Tells the client how many milliseconds to wait before retrying on disconnect.
   */
  retry?: number
}

/**
 * An eventsource "comment" - a line starting with `:`.
 *
 * Note that comments are not readable by most EventSource clients, but can be useful for
 * debugging and to keep the connection alive - for instance by sending "heartbeats" or similar.
 *
 * @public
 */
export interface EventSourceComment {
  /**
   * The contents of the comment
   */
  comment: string
}

/**
 * A "chunk" is minimum allowable unit to send to the client. While a message is usually
 * what you want, there are cases where sending the retry interval separately from a
 * message makes sense, for instance.
 *
 * @public
 */
export type EventSourceChunk =
  | EventSourceMessage
  | Pick<Required<EventSourceMessage>, 'id'>
  | Pick<Required<EventSourceMessage>, 'retry'>
  | EventSourceComment
