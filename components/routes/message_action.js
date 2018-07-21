var debug = require('debug')('botkit:incoming_webhooks');


module.exports = function(webserver, controller) {

    debug('Configured /slack/receive url');
    webserver.post('/slack/message_action', function(req, res) {

        // NOTE: we should enforce the token check here

        // respond to Slack that the webhook has been received.
        res.status(200);

        console.log("QQQQQQQQQQQQQQQQ")
        // console.log(res)
        // console.log(res.req)
        // console.log(res.body)
        // console.log(res.req.body.payload)
        //
        // for (var i in res.req.body) {
        //     console.log(i)
        // }

        // channel = res.req.body.payload.channel.id
        // user = res.req.body.payload.user.id
        // selected = res.req.body.payload.selected_options.value
        //
        // require('../server.js').webapi.chat.postMessage({'channel':channel, 'text': '<@' + user + '> selected ' + selected}, function(err, res) {
        //     console.log(res)
        // })

        // Now, pass the webhook into be processed
        controller.handleWebhookPayload(req, res);

    });

}
