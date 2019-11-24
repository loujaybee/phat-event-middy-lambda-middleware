const PhatEvent = require('phat-event')

module.exports = options => ({
  before: (handler, next) => {
    const phatEvent = new PhatEvent()
    handler.context.phatEvent = phatEvent
    phatEvent.configure(options)
    phatEvent.addKey('event', handler.event)
    phatEvent.addKey('context', handler.context)
    next()
  },
  after: (handler, next) => {
    handler.context.phatEvent.addKey('success', true)
    handler.context.phatEvent.emit()
    next()
  },
  onError: handler => {
    handler.context.phatEvent.addKey('error', handler.error)
    handler.context.phatEvent.addKey('success', false)
    handler.context.phatEvent.emit()
    throw handler.error
  }
})
