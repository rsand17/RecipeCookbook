var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
        const resp = {
        message: "hello world!",
        arbitraryData: "123456",
        whatever: "blah"
    };

    res.send("TEST SUCCESSFUL");
});

module.exports = router;