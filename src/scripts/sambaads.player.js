'use strict';

var SambaAdsPlayerControler = {};

SambaAdsPlayerControler = function (player, view, data){
	var self = this;
	window.sambaads = {};
	window.sambaads.parentIframeID = "";

	self.player = player;
	self.guid = encodeURIComponent(this.session());
	self.view = view;
	self.currentMediaId="";
	self.currentPlaylistIndex = 0;
	self.lastPlaylistIndex = null;
	self.newstate = "IDLE";
	self.oldstate = null;
	self.userHasInteracted = false;
	self.pertmitWidthAutoStart = 320;
	//self.propagateMute = null;
	self.firstPlay = true;

	this.view.setController(this);

	self.init( data );
};

SambaAdsPlayerControler.prototype.sendMessage = function(smbevent,data){
	window.parent.postMessage(window.sambaads.parentIframeID + "::" + smbevent + "::" + data, "*");
};

SambaAdsPlayerControler.prototype.generateGuid = function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
	        .toString(16)
	        .substring(1);
		};
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

};

SambaAdsPlayerControler.prototype.setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

SambaAdsPlayerControler.prototype.getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

SambaAdsPlayerControler.prototype.session = function() {
	var cookie = this.getCookie("sambaads_player_session");

	if (!cookie) {
		this.setCookie("sambaads_player_session", this.generateGuid(), 365);
	}

	return cookie;
};


SambaAdsPlayerControler.prototype.sendGif = function(type, options){
	var url = document.referrer || window.location.href
	var a = $('<a>', { href:url } )[0];

	options.satmref = a.hostname;
	options.satmfullref = url;

    $.get('/* @echo COLLECTOR_URL */' + type, options).done(function(msg) {
    //$.get('//192.168.0.51:3000/api/v1/collector/satm.gif', options).done(function(msg) {
		//alert("success load cont");
	}).error(function(){
			//alert("error load cont");
	});

};

SambaAdsPlayerControler.prototype.sendGif_v2 = function(type, options){
	var url = document.referrer || window.location.href
	var a = $('<a>', { href:url } )[0];

	options.satm_domain = a.hostname;

    $.get('/* @echo COLLECTOR_URL */' + type + '?', options).done(function(msg) {
    //$.get('//192.168.0.51:3000/api/v1/collector/satm.gif', options).done(function(msg) {
		//alert("success load cont");
	}).error(function(){
			//alert("error load cont");
	});

};

SambaAdsPlayerControler.prototype.updateViewsCount = function(mid, oid, cid){
	if (this.currentMediaId != mid) {
	  	this.currentMediaId = mid;

		this.sendGif('events', {
		    "satms": this.session(),
		    "satmtag": "media.play",
		    "satmpid": this.response.publisher_info.hash_code,
		    "satmoid": oid,
		    "satmmid": mid,
		    "satmcid": cid,
		    "satmref": "",
		    "satmfullref": "",
		    "satmorigin":this.response.player_info.origin,
		    'satmenv': this.response.player_info.environment
		});
	};
};

SambaAdsPlayerControler.prototype.updateLoadCount = function(oid, cid){

	this.sendGif('events', {
	"satms": this.session(),
	"satmtag": "media.load",
	"satmpid": this.response.publisher_info.hash_code,
	"satmoid": oid,
	"satmcid": cid,
	"satmorigin":this.response.player_info.origin,
	'satmenv': this.response.player_info.environment
	});
};

