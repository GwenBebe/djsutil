# djsutil

## About <a name = "about"></a>

DJSUtil is a utility library used with discord.js. It has things like paginators, message prompts, and embed managers.

## Getting Started <a name = "getting_started"></a>

### Installing

```
$ npm install djsutil
```

```
$ yarn add djsutil
```

### Creating A Client

In order to use DJSUtil, you must create a DJSUtil client instead of a discord.js client. The DJSUtil client is identical in every way to the discord.js client, except for the added utilities.

```js
const djsutil = require('djsutil');

const client = new djsutil.Client({
    presence: {
        activity: {
            name: 'DJSUtil',
            type: 'PLAYING'
        }
    },
    color: {
        error: '#fc0356'
    },
    lang: {
        emojis: {
            stop: '726264256122585223'
        }
    }
});

client.login('token');
```

## Examples

### Paginators

---

```js
const items = ['Hello there!', 'Thanks for using DJSUtil!', 'I hope you find it useful!'];

const book = client.guis.books.new('Paginator Example', items, message.author, message.channel, 1, false, 'SUCCESS', message.guild);

book.init();
```

### Prompts

---

```js
const prompt = client.guis.prompts.new(message.author, message.channel, 'BASIC', message.guild);

const response = await prompt.question('What channel would you like to choose?', 'This is the channel I will do the action towards.', {
    type: 'guildChannel',
    optional: false,
    timeout: 30000
});

if (!response) return;

console.log(response.id);
```

### Embeds

---

```js
const embed = client.embed.new('ERROR', true);

embed.setTitle('Uh Oh!');

embed.setDescription('You did something wrong!');

message.channel.send(embed);
```
