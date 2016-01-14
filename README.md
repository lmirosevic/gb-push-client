# gb-push-client ![Version](https://img.shields.io/npm/v/gb-push-client.svg?style=flat)&nbsp;![License](https://img.shields.io/badge/license-Apache_2-green.svg?style=flat)

Service interface library to Goonbee's simple push service. This is the component which you use to send push notifications to your subscribers.

Usage
------------


First require the push library:

```javascript
var push = require('gb-push-client');
```

Then connect to the push backend:

```javascript
push.connect('redis://localhost:6379/1');
```

And then simply send you push notifications to a channel. The service will take care of addressing, delivery, push tokens, and everything else. The messages will be delivered to all subscribers for that channel, across platforms (iOS & Android).

```javascript
push.send('some.great.channel', {
  payload: {...},
  alert: 'New game',
  badge: 3,
  sound: 'jingle',
  topic: 'something'
});
```

The concept of a channel is a powerful yet simple addressing method. You can have multiple users subscribe to the same channel for broadcast style notifications, e.g. a `news` channel and this notification will then be delivered to all users subscribed to that channel. On the other hand for 1:1 style notifications: your users subscribe on their own individual private channels, which might be their userID or email address, and messages sent to those channels will then only be delivered to them.

On the client app side (the app receiving the push notifications), you just have to subscribe to one or more channels and the library will take care of everything else, including (platform specific) token registration.

The usage is the same. For a news broadcast message:
```javascript
push.send('news', {
  payload: {...},
  alert: 'New offers available!'
});
```

For a private message (in this case the user subscribed to a channel corresponding to their username `lmirosevic`, and we've namespace the channel to avoid potential clashes with other types of channels):
```javascript
push.send('user.lmirosevic', {
  payload: {...},
  alert: 'Hi Luka'
});
```

The payload can be any custom JSON data that your application requires.

Copyright & License
------------

Copyright 2016 Goonbee

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