SambaAdsPlayerControler.prototype.watchedCount = function(position, duration){
	var percent = Math.floor(position/duration*100);
	var percent_frequency=2;

	if(percent < 0 ){
		percent = 0;
	} else if(percent > 100 ){
		percent = 100;
	}

	this.time_position = this.time_position || 0;

	if((position != this.time_position) && (this.old_percent != percent)){

		this.time_position = parseInt(position);
		this.old_percent = parseInt(percent);

		duration = parseInt(duration) < 0 || isNaN(duration) ? 0 : parseInt(duration)

		var time_slot = parseFloat((parseInt(duration)*parseInt(percent_frequency)/100));
		time_slot = time_slot < 0 || isNaN(time_slot) ? 0 : time_slot;

		if(this.old_percent%percent_frequency == 0){
			this.sendGif_v2('watched',{
				"satm_session": this.session(),
				"satm_client_id": "",
				"satm_time_slot": time_slot,
				"satm_tag": "video.watched." + percent,
				"satm_site_id": this.response.publisher_info.hash_code || this.response.site_info.hash_code,
				"satm_media_id": parseInt(this._options.playlist[this.currentPlaylistIndex].media_id),
				"satm_channel_id": parseInt(this._options.playlist[this.currentPlaylistIndex].channel_id || this._options.playlist[this.currentPlaylistIndex].owner_id),
				"satm_domain": "",
				"satm_duration": duration,
				"satm_origin": this.response.player_info.origin,
				'satm_environment': this.response.player_info.environment
			});
		}

	}
};

SambaAdsPlayerControler.prototype.onMessageReceive = function(event){
	var params = event.data.split("::");

	var w = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

	if(params[1] == "play"){
		if(params[2] === 'true'){
			this.play();
		  	this.view.updateItemCurrent();
		} else {
			if(this.response.publisher_info.auto_start){
				if(w > this.pertmitWidthAutoStart) {
		  			this.play();
		  			this.view.updateItemCurrent();
		  		}
	  		}			
		}

	};

	if(params[1] == "pause"){
		if(params[2]==='true'){
			this.pause();
		} else {
			if(this.response.publisher_info.auto_start){
				if(w > this.pertmitWidthAutoStart) {
		  			this.pause();
		  		}
		  	}
		}
	};

	if(params[1] == "mute"){
		this.setMute(params[2]);
	};

	if(params[1] == "ready"){
		window.sambaads.parentIframeID = params[0]; //iframe id received from parent
		this.sendMessage("ready",this.response.publisher_info.auto_start + "," + this.calculatePlayerWidth() + "," + this.calculatePlayerHeight() );
		
		try{	
			this.sendMessage("onNowWatchTitle", this.getCurrentVideo().title);
		} catch(e){
			//console.log(e);
		}
	};

	if(params[1] == "debug"){
		// if (console)
		// 	console.log(this);
	};

	if(params[1] == "seek"){
		this.seekTo(params[2]);
	};

	if(params[1] == "visible"){
		if(params[2] === "true"){

			if(this.response.publisher_info.auto_start){

				if(this.newstate != "PLAYING"){
					if(w > this.pertmitWidthAutoStart && !this.userHasInteracted) {
			  			this.play();
			  			this.view.updateItemCurrent();
			  		}
			  		this.setMute(false);
				} else {
					this.setMute(false);
				}

				if(this.firstPlay){
					this.firstPlay = false;

					if(w > this.pertmitWidthAutoStart) {
						this.setMute(true);
					}
				}
			} else {
				this.setMute(false);
			}
		} else {
			this.setMute(true);

			if(this.newstate == "PLAYING"){
				if(w > this.pertmitWidthAutoStart) {
	  				this.pause();
	  			}
			}
		}
		
	};

	if(params[1] == "mouseover"){
		if(this.newstate != "IDLE"){
			this.setMute(false);
		}
	};

	if(params[1] == "expandedCinema"){
		if(params[2] == "clickThrough"){
	  		window.sambaads.expandedCinema.getSwf(window.sambaads.expandedCinema.objectID).sendEvent('clickThrough');
		}
	};
};

SambaAdsPlayerControler.prototype.initilizeSmbMessanger = function(){
	var self=this;

	window.onMessageReceive = function(evt){
		self.onMessageReceive(evt);
	}

	if (window.addEventListener){
		window.addEventListener("message", window.onMessageReceive, false)
	} else {
		attachEvent("onmessage", window.onMessageReceive)
	};
}

