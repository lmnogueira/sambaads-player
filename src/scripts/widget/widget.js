
	var detectScript = function(){
		var currentScript = document.currentScript || (function() {
      		var scripts = document.getElementsByTagName('script');

      		if(scripts[scripts.length - 1].src.indexOf('/* @echo NGINX_WIDGET_DOMAIN */') != 0)
      			return scripts[scripts.length - 1];
    	})();

    	return currentScript;
	}

	//initialize with client window
	var currentScript = detectScript();
	var currentLocation = cw.location;
	var currentIframe = {}

	if(!cw.sambaads){
		cw.sambaads = {};
		cw.sambaads.players = []

		cw.sambaads.getPlayer = function(iframeId){

			iframeId = iframeId || "sambaads_0";

			for (var i = 0; i < cw.sambaads.players.length; i++) {
				if(cw.sambaads.players[i].id == iframeId){
					return cw.sambaads.players[i];
				}
			};
		};
	};

	//parse querystring paramenters from url
	var parseQueryString = function( url ) {

		var queryString = url.split("?")[1];
		var params = {}, queries, temp, i, l;

		// Split into key/value pairs
		try{
			queries = queryString.split("&");

			// Convert the array of strings into an object
			for ( i = 0, l = queries.length; i < l; i++ ) {
				temp = queries[i].split('=');
				params[temp[0]] = temp[1];
			}
		} catch (e){
			//console.log(e);
		}

		return params;
	};

	var serialize = function(obj) {
	  	var str = [];
	  	for(var p in obj){
	    	if (obj.hasOwnProperty(p)) {
	      		str.push(encodeURIComponent(p) + "=" + (obj[p] || ""));
	    	}
		}
	  	return str.join("&");
	}

	var insertAfter = function (referenceNode, newNode) {
    	referenceNode.parentElement.insertBefore(newNode, referenceNode.nextSibling);
    	//referenceNode.parentElement.removeChild(referenceNode);
	};

	var appendIframe = function(parameters){
		var div = document.createElement('div');
		var iframe_id = "sambaads_" + cw.sambaads.players.length;
		var iframe_url = "";
		var width_height = "";

		parameters.rfr = encodeURIComponent(window.location.href);

		//se não conseguir obter ao menos o publisher ID não deve renderizar o iframe
		if(!parameters.p)
			return;

		iframe_url = "//" + parameters.request_domain + "/widget/" + parameters.p + "?" + serialize(parameters);

		// if(parameters.w){
		// 	width_height = ' width="' + parameters.w + '"';
		// }

		// if(parameters.h){
		// 	width_height = width_height + ' height="' + parameters.h + '"';
		// }


		var widthValue = parameters.w.split('%');

		if(typeof widthValue[1] === 'undefined') {
		    widthValue = (parameters.w - 20);
		    widthValue = widthValue + 'px';
		}

		var iframeHeight = parameters.h;
		iframeHeight = currentScript.parentNode.offsetHeight;
		iframeHeight = iframeHeight - 71;
		iframeHeight = iframeHeight + 'px';

		width_height = ' width="' + parameters.w +'" height="' + iframeHeight + '"';

		var playerHeader = '<div id="titlebar" class="titlebar" style="width: '+ widthValue +';background-color: rgb(18, 108, 176);overflow: hidden;border-bottom: 1px solid #fff;border-top-left-radius: 5px;border-top-right-radius: 5px;position: relative;padding: 10px;"><h2 id="titlebar-title" style="font-size: 17px;color: #fff;font-weight: bold;font-family: Helvetica, Arial, sans-serif; margin:0;">recomendados para você</h2><a href="http://www.sambaads.com.br/?utm_campaign=Recomendador&amp;utm_medium=Logo&amp;utm_source=Smartplayer" target="_blank" class="logo-sambaads" style="position: absolute;right: 9px;top: 9px;opacity: 0.3;transition: opacity .15s ease-out;"><img src="//d3655zppehxyvi.cloudfront.net/player/v1/iframe/img/logo-sambaads.png" alt="Samba Ads"></a></div>';
		var iframeContent = '<iframe id="' + iframe_id + '" style="max-width: 100%; height: ' + iframeHeight + '" ' + width_height + ' src="' + iframe_url + '#' + iframe_id +'" frameborder="0" scrolling="no"  webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>';
		var playerFooter = '<div style="width: '+ parameters.w +';height: 30px;"><p style="font-size: 11px; margin: 0px; color: #B0B0B0; text-align: left; text-align: -webkit-left; font-family: Helvetica, Arial, sans-serif;">powered by <a href="//www.sambaads.com.br/?utm_campaign=Recomendador&amp;utm_medium=Powered&amp;utm_source=PlayerRecomendador"><img src="//d366amxgkdfvcq.cloudfront.net/images/sambaads-logo.png" style="vertical-align:middle; width:100px !important; height: 24px !important"> </a></p></div>';
		var divContent = '<div style="height: 100%; min-height: 100%;">' + playerHeader + iframeContent + playerFooter + '</div>';

		div.innerHTML = divContent;

		//Put iframe after de <script> tag
		insertAfter(currentScript, div.firstChild);

		var iframe_data = {
			id : iframe_id,
			pid : parameters.p || parameters.pid || "",
			mid : parameters.m || parameters.mid || "",
			cid : parameters.c || parameters.cid || "",
			plw : parameters.plw || 0,
			plh : parameters.plh || 0,
			dimension : parameters.d || parameters.dimension,
			width: parameters.w,
			height: parameters.h,
			iframe_target_host: cw.location.protocol + "//" + parameters.request_domain,
			toClearTimeout: 0,
			isReady: false,
			contentWindow: function(){
				if (document.getElementById(this.id)) {
					return document.getElementById(this.id).contentWindow;
				} else {
					return false;
				}
			},
			sendMessage: function(smbevent,data){
				if(this.contentWindow().postMessage){
					this.contentWindow().postMessage( this.id + "::" + smbevent + "::" + data, this.iframe_target_host )
				}
			}
		};

		//get the iframeId controled by this script
		currentIframe = iframe_data;

		//store all player embeded on the same page
		cw.sambaads.players.push(iframe_data);

		return iframe_data;
	};

	var testProtocol = function(){
		var protocolsUrl = {"http:": '/* @echo CDN_WIDGET_DOMAIN */', "https:": '/* @echo CDN_WIDGET_SECURE_DOMAIN */'};
		return protocolsUrl[document.location.protocol]
	}

	var init = function(){
		//initialize parameters
		var parameters = parseQueryString(currentScript.src);



		parameters.w = parameters.w ? parameters.w : "100%";
		parameters.h = parameters.h ? parameters.h : "100%";
		parameters.request_domain = testProtocol();

		//append the iframe player
		var iframe_data = appendIframe(parameters);

		//initializing the crossdomain message support
		crossMessageInitialization(iframe_data);
	};

	var onMessageReceive = function(event){
		if(event.origin.indexOf("cloudfront") >= 0 || event.origin.indexOf(testProtocol()) >= 0){

			var params = event.data.split("::");

			if(params[0] == currentIframe.id){
				//console.log("CORE RECEIVED:" + event.data)

				if (params[1] == "ready" ){
		  			clearInterval(currentIframe.isReady);
		  			currentIframe.isReady = true;
		  			currentIframe.player_width = params[2].split(",")[1];
		  			currentIframe.player_height = params[2].split(",")[2] - 4; //- 4 pixels ajust
		  			initializePluginsAfeterReady();
		 		}

		 		if (params[1] == "click" ){
		 			var modal = new SambaadsModal();
		 			modal.open(JSON.parse(params[2]));
		 		}

			}
		}
	};

	var crossMessageInitialization = function(){
		if (cw.addEventListener){
			cw.addEventListener("message", onMessageReceive, false)
		} else {
			attachEvent("onmessage", onMessageReceive)
		};

		currentIframe.isReady = setInterval(function(){
			currentIframe.sendMessage("ready","")
		},2000)
	}

	init();
