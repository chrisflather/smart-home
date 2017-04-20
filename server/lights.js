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
            console.log("unknown bulb type: " + req.params.ltype);
            return false;
        }

        if (!req.params.zone || isNaN(parseInt(req.params.zone))) {
            res.status(400).send({ status: "ERROR", message: "invalid zone" });
            console.log("invalid zone: " + req.params.zone);
            return false;
        }

        var zone = parseInt(req.params.zone);
        if (zone < 0 || zone > 4) {
            res.status(400).send({  status: "ERROR", message: "zone out of range" });
            console.log("zone out of range: " + req.params.ltype);
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
          console.log("turned on light; " + ltype + "/" + zone);
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
          console.log("turned off light; " + ltype + "/" + zone);
      } 
    });

    express.get("/light/:ltype/:zone/brightness/:brightness", function(req, res) {
      if (validateCommon(req, res)) {
        var ltype = req.params.ltype;
        var zone = parseInt(req.params.zone);

        if (!req.params.brightness || isNaN(parseInt(req.params.brightness))) {
            res.status(400).send({  status: "ERROR", message: "invalid brightness" });
            console.log("invalid brightness: " + req.params.brightness);
            return false;
        }

        var brightness = parseInt(req.params.brightness);
        if (brightness < 0 || brightness > 100) {
            res.status(400).send({  status: "ERROR", message: "brightness out of range" });
            console.log("brightness out of range: " + req.params.brightness);
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
        console.log("brightness set for light; " + ltype + "/" + zone + " to " + brightness);
      } 
    });

    express.get("/light/:ltype/:zone/warmth/:temperature", function(req, res) {
      if (validateCommon(req, res)) {
        var ltype = req.params.ltype;
        var zone = parseInt(req.params.zone);

        if (!req.params.temperature || isNaN(parseInt(req.params.temperature))) {
            res.status(400).send({  status: "ERROR", message: "invalid temperature" });
            console.log("invalid temperature: " + req.params.temperature);
            return false;
        }

        var temperature = parseInt(req.params.temperature);
        if (temperature < 0 || temperature > 100) {
            res.status(400).send({  status: "ERROR", message: "temperature out of range" });
            console.log("temperature out of range: " + req.params.temperature);
            return false;
        }

        var light = new Milight({
            ip: controlIP,
            type: 'v6'
        });

        switch (ltype) {
            case "full":
                light.sendCommands(commands.fullColor.on(zone), commands.fullColor.whiteMode(zone), commands.fullColor.whiteTemperature(zone, 100 - temperature));
                break;
            case "rgbw":
                res.status(400).send({  status: "ERROR", message: "light does not support temperature" });
                console.log("temperature not supported for light; " + ltype + "/" + zone);
                return false;
                break;
            case "bridge":
                res.status(400).send({  status: "ERROR", message: "light does not support temperature" });
                console.log("temperature not supported for light; " + ltype + "/" + zone);
                return false;
                break;
        }
        light.pause(1000);
        light.close();

        setCacheHeaders(res);
        res.status(200).send({ status: "OK", message: "Warmth set successfully." });
        console.log("warmth set for light; " + ltype + "/" + zone + " to " + temperature);
      } 
    });
};