//legacy support
SambaAdsPlayerControler.prototype.discoveryPlaylistInfo = function(){
	var playlistInfo = {}

	if ($(document).height() >= $(document).width()) {
		playlistInfo.plp = "bottom-vertical";
		playlistInfo.tm = "dark";
	} else {
		playlistInfo.plp = "right";
		playlistInfo.tm = "dark";
	}

	return playlistInfo;
};

SambaAdsPlayerControler.prototype.init = function(data){
	var self = this;
	this.response =  data;

	self.updateLoadCount('', this.response.player_info.category_name);

	this._options = {
			//position:"rigth",
			//position:"bottom-vertical",
			//position:"bottom-horizontal",
			position: this.response.player_info.playlist_position || self.discoveryPlaylistInfo().plp,
			playlistStyle: this.response.player_info.theme || self.discoveryPlaylistInfo().tm,
			playlist:[]
	};

	if (this._options.position == "right") {
		this._options.playlistHeight = 0;
		this._options.playlistWidth = this.response.player_info.playlist_width   || 280;
	}

	if (this._options.position == "bottom-vertical") {
		this._options.playlistHeight = this.response.player_info.playlist_height || 150;
		this._options.playlistWidth = 0;
	} 

	if (this._options.position == "bottom-horizontal") {
		this._options.playlistWidth = 0;
		this._options.playlistHeight = 143;
	}

	this._options.playlist = this.response.playlist;

	//calculate player size
	var player_width = this.calculatePlayerWidth();
	var player_height = this.calculatePlayerHeight();

	var captions = {
                color: '#FFFFFF',
                fontSize: 12,
                fontFamily: 'verdana-bold, verdana',
                fontOpacity: 100,
                backgroundColor: '#000000',
                backgroundOpacity: 0,
                edgeStyle: 'dropshadow',
                windowColor: '#000000',
                windowOpacity: 0
    };

    var player_config_options = {
        displaytitle: false,
        advertising:{
         client:'vast',
         admessage: 'Anúncio publicitário terminará em XX segundos.'
         // skipoffset: '30'
         //decodeURIComponent(this.response.player_info.custom_tag)
        },
        playlist: this._options.playlist,
        skin: location.protocol + this.response.player_info.skin_url,
        width: player_width,
        height: player_height,
        captions : captions,
        autostart : this.canAutoStart(),
        primary: "flash",
        abouttext: "SambaAds - no cats playing piano.",
        aboutlink: "http://www.sambaads.com.br/publishers"
    };

 //    if(!this.response.player_info.custom_tag){
 //    	delete player_config_options.advertising;
	// } else {
	// 	delete player_config_options.plugins;
	// }

	if(self._options.playlist.length > 1)
		self.view.showPlaylist(self._options, player_width, player_height);

	window.jwplayer(self.player).setup(player_config_options);


    window.jwplayer(self.player).onReady(function() {
		self.view.init(self.player, self._options);
		self.onLoad();
    });

    window.jwplayer(self.player).onSetupError(function(evt) {
    	self.initilizeSmbMessanger();
    	if(self.response.player_info.environment == 'magiccontent') {
    		self.sendMessage("onSetupError","");
			$('#jw_sambaads_player p').text('Ops! não foi possível recomendar um vídeo para esta página.');
		} else {
			$('#jw_sambaads_player p').text('Ops! não foi possível encontrar o vídeo.');
		}
    });

    window.jwplayer(self.player).onFullscreen(function(fullscreen){
    	self.view.onFullscreen(fullscreen);
    });

    window.jwplayer(self.player).onPlay(function(evt){
    	self.response.publisher_info.auto_start = true;
    	self.computeComscore("04","sambaads_content");
    	window.jwplayer(self.player).setControls(true);
		self.view.onPlay();
		
		self.oldstate = self.newstate;
		self.newstate = evt.newstate;

		self.sendMessage("onStateChange",evt.newstate);
	});

	window.jwplayer(self.player).onMute(function(evt){
	});

	window.jwplayer(self.player).onPause(function(evt){

		if(!self.view.fullscreenActive){
			//hack para solucionar delay do request de ad...
			if( window.jwplayer(self.player).getPosition() > 1 ){
				self.view.showDisplay("play");
				window.jwplayer(self.player).setControls(false);
			} else {
				self.view.showDisplay("buffer");
			}
		} else {
			window.jwplayer(self.player).setControls(true);
		}

		self.oldstate = self.newstate;
		self.newstate = evt.newstate;

		self.sendMessage("onStateChange",evt.newstate);
	});

	window.jwplayer(self.player).onBuffer(function(evt){

		self.oldstate = self.newstate;
		self.newstate = evt.newstate;

		self.view.showDisplay("buffer");
	});

	window.jwplayer(self.player).onIdle(function(evt){
		self.view.hideDisplay();

		self.oldstate = self.newstate;
		self.newstate = evt.newstate;
	});

	window.jwplayer(self.player).onTime(function(evt){

		self.watchedCount(Math.floor(evt.position), Math.floor(evt.duration));

		self.view.hideDisplay();
	});

	window.jwplayer(self.player).onBeforeComplete(function(evt){

		self.oldstate = self.newstate;
		self.newstate = evt.newstate;
	});

	window.jwplayer(self.player).onComplete(function(evt){

		console.log("teste");

		self.view.onComplete();
		self.stop();

		self.newstate = "IDLE";
		self.oldstate = "PLAYING";
	});

	window.jwplayer(self.player).onAdTime(function(evt){
		self.view.hideDisplay();

		console.log(evt)
	});

	window.jwplayer(self.player).onAdError(function(evt){
		
		self.view.hideDisplay();
	});

	window.jwplayer(self.player).onAdImpression(function(evt){
		self.view.hideDisplay();
	});

	window.jwplayer(self.player).onAdComplete(function(evt){
		
	});

	window.jwplayer(self.player).onBeforePlay(function(evt){
		
		$("#display-overlay-title-share").hide();
		self.view.hideDisplay();

		setTimeout(function(){
			if(self.currentPlaylistIndex != self.lastPlaylistIndex){
				self.lastPlaylistIndex = self.currentPlaylistIndex;
				var url = encodeURIComponent(document.referrer || window.location.href);
				window.jwplayer(self.player).playAd("https://ad4.liverail.com/?LR_PUBLISHER_ID="+self.getCurrentVideo().LR_PUBLISHER_ID+"&LR_SCHEMA=vast2-vapid&LR_TAGS="+(self.response.publisher_info.auto_start ? "autostart" : "normal")+"&LR_VERTICALS="+self.getCurrentVideo().LR_VERTICALS+"&LR_PARTNERS="+self.getCurrentVideo().LR_PARTNERS+"&LR_ADMAP=in%3A%3A0&LR_FORMAT=video%2Fmp4&LR_VIDEO_AMID="+self.getCurrentVideo().media_id+"&LR_AUTOPLAY="+self.getCurrentVideo().LR_AUTOPLAY+"&LR_URL="+url);
				//window.jwplayer(self.player).playAd("https://ad4.liverail.com/?LR_PUBLISHER_ID=114135&LR_SCHEMA=vast2&LR_TAGS=acessorios&LR_VERTICALS=automoveis&LR_PARTNERS=774803&LR_ADMAP=in%3A%3A0&LR_FORMAT=video%2Fmp4&LR_VIDEO_AMID=123456&LR_URL=http://www.sambaads.com.br&LR_AUTOPLAY=1");
			}
		},5);
	});

};

