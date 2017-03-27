"use strict";

module.change_code = 1;

var alexa = require('alexa-app');
// var controller = require('node-milight-promise');

var app = new alexa.app('lights');

app.rooms = {
    "all": 0,
    "every": 0,
    "front room": 1,
    "lounge": 1,
    "living room": 1,
    "office": 2,
    "study": 2,
    "den": 2,
    "wolf den": 2,
    "porch": 3,
    "outside": 3,
    "door": 3,
    "bedroom": 4,
    "closet": 4,
    "bed": 4
};

app.launch(function(req, res) {
    var sample = [
        "turn on the light in the office",
        "switch on the outside light",
        "illuminate the light on the porch",
        "turn off the light in the den",
        "switch off the lounge light",
        "deluminate the light in the study",
        "brighten the office light to 15",
        "dim the porch light to 15",
        "brighten the light in the lounge to 19",
        "set brightness of the den to 19",
        "set luminosity of the den light to 6"
    ];

    var rand = sample[Math.floor(Math.random() * sample.length)];
    res.say("what would you like me to do");
    res.say("here is an example of something to say");
    res.say(rand);
});

app.intent(
    'HelloWorld', 
    {
        "slots": {
            "NAME": "AMAZON.US_FIRST_NAME"
        },
        "utterances": [
            "my {name's|name is} {-|NAME}"
        ]
    },
    function(req,res) {
        res.say("your name is " + req.slot("NAME"));
    });

app.intent(
    'LightOn', 
    {
        "slots": {
            "ROOM": "RoomType"
        },
        "utterances": [
            "{|to} {turn on|switch on} {|the} light {|for|in|on} {|the} {-|ROOM}",
            "{|to} {turn on|switch on|illuminate} {|the} {-|ROOM} light",
            "{|to} let there be light {in|on|for} {|the} {-|ROOM}",
            "{|to} illuminate {|the} {-|ROOM}"
        ]
    },
    function(req,res) {
        if (app.rooms[req.slot("ROOM")] == undefined) {
            res.say("sorry i did not understand which light you meant");
            return;
        }

        res.say("turning on the " + req.slot("ROOM") + " light");
        res.say("group" + app.rooms[req.slot("ROOM")]);
    });

app.intent(
    'LightOff', 
    {
        "slots": {
            "ROOM": "RoomType"
        },
        "utterances": [
            "{|to} {turn off|switch off} {|the} light {|for|in|on} {|the} {-|ROOM}",
            "{|to} {turn off|switch off|illuminate} {|the} {-|ROOM} light",
            "{|to} deluminate {|the} {-|ROOM}"
        ]
    },
    function(req,res) {
        if (app.rooms[req.slot("ROOM")] == undefined) {
            res.say("sorry i did not understand which light you meant");
            return;
        }

        res.say("turning off the " + req.slot("ROOM") + " light");
        res.say("group" + app.rooms[req.slot("ROOM")]);
    });

app.intent(
    'Brightness', 
    {
        "slots": {
            "ROOM": "RoomType",
            "BRIGHT": "AMAZON.NUMBER",
        },
        "utterances": [
            "{|to} {brighten|dim} {|the} {-|ROOM} {|light} to {-|BRIGHT}",
            "{|to} {brighten|dim} {|the} light {for|in|on} {|the} {-|ROOM} to {-|BRIGHT}",
            "{|to} set {|the} {brightness|luminosity} of {|the} {-|ROOM} {|light} to {-|BRIGHT}",
            "{|to} set {|the} {brightness|luminosity} of {|the} light {for|in|on} {|the} {-|ROOM} to {-|BRIGHT}"            
        ]
    },
    function(req,res) {
        if (app.rooms[req.slot("ROOM")] == undefined) {
            res.say("sorry i did not understand which light you meant");
            return;
        }

        res.say("setting luminosity of " + req.slot("ROOM") + " light to " + req.slot("BRIGHT"));
        res.say("group" + app.rooms[req.slot("ROOM")]);
    });

module.exports = app;