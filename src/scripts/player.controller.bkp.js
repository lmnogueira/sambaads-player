var SambaAdsPlayerControler = {};

SambaAdsPlayerControler = function (player, view, data){
	var self = this;
	window.sambaads = window.sambaads || {};
	window.sambaads.parentIframeID = "";

	self.player = player;
	self.guid = encodeURIComponent(this.guid());
	self.view = view;
	self.currentMediaId="";
	self.currentPlaylistIndex = 0;
	self.lastPlaylistIndex = 0;
	self.newstate = "IDLE";
	self.oldstate = null;
	self.startNextIn = null;
	self.pertmitWidthAutoStart = 320;
	//self.propagateMute = null;
	self.firstPlay = true;

	this.view.setController(this);

	if(data == undefined || data == null){
		/*$.get( "//app.sambaads.com/iframe/846dae1ccb4553649d9706ed535d7f09/data", 
			{ skin: "blue" } 
		)
		.done(function( data ) {
			self.init(data);
    	});*/
	}else{
		self.init( data );
	}
};

SambaAdsPlayerControler.prototype.discoveryHost = function(){
	var url = document.referrer || window.location.href
	//url = window.location.href
	//var a = $('<a>', { href:url } )[0];
	//var hostname = a.hostname;

	return url;
};

SambaAdsPlayerControler.prototype.sendMessage = function(smbevent,data){
	//console.log("IFRAME SENT: " + window.sambaads.parentIframeID + "::" + smbevent + "::" + data);
	window.parent.postMessage(window.sambaads.parentIframeID + "::" + smbevent + "::" + data, "*");
};

SambaAdsPlayerControler.prototype.guid = function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
	        .toString(16)
	        .substring(1);
		};
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	     s4() + '-' + s4() + s4() + s4();
};

        

SambaAdsPlayerControler.prototype.sendGif = function(options){
	var url = document.referrer || window.location.href
	var a = $('<a>', { href:url } )[0];

	options.satmref = a.hostname;
	options.satmfullref = url;


    $.get('/* @echo COLLECTOR_URL */', options).done(function(msg) {
    //$.get('//192.168.0.51:3000/api/v1/collector/satm.gif', options).done(function(msg) {
		//alert("success load cont");
	}).error(function(){
			//alert("error load cont");
	});

};

SambaAdsPlayerControler.prototype.getEnvironment = function(){
	return this.response.player_info.environment;
};

SambaAdsPlayerControler.prototype.updateViewsCount = function(mid, oid, cid){
	if (this.currentMediaId != mid) {
	  	this.currentMediaId = mid;

		this.sendGif({
		    "satms": this.guid,
		    "satmtag": "media.play",
		    "satmpid": this.response.publisher_info.hash_code,
		    "satmoid": oid,
		    "satmmid": mid,
		    "satmcid": cid,
		    "satmref": "",
		    "satmfullref": "",
		    'satmenv': this.getEnvironment()
		});
	};
};

SambaAdsPlayerControler.prototype.updateLoadCount = function(oid, cid){
	this.sendGif({
	"satms": this.guid,
	"satmtag": "media.load",
	"satmpid": this.response.publisher_info.hash_code,
	"satmoid": oid,
	"satmcid": cid,
	"satmref": "",
	"satmfullref": "",
	'satmenv': this.getEnvironment()
	});
};

