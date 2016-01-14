var express         = require('express');
var router          = express.Router();
var path            = require('path');
//fichier de configuation
var conf            = require('./conf/conf.json');

/* GET home page. */
router.get('/', function (req, res,next) {
    res.setHeader('Content-Type', conf.http.mime.html);
    console.log("Send public/index.html");
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.sendfile(path.resolve('public/index.html'));
    res.end();

    
});
module.exports = router;
