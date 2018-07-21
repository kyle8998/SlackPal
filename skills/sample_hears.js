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

    controller.hears(['^make chat$'], 'direct_message,direct_mention', function(bot, message) {

        creator_id = message.user

        bot.api.mpim.open({'users':'UBGETPENP,UBGLM9Z26,UBGMVP22H'}, function(err, res) {
            console.log(res)
            console.log(res.group.id)
            group_id = res.group.id

            bot.api.chat.postMessage({'channel':group_id, 'text': ':wave: Hello, it looks like <@'+creator_id+'> picked up the tab for a recent purchase. \n\n\n When prompted, please select the item that belongs to you so I can help you arrange the payment.'}, function(err, res) {
                console.log(res)
            })
        })
        //
        // require('../server.js').web.mpim.open({'users':'UBGETPENP,UBGLM9Z26,UBGMVP22H'}).then((res) => {
        //     console.log(res)
        //     res.group.id
        // })
        bot.reply(message, "ok opening chat")
    });



};