SambaAdsPlayerControler.prototype.canAutoStart = function(){
	var can = false;

	if(this.response.player_info.origin === 'widgethighlights'){
		can = true;
	} else if(this.response.player_info.origin === 'brandedchannels'){
		can = true;
	}

	if(typeof window.orientation !== 'undefined'){
		can = false;
	}

	return can;
};

SambaAdsPlayerControler.prototype.onLoad = function(){
	this.computeComscore("04","sambaads_content");
	this.computeComscore("01","sambaads_video_advertising");
	this.initilizeSmbMessanger();
};

SambaAdsPlayerControler.prototype.getCurrentVideo = function(){
	return window.jwplayer(this.player).getPlaylistItem(window.jwplayer(this.player).getPlaylistIndex());
};


SambaAdsPlayerControler.prototype.computeComscore = function(c5,c3) {
	COMSCORE.beacon({
	    c1: 1,
	    c2: "15752844",
	    c3: c3,
	    c4: "",
	    c5: c5,
	    c6: "",
	    c10: ""
	});
};

SambaAdsPlayerControler.prototype.calculatePlayerHeight = function(){
	var player_height = 0;
	if($("#titlebar").is(':visible')){
		player_height = ( $( document ).height() - $("#titlebar").outerHeight());

	} else {
		player_height = ( $( document ).height());
	};

	if(this._options.playlist.length > 1){
		player_height = player_height - this._options.playlistHeight;
	};

	return player_height;
};

