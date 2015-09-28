var express = require('express');
var request = require('request');
var querystring = require('querystring');
var nconf = require('nconf');
var router = express.Router();

router.get('/:pid', function(req, res, next) {
	var urlFinal = req.protocol + "://" + req.hostname + req.originalUrl;
	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data?' + querystring.stringify(req.query), function(error, response, body){
		res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body) });
	});
});

router.get('/teste/:type_player', function(req, res, next) {
	res.render('player/teste', { type_player: req.params.type_player });
});

module.exports = router;