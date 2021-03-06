var env = require('node-env-file');
env(__dirname + '/.env');

const { WebClient } = require('@slack/client');
const web = new WebClient(process.env.SLACK_ACCESS);


if (!process.env.SLACK_CLIENT_ID || !process.env.SLACK_CLIENT_SECRET|| !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  // usage_tip();
  process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    // debug: true,
    scopes: ['bot']
};
console.log(process.env.SLACK_CLIENT_ID)
console.log(process.env.SLACK_CLIENT_SECRET)
console.log(web.users.list)


bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});

module.exports =
    {
        getusers: function (conversationId) {
            let users = [];
            const limit = 200;

            return new Promise((resolve, reject) => {
              const pageLoaded = (res) => {
                users = users.concat(res.members);

                if (res.response_metadata && res.response_metadata.next_cursor) {
                  web.conversations.members({ channel: conversationId, limit, cursor: res.response_metadata.next_cursor })
                    .then(pageLoaded)
                    .catch(reject);
                } else {
                  resolve(users);
                }
              };

              web.conversations.members({ channel: conversationId, limit })
                .then(pageLoaded)
                .catch(reject);
            });
        },
        web: web,
        slackbotid: 'UBU3TL8P3'
    }