SambaAdsPlayerControler.prototype.calculatePlayerWidth = function(){
	var player_width = 0;

	player_width = $( document ).width();

	if(this._options.playlist.length > 1){
		player_width = player_width - this._options.playlistWidth;
	};
    
    return player_width;
};

SambaAdsPlayerControler.prototype.getPlaylist = function(){
    return this._options.playlist;
};

SambaAdsPlayerControler.prototype.loadPlaylist = function(index){
	if(this.currentPlaylistIndex != index){
		this.stop();
		this.lastPlaylistIndex = this.currentPlaylistIndex;
		this.currentPlaylistIndex = index;
		this._options.playlist[index].running_youtube = false;
		window.jwplayer(this.player).load([this._options.playlist[index]]);
	}

	this.view.videoTitle.innerHTML = this._options.playlist[index].title;
};

SambaAdsPlayerControler.prototype.setMute = function(mute){
	if( typeof Boolean(mute) === 'boolean'){
		window.jwplayer(this.player).setMute(mute);			
	}
};

SambaAdsPlayerControler.prototype.play = function(){
    window.jwplayer(this.player).play();
    window.jwplayer(this.player).callInternal("jwCallVPAID", "pauseAd");
};

SambaAdsPlayerControler.prototype.pause = function(){
    window.jwplayer(this.player).pause();
    window.jwplayer(this.player).callInternal("jwCallVPAID", "pauseAd");
};

SambaAdsPlayerControler.prototype.seekTo = function(seek_to){
    window.jwplayer(this.player).seek(seek_to);
};

SambaAdsPlayerControler.prototype.stop = function(){
    window.jwplayer(this.player).stop();
};

SambaAdsPlayerControler.prototype.playNext = function(){
    this.loadPlaylist(this.currentPlaylistIndex + 1);
	window.jwplayer(this.player).play();
};

var SambaAdsPlayerView = {};

SambaAdsPlayerView = function (){
	this.debug = true;
	this.displayOverlayShare 	 = document.getElementById("display-overlay-share");
	this.displayOverlayPlay 	 = document.getElementById("display-overlay-play");
	this.displayOverlayTitleShare 	 = document.getElementById("display-overlay-title-share");
	this.displayOverlayNextVideo = document.getElementById("display-overlay-next");
	
	this.playButtom = document.getElementById("display-buttom-play");
	this.videoTitleBar = document.getElementById("video-title-bar");
	this.videoTitle = document.getElementById("video-title");
	
};

