var controlIP = "192.168.1.24";
var Milight = require('node-milight-promise').MilightController;
var commands = require('node-milight-promise').commandsV6;

module.exports = function(express, alexaAppServerObject) {
    var validateCommon = function(req) {
        if (!req.param.ltype || ["full", "rgbw", "bridge"].indexOf(req.param.type)==-1) {
            res.status(500).send({ error: "unknown bulb type" });
            return false;
        }

        if (!req.param.zone || isNaN(parseInt(req.param.zone))) {
            res.status(500).send({ error: "invalid zone" });
            return false;
        }

        var zone = parseInt(req.param.zone);
        if (zone < 0 || zone > 4) {
            res.status(500).send({ error: "zone out of range" });
            return false;
        }

        return true;
    };

    express.get("/light/:ltype/:zone/on", function(req, res) {
      if (validateCommon(req)) {
          var ltype = req.param.ltype;
          var zone = parseInt(req.param.zone);

          var light = new Milight({
            ip: controlIP,
            type: 'v6'
          });

          switch (ltype) {
              case "full":
                light.sendCommands(commands.fullColor.on(zone));
                break;
              case "rgbw":
                light.sendCommands(commands.rgbw.on(zone));
                break;
              case "bridge":
                light.sendCommands(commands.bridge.on());
                break;
          }
      }
    });

    express.get("/light/:ltype/:zone/off", function(req, res) {
      if (validateCommon(req)) {
          var ltype = req.param.ltype;
          var zone = parseInt(req.param.zone);

          var light = new Milight({
            ip: controlIP,
            type: 'v6'
          });

          switch (ltype) {
              case "full":
                light.sendCommands(commands.fullColor.off(zone));
                break;
              case "rgbw":
                light.sendCommands(commands.rgbw.off(zone));
                break;
              case "bridge":
                light.sendCommands(commands.bridge.off());
                break;
          }
      } 
    });

    express.get("/light/:ltype/:zone/brightness/:brightness", function(req, res) {
      if (validateCommon(req)) {
        if (!req.param.brightness || isNaN(parseInt(req.param.brightness))) {
            res.status(500).send({ error: "invalid brightness" });
            return false;
        }

        var brightness = parseInt(req.param.brightness);
        if (brightness < 0 || brightness > 4) {
            res.status(500).send({ error: "brightness out of range" });
            return false;
        }

        var light = new Milight({
            ip: controlIP,
            type: 'v6'
        });

        switch (ltype) {
            case "full":
                light.sendCommands(commands.fullColor.on(zone), commands.fullColor.brightness(zone, brightness));
                break;
            case "rgbw":
                light.sendCommands(commands.rgbw.on(zone), commands.rgbw.brightness(zone, brightness));
                break;
            case "bridge":
                light.sendCommands(commands.bridge.on(), commands.rgbw.brightness(brightness));
                break;
        }
      } 
    });
};