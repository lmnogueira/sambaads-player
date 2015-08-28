var express = require('express');
var request = require('request');
var querystring = require('querystring');
var nconf = require('nconf');
var router = express.Router();

router.get('/teste', function(req, res, next) {
	res.render('widget/teste');
});

router.get('/:pid', function(req, res, next) {
	var urlFinal = req.protocol + "://" + req.hostname + req.originalUrl;
	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data?' + querystring.stringify(req.query), function(error, response, body){
		res.render('widget/widget', { base_url: urlFinal, info: JSON.parse(body), params: req.query });
	});
});

router.get('/:pid/:mid', function(req, res, next) {
	var urlFinal = req.protocol + "://" + req.hostname + req.originalUrl;
	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data?m=' + req.params.mid, function(error, response, body){
		res.render('layout/index', { base_url: urlFinal, info: JSON.parse(body), params: req.query });
	});
});


module.exports = router;
