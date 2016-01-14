var pushClient = require('./client');

// Connect to the push backend
pushClient.connect('redis://localhost:6379/1');

// Send a push notification to a channel
pushClient.send('wcsg.match.crovsbra.goals', {
  payload: {},
  alert: 'New game',
  badge: 3,
  sound: 'jingle',
  topic: 'something'
});
