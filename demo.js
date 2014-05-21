var pushClient = require('./client');

// Connect to redis resque
pushClient.connect('redis://localhost:6379/1');

// Send a push notification on a channel to all subscribers
pushClient.send('wcsg.match.crovsbra.goals', {
  payload: {},
  alert: 'New game',
  badge: 3,
  sound: 'jingle',
  topic: 'something'
});
