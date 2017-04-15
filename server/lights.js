var controlIP = "192.168.1.24";
var Milight = require('node-milight-promise').MilightController;
var commands = require('node-milight-promise').commandsV6;

module.exports = function(express, alexaAppServerObject) {
    var setCacheHeaders = function(res) {
        res.set({
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        });
    }

    var validateCommon = function(req, res) {
        if (!req.params.ltype || ["full", "rgbw", "bridge"].indexOf(req.params.ltype)==-1) {
            res.status(400).send({ status: "ERROR", message: "unknown bulb type" });
            return false;
        }

        if (!req.params.zone || isNaN(parseInt(req.params.zone))) {
            res.status(400).send({ status: "ERROR", message: "invalid zone" });
            return false;
        }

        var zone = parseInt(req.params.zone);
        if (zone < 0 || zone > 4) {
            res.status(400).send({  status: "ERROR", message: "zone out of range" });
            return false;
        }

        return true;
    };

    express.get("/light/:ltype/:zone/on", function(req, res) {
      if (validateCommon(req, res)) {
          var ltype = req.params.ltype;
          var zone = parseInt(req.params.zone);

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
          light.pause(1000);
          light.close();

          setCacheHeaders(res);
          res.status(200).send({ status: "OK", message: "Light turned on successfully." });
      }
    });

    express.get("/light/:ltype/:zone/off", function(req, res) {
      if (validateCommon(req, res)) {
          var ltype = req.params.ltype;
          var zone = parseInt(req.params.zone);

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
          light.pause(1000);
          light.close();

          setCacheHeaders(res);
          res.status(200).send({ status: "OK", message: "Light turned off successfully." });
      } 
    });

    express.get("/light/:ltype/:zone/brightness/:brightness", function(req, res) {
      if (validateCommon(req, res)) {
        var ltype = req.params.ltype;
        var zone = parseInt(req.params.zone);

        if (!req.params.brightness || isNaN(parseInt(req.params.brightness))) {
            res.status(400).send({  status: "ERROR", message: "invalid brightness" });
            return false;
        }

        var brightness = parseInt(req.params.brightness);
        if (brightness < 0 || brightness > 100) {
            res.status(400).send({  status: "ERROR", message: "brightness out of range" });
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
                light.sendCommands(commands.bridge.on(), commands.bridge.brightness(brightness));
                break;
        }
        light.pause(1000);
        light.close();

        setCacheHeaders(res);
        res.status(200).send({ status: "OK", message: "Brightness set successfully." });
      } 
    });
};