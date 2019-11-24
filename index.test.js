const mockAddKey = jest.fn()
const mockConfigure = jest.fn()
const mockEmit = jest.fn()
const mockPhatEvent = jest.fn(() => ({
  addKey: mockAddKey,
  configure: mockConfigure,
  emit: mockEmit
}))

beforeEach(() => {
  mockAddKey.mockReset()
  mockConfigure.mockReset()
  mockEmit.mockReset()
})

jest.mock('phat-event', () => mockPhatEvent)
const middleware = require('./')

test('.before', () => {
  const args = {}
  const { before } = middleware(args)
  const handler = { context: {}, event: {} }
  const callback = jest.fn()
  before(handler, callback)
  expect(handler.context.phatEvent).toEqual(new mockPhatEvent())
  expect(mockConfigure).toHaveBeenCalledWith(args)
  expect(mockAddKey).toHaveBeenCalledWith('event', handler.event)
  expect(mockAddKey).toHaveBeenCalledWith('context', handler.context)
  expect(mockAddKey).toHaveBeenCalledTimes(2)
  expect(callback).toHaveBeenCalled()
})

test('.after', () => {
  const args = {}
  const { after } = middleware(args)
  const handler = { context: { phatEvent: new mockPhatEvent() }, event: {} }
  const callback = jest.fn()
  after(handler, callback)
  expect(mockAddKey).toHaveBeenCalledWith('success', true)
  expect(mockAddKey).toHaveBeenCalledTimes(1)
  expect(mockEmit).toHaveBeenCalled()
  expect(callback).toHaveBeenCalled()
})

test('.onError', () => {
  const args = {}
  const { onError } = middleware(args)
  const handler = { context: { phatEvent: new mockPhatEvent() }, event: {}, error: {} }
  const callback = jest.fn()
  expect(() => onError(handler, callback)).toThrow()
  expect(mockAddKey).toHaveBeenCalledWith('error', handler.error)
  expect(mockAddKey).toHaveBeenCalledWith('success', false)
  expect(mockAddKey).toHaveBeenCalledTimes(2)
  expect(mockEmit).toHaveBeenCalled()
  expect(() => onError(handler, callback)).toThrow()
})
