var express = require('express');
var request = require('request');
var querystring = require('querystring');
var nconf = require('nconf');
var router = express.Router();

router.get('/:pid', function(req, res, next) {
	var urlFinal = req.protocol + "://" + req.hostname + req.originalUrl;

	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data?' + querystring.stringify(req.query), function(error, response, body){
		res.header('Content-Type', 'text/html');
		if(response.statusCode == 200){
			res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body) });
		}else{
			if(nconf.get("DEBUG") == 'true'){
				res.sendStatus(response.statusCode);
			} else {
				res.sendStatus(204);
			}
		}
	});
});

// BEGINNIG OF LEGACY ROUTES DO NOT DELETE
router.get('/player/single_player/:media_id/:pid', function(req, res, next) {
	var urlFinal = req.protocol + "://" + req.hostname + req.originalUrl;

	req.query.id = req.params.pid;
	req.query.m  = req.params.media_id;
	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data?' + querystring.stringify(req.query), function(error, response, body){
		res.header('Content-Type', 'text/html');
		if(response.statusCode == 200){
			res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body) });
		}else{
			if(nconf.get("DEBUG") == 'true'){
				res.sendStatus(response.statusCode);
			} else {
				res.sendStatus(204);
			}
		}
	});
});

router.get('/player/:category/:size', function(req, res, next) {
	var urlFinal = req.protocol + "://" + req.hostname + req.originalUrl;
	req.query.c  = req.params.category;
	req.query.t  = (req.query.tags || "");

	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.query.pid + '/data?' + querystring.stringify(req.query), function(error, response, body){
		res.header('Content-Type', 'text/html');
		if(response.statusCode == 200){
			res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body) });
		}else{
			if(nconf.get("DEBUG") == 'true'){
				res.sendStatus(response.statusCode);
			} else {
				res.sendStatus(204);
			}
		}
	});
});

router.get('/player/:category/:size/:pid', function(req, res, next) {
	var urlFinal = req.protocol + "://" + req.hostname + req.originalUrl;
	req.query.c  = req.params.category;
	req.query.t  = (req.query.tags || "");

	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data?' + querystring.stringify(req.query), function(error, response, body){
		res.header('Content-Type', 'text/html');
		if(response.statusCode == 200){
			res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body) });
		}else{
			if(nconf.get("DEBUG") == 'true'){
				res.sendStatus(response.statusCode);
			} else {
				res.sendStatus(204);
			}
		}
	});
});

router.get('/player/:category/:size/:pid/:tags', function(req, res, next) {
	var urlFinal = req.protocol + "://" + req.hostname + req.originalUrl;
	req.query.id = req.params.pid;
	req.query.c  = req.params.category;
	req.query.t  = req.params.tags;

	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data?' + querystring.stringify(req.query), function(error, response, body){
		res.header('Content-Type', 'text/html');
		
		if(response.statusCode == 200){
			res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body) });
		}else{
			if(nconf.get("DEBUG") == 'true'){
				res.sendStatus(response.statusCode);
			} else {
				res.sendStatus(204);
			}
			
		}
	});
});
// END OF LEGACY ROUTES DO NOT DELETE

router.get('/teste/:type_player', function(req, res, next) {
	res.render('player/teste', { type_player: req.params.type_player });
});

router.get('/status/ping', function(req, res) {
	res.json('ok');
});

module.exports = router;