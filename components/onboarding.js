var debug = require('debug')('botkit:onboarding');

module.exports = function (controller) {

    controller.on('onboard', function (bot) {

        debug('Starting an onboarding experience!');

        bot.startPrivateConversation({user: bot.config.createdBy}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
              bot.reply(convo, {
                attachments:[
                    {
                      fallback: "Hello, I’m your SlackPal! :wave: \n\n\n :money_with_wings: Message me your receipts and I will handling all the bill splitting and payments.",
                      pretext: ":wave: Hello, I’m your SlackPal! :wave: \n\n\n :money_with_wings: Message me your receipts and I will handling all the bill splitting and payments. \n🤝Introduce me to your team:",
                      title: "Feel free to paste this message in #general",
                      text: "Hi! I’ve just added SlackPal to this workspace—it’s a slack bot that will handle payments whenever you need to split the bill. Next time you pick up the tab, just direct message @slackpal your receipt to save you the hassle.",
                      color: "#7CD197"
                    }
                ]
              });
            }
        });
    });

}
