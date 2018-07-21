/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

// require('../server.js').getusers()
// web = require('../server.js').web

module.exports = function(controller) {

    controller.hears(['^hello$'], 'direct_message,direct_mention', function(bot, message) {
        console.log(message)
        message.event
        bot.reply(message, "Hi there, you're on workspace: " + message.team)
    });

    controller.hears(['^whoami$'], 'direct_message,direct_mention', function(bot, message) {
        bot.reply(message, "you are " + message.user)
    });

    controller.hears(['^do this$'], 'direct_message,direct_mention', function(bot, message) {
        bot.reply(message, "ok")
    });

    controller.hears(['^get users$'], 'direct_message,direct_mention', function(bot, message) {
        // console.log(require('../server.js').getusers)
        // require('../server.js').getusers(message.channel).then(function(res) {
        //     console.log(res)
        // })
        require('../server.js').web.users.list().then((res) => {
            console.log(res)
        })
        bot.reply(message, "ok")
    });

    controller.hears(['^users here$'], 'direct_message,direct_mention', function(bot, message) {
        // console.log(require('../server.js').getusers)
        // require('../server.js').getusers(message.channel).then(function(res) {
        //     console.log(res)
        // })
        require('../server.js').web.channels.info({'channel': 'CBU2AD7RB'}).then((res) => {
            console.log(res)
            members = res.channel.members
            bot.reply(message, "Here is a list of your ids: " + members.join(","))
        })
        // bot.reply(message, "ok")
    });

    controller.hears(['^split bill$'], 'direct_message,direct_mention', function(bot, message) {
        creator_id = message.user
        channel = message.channel

        bot.api.chat.postMessage({
    "channel": channel,
    "text": "Got it!",
    "response_type": "in_channel",
    "attachments": [
        {
            "text": "Who are you splitting the bill with?",
            "fallback": "Let me know who you split the bill with",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "select_simple_1234",
            "actions": [
                {
                    "name": "participants",
                    "text": "Who are the participants?",
                    "type": "select",
                    "data_source": "users"
                }
            ]
        },
        {
            "fallback": "You should be able to finish adding process",
            "callback_id": "is_done",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "add_person",
                    "text": "Everyone is added",
                    "type": "button",
                    "value": "done"
                }
            ]
        }
    ]
}, function(err, res) {
            console.log(res)

        })
    })

    controller.hears(['^begin$'], 'direct_message,direct_mention', function(bot, message) {

        creator_id = message.user

        bot.api.mpim.open({'users':'UBGETPENP,UBGLM9Z26,UBGMVP22H'}, function(err, res) {
            console.log(res)
            console.log(res.group.id)
            group_id = res.group.id

            bot.api.chat.postMessage({'channel':group_id, 'text': ':wave: Hello, it looks like <@'+creator_id+'> picked up the tab for a recent purchase. \n\n\n When prompted, please select the item that belongs to you so I can help you arrange the payment.'}, function(err, res) {
                console.log(res)
                choices = ["x", "y", "z"]
                bot.api.chat.postMessage(
                    {
                        'channel':group_id,
                        'text': '',
                        "attachments": [
        {
            "type": "interactive_message",
            "text": ":ballot_box_with_check:  Please select the item that belongs to you:",
            "fallback": "Let me know who you split the bill with",
            "attachment_type": "default",
            "callback_id": "select_simple_1234",
            "actions": [
                    {
                        "name": "games_list",
                        "text": "Pick a game...",
                        "type": "select",
                        "options": [
                            {
                                "text": "Chess",
                                "value": "chess"
                            },
                            {
                                "text": "Falken's Maze",
                                "value": "maze"
                            },
                            {
                                "text": "Global Thermonuclear War",
                                "value": "war"
                            }
                        ]
                    }
                ]
        }]
                    }, function(err, res) {
                    console.log(res)

                })
            })
        })
        //
        // require('../server.js').web.mpim.open({'users':'UBGETPENP,UBGLM9Z26,UBGMVP22H'}).then((res) => {
        //     console.log(res)
        //     res.group.id
        // })
        bot.reply(message, "ok opening chat")
    });


    controller.on('interactive_message_callback', function(bot, message) {

        console.log("TESTING")
        console.log(message)

        if (message.original_message.text == 'Your receipt has been processed!') {
            selected = message.actions[0].selected_options[0].value
            bot.reply(message, 'You added <@' + selected + '>' )

        }
        else if  (message.original_message.text == '') {

            selected = message.actions[0].selected_options[0].value
            userID = message.user
            channel = message.channel

            console.log(selected)
            console.log(userID)
            console.log(channel)

        // check message.actions and message.callback_id to see what action to take...

            bot.reply(message, '<@' + userID + '> selected ' + selected)
        }
        else if  (message.original_message.text == 'Got it!') {
            // Selecting people
            if ('selected_options' in message.actions[0]) {
                selected = message.actions[0].selected_options[0].value
                bot.reply(message, 'You added <@' + selected + '>' )
            }
            // Completed
            else {
                bot.reply(message, 'I will create a chat for your group!' )
            }
            // bot.reply(message, 'You added <@' + selected + '>' )
        }

    // bot.replyInteractive(message, {
    //     text: '...',
    //     attachments: [
    //         {
    //             title: 'My buttons',
    //             callback_id: '123',
    //             attachment_type: 'default',
    //             actions: [
    //                 {
    //                     "name":"yes",
    //                     "text": "Yes!",
    //                     "value": "yes",
    //                     "type": "button",
    //                 },
    //                 {
    //                    "text": "No!",
    //                     "name": "no",
    //                     "value": "delete",
    //                     "style": "danger",
    //                     "type": "button",
    //                     "confirm": {
    //                       "title": "Are you sure?",
    //                       "text": "This will do something!",
    //                       "ok_text": "Yes",
    //                       "dismiss_text": "No"
    //                     }
    //                 }
    //             ]
    //         }
    //     ]
    // });
// user =
// console.log(<@user)
});

controller.on('file_share', function(bot, message) {
    console.log("sharing file")

    // check message.actions and message.callback_id to see what action to take...
    var url = message.file.url_private;

    bot.reply(message, {
        text: 'Your receipt has been processed!',
        attachments: [
          {
            "text": "Who are you splitting the bill with?",
            "fallback": "Let me know who you split the bill with",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "select_simple_1234",
            "actions": [
                {
                    "name": "participants",
                    "text": "Who are the participants?",
                    "type": "select",
                    "data_source": "users"
              }
          ]
      }
        ]
    });

});

};