SambaAdsPlayerView.prototype.showDisplay = function(option){
	var width = window.jwplayer(self.player).getWidth() + "px";
	var height = window.jwplayer(self.player).getHeight() + "px";

	$("#share-button-dock").hide();

	this.currentDisplay = option;
	this.displayOverlayPlay.style.display 		= "none";
	this.displayOverlayTitleShare.style.display = "none";
	$("#display-overlay-loader").hide();
	this.displayOverlayShare.style.display 		= "none";
	this.displayOverlayNextVideo.style.display 	= "none";

	if(option == 'play'){
		this.displayOverlayPlay.style.display = "block";
		this.displayOverlayTitleShare.style.display = "block";
		
		$("#video-title").show();
		$("#video-title").text(this.controller.getCurrentVideo().title);
		
		if(this.controller.getCurrentVideo().total_views == undefined || this.controller.getCurrentVideo().total_views == 0){
			$("#video-views").hide();
		} else {
			$("#video-views").show();
		}

		$("#video-author").text("por " + this.controller.getCurrentVideo().owner_name);
		$("#video-views-number").text(this.controller.getCurrentVideo().total_views);

		this.setShareFacebookUrl("/* @echo FACEBOOK_SHARER_URL */?mid="+ this.controller.getCurrentVideo().media_id +"&pid="+this.controller.response.publisher_info.hash_code);
		this.setShareEmbed("<script src=\"/* @echo PLAYER_SCRIPT_URL */?"
		  			+ "m=" + this.controller.getCurrentVideo().media_id 
		  			+ "&p=" + this.controller.response.publisher_info.hash_code
		  			+ "&sk=blue"
		  			+ "&tm=light" 
		  			+ "&plp="
		  			+ "&plw="
		  			+ "&plh=&w=640&h=360\"></script>");

	} else if (option == 'buffer'){
		$("#display-overlay-loader").show();
	} else if (option == 'share'){

		var w = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

		var h = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

		if (w<h && (w <= 320)){
			$(".wrapper-share").css("top","10%");
			$(".close-button").css("z-index", "101");

			$("#btn-select-embed").css("margin-top","10px");
		}

		this.displayOverlayShare.style.display = "block";
	} else if (option == 'next-video'){
		this.displayOverlayNextVideo.style.display = "block";
	}

	$('#display-overlay').width(width);
	$('#display-overlay').height(height);
};

SambaAdsPlayerView.prototype.init = function(player, options){
	var self = this;
	self.player = player;
	self.options = options;

	if(self.controller.canAutoStart()){
		self.hideDisplay();
	} else {
		self.showDisplay("play");
	}

	$("#display-overlay-loader").hide();

	$("#display-overlay-play").click(function() {
		self.controller.play();
		self.updateItemCurrent();
	});

	document.getElementById("share-button-dock").onclick = function(){
		self.controller.shareLastState = self.controller.newstate;
		self.controller.play();
		self.showDisplay("share");
		$("#share-button-dock").hide();
	}

	document.getElementById("share-button").onclick = function(){
		self.controller.shareLastState = self.controller.newstate;
		
		if(self.controller.shareLastState == "PLAYING"){
			self.controller.play();
		}

		self.showDisplay("share");
	}

	document.getElementById("close-button").onclick = function(){
		self.showDisplay("play");
		
		if(self.controller.shareLastState == "PLAYING"){
			self.controller.play();
		}
			
		self.controller.shareLastState = self.controller.newstate;
	}

	document.getElementById("next-counter").onclick = function() {
		clearInterval(self.startNextIn);
		self.controller.playNext();
		self.updateItemCurrent();
	};

	document.getElementById("replay-button").onclick = function() {
		clearInterval(self.startNextIn);
		window.jwplayer(self.player).play();
	};

	document.getElementById("btn-select-embed").onclick = function() {
		var input = document.getElementById("share-embed");

		input.select();
		input.focus();

		$("#btn-select-embed").text("ctrl + c para copiar");

		setTimeout(function(){
			$("#btn-select-embed").text("selecionar embed");
		},2000);
	};

	$( "div.sambaads-embed" )
	.mousemove(function(event) {
		$("#share-button-dock").css("z-index","2")

		if(self.controller.newstate != "IDLE" && self.controller.newstate != "PAUSED" && self.currentDisplay != "share"){
			$("#share-button-dock").show();
			$("#display-overlay-title-share").show();
			$("#video-title").text(self.controller.getCurrentVideo().title);

			if(self.controller.getCurrentVideo().total_views == undefined || self.controller.getCurrentVideo().total_views == 0){
				$("#video-views").hide();
			} else {
				$("#video-views").show();
			}

			$("#video-author").text("por " + self.controller.getCurrentVideo().owner_name);
			$("#video-views-number").text(self.controller.getCurrentVideo().total_views);
		}
	})
	.mouseleave(function(event) {
		if(self.controller.newstate != "IDLE" && self.controller.newstate != "PAUSED" && self.currentDisplay != "share"){
			$("#share-button-dock").hide();
			$("#display-overlay-title-share").hide();
		}
	});

	$( "div.sambaads-player-container" ).mousedown(function() {
		self.controller.userHasInteracted = true;
	});

	// $( "#share-button-dock" )
	// .mousemove(function(event) {
	// 	$("#share-button-dock").css("z-index","2")

	// 	if(self.controller.newstate != "IDLE" && self.controller.newstate != "PAUSED" && self.currentDisplay != "share")
	// 		$("#share-button-dock").show();
	// }).mouseleave(function(event) {
	// 	$("#share-button-dock").hide();
	// });
};

