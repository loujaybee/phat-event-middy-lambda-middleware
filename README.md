# phat-event-middy-lambda-middleware

A middlware in middy format that bootstraps phatEvent in an opinionated way. 

For more about phat-event check out [phat-event](https://github.com/loujaybee/phat-event)

What it does:

* Adds lambda "event" object to phat event
* Adds lambda "context" object to phat event
* Emits the log event on failure, or success
* Binds the error to the logEvent on failure
* Binds phatEvent instance to context, for re-use throughout the lambda

### Get Started


```javascript
const middy = require('middy')
const phatEventMiddleware = require('phat-event-middy-lambda-middleware');
const { logger } = require('./utils/logger')

const originalHandler = async function (event, _, callback) {
  callback(null, true)
}

const handler = middy(originalHandler).use(phatEventMiddleware({ log: logger }))

module.exports = { handler }

```

### onSuccess

The resultant phat event is: 

```javascript
{
  event: ...,
  context: ...,
  success: true
}
```

### onFailure

The resultant phat event is: 

```javascript
{
  event: ...,
  context: ...,
  success: false
}
```
