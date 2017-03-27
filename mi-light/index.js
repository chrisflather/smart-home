module.change_code = 1;

var alexa = require('alexa-app');
var controller = require('node-milight-promise');

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
});

app.intent(
    'HelloWorld', 
    {
        "slots": {
            "NAME": "AMAZON.US_FIRST_NAME"
        },
        "utterances": [
            "my {name's|name is} {NAME}"
        ]
    },
    function(req,res) {
        res.say("your name is " + req.slot("NAME"));
    });

app.intent(
    'LightOn', 
    {
        "slots": {
            "Room": "RoomType"
        },
        "utterances": [
            "{turn on|switch on|illuminate} the {-|RoomType} light",
            "{turn on|switch on|illuminate} the light {for the|in the|on the} {-|RoomType}",
            "to let there be light {in the|on the} {-|RoomType}"
        ]
    },
    function(req,res) {
        res.say("turning on the " + req.slot("Room") + " light");
    });

app.intent(
    'LightOff', 
    {
        "slots": {
            "Room": "RoomType"
        },
        "utterances": [
            "{turn off|switch off|deluminate} the {-|RoomType} light",
            "{turn off|switch off|deluminate} the light {for the|in the|on the} {-|RoomType}"
        ]
    },
    function(req,res) {
        res.say("turning off the " + req.slot("Room") + " light");
    });