SambaAdsPlayerView.prototype.playVideo = function(video){
	this.playerSetup.playlist = [video];
	window.jwplayer(self.player).setup(this.playerSetup);
	this.init(self.player);
};

SambaAdsPlayerView.prototype.hideDisplay = function(){
	$("#display-overlay-loader").hide();
	this.displayOverlayPlay.style.display = "none";
	this.displayOverlayShare.style.display = "none";
	this.displayOverlayNextVideo.style.display = "none";
};

SambaAdsPlayerView.prototype.setTitleBar = function(title_text, color){
	$("#titlebar").css("backgroundColor", color);

	if(title_text.length > 0){
		$("#titlebar-title").text(decodeURIComponent(title_text));
		$("#titlebar").show();
		$('body').css("backgroundColor", "transparent");
	}
};

SambaAdsPlayerView.prototype.setShareLink = function(url){
	var input = document.getElementById("share-link");
	
	if(input)
		input.value = url;
}

SambaAdsPlayerView.prototype.setShareEmbed = function(embed){
	var input = document.getElementById("share-embed");

	if(input)
		input.value = embed;
}

SambaAdsPlayerView.prototype.setShareFacebookUrl = function(url){
	var button = document.getElementById("facebook-url-share");

	button.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
};

SambaAdsPlayerView.prototype.setController = function(controller){
	this.controller = controller;
};

SambaAdsPlayerView.prototype.log = function (msg){
	//console.log(msg);
};

SambaAdsPlayerView.prototype.updateItemCurrent = function(){
	var self = this;

	$("div.playlist-item").each(function(idex, item){
		if(item.id.indexOf(self.controller.currentPlaylistIndex) >= 0){
			$(item).find("span.video-duration").text("ASSISTINDO");
			$(item).find("span.video-duration").show();
		}

		if(item.id.indexOf(self.controller.lastPlaylistIndex) >= 0){
			if(self.controller.lastPlaylistIndex != self.controller.currentPlaylistIndex){
				$(item).find("span.video-duration").hide();
			}
		}
	});
};

