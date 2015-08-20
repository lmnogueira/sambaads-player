var express = require('express');
var request = require('request');
var querystring = require('querystring');
var router = express.Router();

router.get('/:pid', function(req, res, next) {
	var urlFinal = req.protocol + "://" + req.hostname + req.originalUrl;
	request.get('http://localhost:4000/iframe/' + req.params.pid + '/data?' + querystring.stringify(req.query), function(error, response, body){
		res.render('widget', { base_url: urlFinal, info: JSON.parse(body) });
	});
});

router.get('/teste', function(req, res, next) {
	res.render('widget/teste', { type_player: req.params.type_player });
});

module.exports = router;
