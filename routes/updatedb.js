var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');


router.get('/',function(req, res){
    this.console.log("dedans /updatedb");
});


module.exports = router;