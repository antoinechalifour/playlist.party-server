const { EVENT_TYPE } = require('./Event')

module.exports = class UserLeftPartyEventHandler {
  constructor (io) {
    this.io = io
  }

  listenTo () {
    return EVENT_TYPE
  }

  handle (event) {
    console.log('-------------------------------------------')
    console.log('UserLeftPartyEventHandler', event)
    console.log('-------------------------------------------')
  }
}
