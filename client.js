//
//  client.js
//  gb-push-client
//
//  Created by Luka Mirosevic on 21/05/2014.
//  Copyright (c) 2014 Goonbee. All rights reserved.
//

var nconf = require('nconf'),
    coffeeResque = require('coffee-resque'),
    url = require('url');

/* Main code */

var Client = function() {
  this.connect = function(redisURL) {
    var parsedUrl = url.parse(redisURL);
    var connectionOptions = {};
    if (!_.isNull(parsedUrl.hostname)) connectionOptions.host = parsedUrl.hostname;
    if (!_.isNull(parsedUrl.port)) connectionOptions.port = parsedUrl.port;
    if (!_.isNull(parsedUrl.auth)) connectionOptions.password = parsedUrl.auth.split(':')[1];
    if (!_.isNull(parsedUrl.pathname)) connectionOptions.database = parsedUrl.pathname.split('/')[1];
    console.log('Attempting connection to Redis for notification egress...');
    var resque = coffeeResque.connect(connectionOptions);
    resque.redis.on('error', function(err) {
        console.error('Error occured on notification egress Redis', err);
    });
    resque.redis.on('reconnecting', function(err) {
      console.log('Attempting reconnection to Redis for notification egress...');
    });
    resque.redis.retry_max_delay = 1000;

    return resque.redis;
  };

  this.send = function(channel, notification, callback) {
    toolbox.requiredArguments(channel, notification, callback);
    toolbox.requiredVariables(notification.targets, notification.alert, notification.payload);

    // convert the input into a message object that the push service expects
    var translatedNotification = {};
    translatedNotification.targets = notification.targets;
    translatedNotification.alert = notification.alert;
    translatedNotification.payload = notification.payload;
    if (!_.isUndefined(notification.badge)) translatedNotification.badge = notification.badge;
    if (!_.isUndefined(notification.sound)) translatedNotification.sound = notification.sound;
    if (!_.isUndefined(notification.topic)) translatedNotification.topic = notification.topic;
    var message = {
      channel: channel,
      notification: translatedNotification
    };
    
    // send the push off
    resque.enqueue(options.queue, 'PushJob', message, function(err, remainingJobs) {
      toolbox.callCallback(callback, err);
    });
  };
};
var client = module.exports = new Client();

// Payload format (egress)
//
// {
//   channel: 'wcsg.match.crovsbra.goals',
//   notification: {
//     payload: {},
//     alert: 'New game',
//     badge: 3,
//     sound: 'jingle',
//     topic: 'something'
//   }
// }
