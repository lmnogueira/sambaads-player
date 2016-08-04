var express = require('express');
var request = require('request');
var querystring = require('querystring');
var nconf = require('nconf');
var router = express.Router();

router.get('/:pid', function(req, res, next) {

	var urlFinal = encodeURIComponent(req.protocol + "://" + req.hostname + req.originalUrl);

	if(req.query.plid){
		request.get(
		{
			//url: "http://api2.sambaads.com/iframe//data?plid=lJJDuDUV&c=tecnologia&t=&sk=blue&tm=dark&plp=r&tb=Confiradeos&tbbg=#006600&w=940&h=360&plw=480&plh=&ads=false&cb=" + new Date(), 
			url: 'http://api2.sambaads.com/api/ab1f939133333fbc4ba49b1984248a47/playlists/lJJDuDUV/data.json?' + querystring.stringify(req.query), 
			//url: nconf.get("SMARTSEED_URL") + '/api/' + req.params.pid +  '/playlists/' + req.query.plid + '/data.json?' + querystring.stringify(req.query), 
			headers: {'Accept': "application/vnd.sambaads.v1; application/json;"}
		}, function(error, response, body){
			res.header('Content-Type', 'text/html');
			if(response.statusCode == 200){
				res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body), width:req.query['w'], height: req.query['h']});
			}else{
				if(nconf.get("DEBUG") == 'true'){
					res.sendStatus(response.statusCode);
				} else {
					res.sendStatus(204);
				}
			}
		});
	} else {
		request.get({
				url: nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data.json?' + querystring.stringify(req.query),
				headers: {'Accept': "application/vnd.sambaads.v1; application/json;"}
		}, function(error, response, body){
			res.header('Content-Type', 'text/html');
			if(response.statusCode == 200){
				res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body), width:req.query['w'], height: req.query['h']});
			}else{
				if(nconf.get("DEBUG") == 'true'){
					res.sendStatus(response.statusCode);
				} else {
					res.sendStatus(204);
				}
			}
		});
	}
});

// BEGINNIG OF LEGACY ROUTES DO NOT DELETE
router.get('/player/single_player/:media_id/:pid', function(req, res, next) {
	var urlFinal = encodeURIComponent(req.protocol + "://" + req.hostname + req.originalUrl);

	req.query.id = req.params.pid;
	req.query.m  = req.params.media_id;
	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data.json?' + querystring.stringify(req.query), function(error, response, body){
		res.header('Content-Type', 'text/html');
		if(response.statusCode == 200){
			res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body), width:req.query['w'], height: req.query['h']});
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
	var urlFinal = encodeURIComponent(req.protocol + "://" + req.hostname + req.originalUrl);
	req.query.c  = req.params.category;
	req.query.t  = (req.query.tags || "");

	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.query.pid + '/data.json?' + querystring.stringify(req.query), function(error, response, body){
		res.header('Content-Type', 'text/html');
		if(response.statusCode == 200){
			res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body), width:req.query['w'], height: req.query['h']});
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
	var urlFinal = encodeURIComponent(req.protocol + "://" + req.hostname + req.originalUrl);
	req.query.c  = req.params.category;
	req.query.t  = (req.query.tags || "");

	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data.json?' + querystring.stringify(req.query), function(error, response, body){
		res.header('Content-Type', 'text/html');
		if(response.statusCode == 200){
			res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body), width:req.query['w'], height: req.query['h']});
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
	var urlFinal = encodeURIComponent(req.protocol + "://" + req.hostname + req.originalUrl);
	req.query.id = req.params.pid;
	req.query.c  = req.params.category;
	req.query.t  = req.params.tags;

	request.get(nconf.get("SMARTSEED_URL") + '/iframe/' + req.params.pid + '/data.json?' + querystring.stringify(req.query), function(error, response, body){
		res.header('Content-Type', 'text/html');

		if(response.statusCode == 200){
			res.render('player/iframe', { base_url: urlFinal, info: JSON.parse(body), width:req.query['w'], height: req.query['h']});
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

router.get('/services/oembed', function(req, res, next) {
	request.get(
		{
			//url: "http://staging-v2-api.sambaads.com/api/" + req.params.pid + "/playlists/"+ req.query.plid +"/data",
			url: nconf.get("SMARTSEED_URL") + req.url, 
			headers: {'Accept': "application/vnd.sambaads.v1; application/json;"}
		}, function(error, response, body){
			res.header('Content-Type', 'application/json');
			if(response.statusCode == 200){
				res.json( JSON.parse(body));
			}else{
				if(nconf.get("DEBUG") == 'true'){
					res.sendStatus(response.statusCode);
				} else {
					res.sendStatus(204);
				}
			}
		});
});

router.get('/teste/:type_player', function(req, res, next) {
	res.render('player/teste', { type_player: req.params.type_player });
});

router.get('/status/ping', function(req, res) {
	res.json('ok');
});

module.exports = router;
