"use strict";

module.change_code = 1;

var alexa = require('alexa-app');
var Milight = require('node-milight-promise').MilightController;
var controlIP = "192.168.1.24";
var commands = require('node-milight-promise').commandsV6;

var app = new alexa.app('lights');

app.rooms = {
    "all": {type: "rgbw", zone: 0},
    "every": {type: "rgbw", zone: 0},
    "front room": {type: "rgbw", zone: 1},
    "lounge": {type: "rgbw", zone: 1},
    "living room": {type: "rgbw", zone: 1},
    "office": {type: "rgbw", zone: 2},
    "study": {type: "rgbw", zone: 2},
    "den": {type: "rgbw", zone: 2},
    "wolf den": {type: "rgbw", zone: 2},
    "porch": {type: "rgbw", zone: 3},
    "outside": {type: "rgbw", zone: 3},
    "door": {type: "rgbw", zone: 3},
    "bedroom": {type: "full", zone: 1},
    "closet": {type: "full", zone: 1},
    "bed": {type: "full", zone: 1},
    "bridge": {type: "bridge" },
    "hub": {type: "bridge" }
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
    res.say("what would you like me to do?");
    res.say("here is an example of something to say:");
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
        var room = app.rooms[req.slot("ROOM")];

        if (!room) {
            res.say("sorry, i did not understand which light you meant");
            return;
        }

        res.say("turning on the " + req.slot("ROOM") + " light");
        
        var light = new Milight({
            ip: controlIP,
            type: 'v6'
        });
        if (room.type == 'rgbw') light.sendCommands(commands.rgbw.on(room.zone));
        if (room.type == 'full') light.sendCommands(commands.fullColor.on(room.zone));
        if (room.type == 'bridge') light.sendCommands(commands.bridge.on());
    });

app.intent(
    'LightOff', 
    {
        "slots": {
            "ROOM": "RoomType"
        },
        "utterances": [
            "{|to} {turn off|switch off} {|the} light {|for|in|on} {|the} {-|ROOM}",
            "{|to} {turn off|switch off|deluminate} {|the} {-|ROOM} light",
            "{|to} deluminate {|the} {-|ROOM}",
            "{|to} {let|allow} {|the} darkness {|to} reign {|for|in|on} {|the} {-|ROOM}"
        ]
    },
    function(req,res) {
        var room = app.rooms[req.slot("ROOM")];
        if (room == undefined) {
            res.say("sorry, i did not understand which light you meant");
            return;
        }

        res.say("turning off the " + req.slot("ROOM") + " light");
        
        var light = new Milight({
            ip: controlIP,
            type: 'v6'
        });
        if (room.type == 'rgbw') light.sendCommands(commands.rgbw.off(room.zone));
        if (room.type == 'full') light.sendCommands(commands.fullColor.off(room.zone));
        if (room.type == 'bridge') light.sendCommands(commands.bridge.off());
    });

app.intent(
    'Brightness', 
    {
        "slots": {
            "ROOM": "RoomType",
            "BRIGHT": "AMAZON.NUMBER",
        },
        "utterances": [
            "{|to} {brighten|dim} {|the} {-|ROOM} {|light} to {-|BRIGHT} {|percent}",
            "{|to} {brighten|dim} {|the} light {for|in|on} {|the} {-|ROOM} to {-|BRIGHT} {|percent}",
            "{|to} set {|the} {brightness|luminosity} of {|the} {-|ROOM} {|light} to {-|BRIGHT} {|percent}",
            "{|to} set {|the} {brightness|luminosity} of {|the} light {for|in|on} {|the} {-|ROOM} to {-|BRIGHT} {|percent}"            
        ]
    },
    function(req,res) {
        var room = app.rooms[req.slot("ROOM")];
        var luminosity = parseInt(req.slot("BRIGHT"));

        if (room == undefined) {
            res.say("sorry, i did not understand which light you meant");
            return;
        }

        if (isNaN(luminosity)) {
            res.say("sorry, i did not understand how bright you wanted the light");
            return;
        }

        res.say("setting luminosity of " + req.slot("ROOM") + " light to " + req.slot("BRIGHT") + " percent");

        var light = new Milight({
            ip: controlIP,
            type: 'v6'
        });

        if (room.type == 'rgbw') {
            light.sendCommands(commands.rgbw.on(room.zone));
            light.sendCommands(commands.rgbw.brightness2(luminosity));
        }
        if (room.type == 'full') {
            light.sendCommands(commands.fullColor.on(room.zone));
            light.sendCommands(commands.fullColor.brightness(room.zone, luminosity));
        }
        if (room.type == 'bridge') {
            light.sendCommands(commands.bridge.on());
            light.sendCommands(commands.bridge.brightness(luminosity));
        }
    });

module.exports = app;