SambaAdsPlayerControler.prototype.onMessageReceive = function(event){
	var params = event.data.split("::");

	var w = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

	if(params[1] == "play"){
		if(this.response.publisher_info.auto_start){
			if(w > this.pertmitWidthAutoStart) {
	  			this.play();
	  			this.view.updateItemCurrent();
	  		}
	  	}
	};

	if(params[1] == "pause"){
		if(this.response.publisher_info.auto_start){
			if(w > this.pertmitWidthAutoStart) {
	  			this.pause();
	  		}
	  	}
	};

	if(params[1] == "mute"){
		this.setMute(params[2]);
	};

	if(params[1] == "ready"){
		window.sambaads.parentIframeID = params[0]; //iframe id received from parent
		this.sendMessage("ready",this.response.publisher_info.auto_start + "," + this.calculatePlayerWidth() + "," + this.calculatePlayerHeight() );
		this.sendMessage("onNowWatchTitle", this.getCurrentVideo().title);
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
					if(w > this.pertmitWidthAutoStart) {
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
	this.response =  data ;

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


        //advertising:{
        //  client:'vast',
        //  tag: decodeURIComponent(this.response.player_info.custom_tag)
        //},
        
        //plugins: {
        //      '/* @echo LIVERAIL_PLUGIN_URL */' : {
     	//		'LR_ADMAP': 'in::0',
        //        'LR_URL': this.discoveryHost(),
        //        'LR_TAGS': this.response.publisher_info.auto_start ? "autostart" : "normal"
        //    }
        //},
        //skin: "http:" + this.response.player_info.skin_url,
    var player_config_options = {
        displaytitle: false,
        displaydescription: false,
        playlist: this._options.playlist,

        width: player_width,
        height: player_height,
        captions : captions,
        primary: "flash",
        abouttext: "SambaAds - no cats playing piano.",
        aboutlink: "http://www.sambaads.com.br/publishers"
    };

    if(!this.response.player_info.custom_tag){
    	delete player_config_options.advertising;
	} else {
		delete player_config_options.plugins;
	}

	new SambaAdsPlayerCore(player_config_options);

	/*window.jwplayer(this.player).setup(player_config_options);

    window.jwplayer(self.player).on('ready', function() {
		smb.init(self.player, self._options);
		self.onLoad();
    });

    window.jwplayer(self.player).on('fullscreen', function(fullscreen){
    	smb.onFullscreen(fullscreen);
    });

    window.jwplayer(self.player).on('play', function(evt){
    	self.response.publisher_info.auto_start = true;
    	self.computeComscore("04","sambaads_content");
    	window.jwplayer(self.player).setControls(true);
		smb.onPlay();
		
		self.oldstate = self.newstate.toUpperCase();
		self.newstate = evt.newstate.toUpperCase();

		self.sendMessage("onStateChange",evt.newstate);
	});

	window.jwplayer(self.player).on('mute', function(evt){
	});

	window.jwplayer(self.player).on('pause', function(evt){

		if(!smb.fullscreenActive){
			//hack para solucionar delay do request de ad...
			if( window.jwplayer(self.player).getPosition() > 1 ){
				smb.showDisplay("play");
				window.jwplayer(self.player).setControls(false);
			} else {
				smb.showDisplay("buffer");
			}
		} else {
			window.jwplayer(self.player).setControls(true);
		}

		self.oldstate = self.newstate;
		self.newstate = evt.newstate;

		self.sendMessage("onStateChange",evt.newstate);
	});

	window.jwplayer(self.player).on('buffer', function(evt){

		self.oldstate = self.newstate;
		self.newstate = evt.newstate;

		smb.showDisplay("buffer");
	});

	window.jwplayer(self.player).on('idle', function(evt){
		smb.hideDisplay();

		self.oldstate = self.newstate;
		self.newstate = evt.newstate;
	});

	window.jwplayer(self.player).on('time', function(evt){
		smb.hideDisplay();
	});

	window.jwplayer(self.player).on('beforeComplete', function(evt){

		self.oldstate = self.newstate;
		self.newstate = evt.newstate;
	});

	window.jwplayer(self.player).on('complete', function(evt){

		smb.onComplete();
		self.stop();

		self.newstate = "IDLE";
		self.oldstate = "PLAYING";
	});

	window.jwplayer(self.player).on('adTime', function(evt){
		smb.hideDisplay();
	});

	window.jwplayer(self.player).on('adError',function(evt){
		
		smb.hideDisplay();
		/*
		if(!self._options.playlist[self.currentPlaylistIndex].running_youtube && (self._options.playlist[self.currentPlaylistIndex].file_youtube.length > 0)){
			self._options.playlist[self.currentPlaylistIndex].running_youtube = true;
			window.jwplayer(this.player).load({ file: "http://www.youtube.com/watch?v=" + self._options.playlist[self.currentPlaylistIndex].file_youtube });
			window.jwplayer(this.player).play();
		}
		*
	});

	window.jwplayer(self.player).on('adImpression', function(evt){
		smb.hideDisplay();
	});

	window.jwplayer(self.player).on('adComplete', function(evt){
		
	});

	window.jwplayer(self.player).on('beforePlay', function(evt){
		smb.hideDisplay();
	});*/
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
    //window.jwplayer(this.player).callInternal("jwCallVPAID", "pauseAd");
};

SambaAdsPlayerControler.prototype.pause = function(){
    window.jwplayer(this.player).pause();
    //window.jwplayer(this.player).callInternal("jwCallVPAID", "pauseAd");
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