SambaAdsPlayerView.prototype.showPlaylist = function(options, player_width, player_height){
	var self = this;

	$("#sambaads-embed").width(player_width);
	$("#sambaads-embed").height(player_height);

	self.vitem = $("#playlist-v-item");
	self.hitem = $("#playlist-h-item");

	$("#playlist-v-items").empty();
	$("#playlist-h-items").empty();

	if(options.position == "right"){
		$($.find("div.sambaads-playlist.vertical")[0]).addClass(options.playlistStyle);
		$("#playlist-h-items").hide();
		$("#sambaads-embed").addClass("pull-left");
		
		$(".nano").css( "height", player_height );
	}else if(options.position == "bottom-vertical"){
		$($.find("div.sambaads-playlist.vertical")[0]).addClass(options.playlistStyle);
		$("#playlist-h-items").hide();
		$("#playlist-v-items").show();
		
		$(".nano").css( "height", options.playlistHeight );
	}else if(options.position == "bottom-horizontal"){
		$($.find("div.sambaads-playlist.horizontal")[0]).addClass(options.playlistStyle);
		$("#playlist-h-items").show();
	}

	this.controller.getPlaylist().forEach(function(item){
		var new_v_item = self.vitem.clone();
		var new_h_item = self.hitem.clone();

		new_v_item.attr("id", "v-" + $("#playlist-v-items").children().length);//item.mediaid || item.id);
		new_h_item.find("div.playlist-item").attr("id", "h-" + $("#playlist-h-items").children().length);
		$(new_v_item).find("img").attr('src', (item.thumbnails['90'] || item.image))
		$(new_h_item).find("img").attr('src',(item.thumbnails['90'] || item.image))

		if(item.sponsored){
			new_v_item.addClass("highlight");
			new_h_item.addClass("highlight");

			$(new_v_item).find('span.label-patrocinado').show();
			$(new_h_item).find('span.label-patrocinado').show();
		}

		$(new_v_item).find("div.video-description h4 a").text(item.title.replace(/^(.{30}[^\s]*).*/, "$1") + "\n");
		$(new_h_item).find("div.video-description h4 a").text(item.title.replace(/^(.{30}[^\s]*).*/, "$1") + "\n");

		$("#playlist-v-items").append(new_v_item);
		$("#playlist-h-items").append(new_h_item);
	});

	$( "div.playlist-item" ).click(function() {
		var index = this.id.split("-")[1];
		clearInterval(self.startNextIn);

		self.controller.loadPlaylist(+index);
		self.controller.play();

		self.updateItemCurrent();
	});



	setTimeout(function(){
		$(".sambaads-playlist").show();

		$("#playlist-h-items").lightSlider({
		item: 3,
		autoWidth: true,
		slideMove: 1, // slidemove will be 1 if loop is true
		slideMargin: 0,
		mode: "slide",
		useCSS: true,
		loop: true,
		controls: true,
		prevHtml: '<i class="icon-previous"></i>',
        nextHtml: '<i class="icon-next"></i>',
		pager: false,
		enableTouch:false,
        enableDrag:false,
		onSliderLoad: function() {
			$('#autoWidth').removeClass('cS-hidden');
		}
		});

		$(".nano").nanoScroller();
	},150);
	
};

SambaAdsPlayerView.prototype.onPlay = function(){
	this.hideDisplay();

	this.controller.updateViewsCount(
			this.options.playlist[this.controller.currentPlaylistIndex].media_id, 
			this.options.playlist[this.controller.currentPlaylistIndex].owner_id, 
			this.options.playlist[this.controller.currentPlaylistIndex].category_name);

	if(this.options.playlist[this.controller.currentPlaylistIndex + 1]) {
		$("#video-next-title").text(this.options.playlist[this.controller.currentPlaylistIndex + 1].title);
		$("#video-next-thumbnail").attr('src',this.options.playlist[this.controller.currentPlaylistIndex + 1].thumbnails['90'] || this.options.playlist[this.controller.currentPlaylistIndex + 1].image);
	}
}

SambaAdsPlayerView.prototype.onFullscreen = function(evt){
	var width = window.jwplayer(this.controller.player).getWidth() + "px";
	var height = window.jwplayer(this.controller.player).getHeight() + "px";

	if(!evt.fullscreen){
		this.fullscreenActive = false;
		$('#display-overlay').width(width);
		$('#display-overlay').height(height);
	} else {
		this.fullscreenActive = true;
	}
}

SambaAdsPlayerView.prototype.onComplete = function(){
	var self = this;
	var i = 10;

	if(self.controller.currentPlaylistIndex + 1 < self.options.playlist.length) {
		self.showDisplay("next-video");

		$('.progress-circle').circleProgress({
			value: 1.0,
			size: 36,
			lineCap: 'round',
			thickness: 2,
			emptyFill: 'rgba(255, 255, 255, 0.1)',
			animation: { duration: 12000 },
			fill: { color: '#fff' }
		});

		$("#counter-down").text(i);
		self.startNextIn = setInterval(function(){
			$("#counter-down").text(i);
			if(i==0){
				self.hideDisplay();
				self.controller.playNext();
				clearInterval(self.startNextIn);
				self.updateItemCurrent();
			}
			i--
		},1000);
	} else {
		self.showDisplay("play");
	}
};