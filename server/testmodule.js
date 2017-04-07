module.exports = function(express, alexaAppServerObject) {
    express.get("/test/:test", function(req, res) {
        res.send(req.params);
    });
};