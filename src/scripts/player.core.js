var SambaAdsPlayerCore = {};

var PlayerState = {
	IDLE: "idle",
	BUFFERING: "buffering",
	PAUSED: "paused",
	PLAYING: "playing"
};

var PlayerViewState = {
	DISPLAYING_DESCRIPTION_BAR: "displayingDescriptionBar",
	DISPLAYING_SHARE: "displayingShare",
	DISPLAYING_BUFFER: "displayingBuffer",
	DISPLAYING_ADS: "displayingAds",
	INITIALIZE: "initialize"
};

SambaAdsPlayerCore = function (options){
	var self = this;
	self.JWPlayer = window.jwplayer("jw_sambaads_player");
	window.sambaads = window.sambaads || {};
	window.sambaads.JWPlayer = self.JWPlayer;

	if (options) {
		self.setup(options);
	}
};

SambaAdsPlayerCore.prototype.setup = function(options){
	var self = this;
	
	self.JWPlayer.setup(options);

	self.JWPlayer.on('ready', function(e){
		SambaAdsPlayerMessageBroker().send(Event.READY, e);
	});

	self.JWPlayer.on('setupError', function(evt){
		
	});
	self.JWPlayer.on('playlist', function(evt){
		
	});
	self.JWPlayer.on('playlistItem', function(e){
		SambaAdsPlayerMessageBroker().send(Event.PLAY_LIST_ITEM, e);
	});
	self.JWPlayer.on('playlistComplete', function(evt){
		
	});
	self.JWPlayer.on('bufferChange', function(e){
	});

	self.JWPlayer.on('play', function(e){
		self.JWPlayer.setControls(true);
		SambaAdsPlayerMessageBroker().send(Event.PLAY, e);
	});

	self.JWPlayer.on('pause', function(e){
		self.JWPlayer.setControls(false);
		SambaAdsPlayerMessageBroker().send(Event.PAUSE, e);
	});
	
	self.JWPlayer.on('buffer', function(e){
		SambaAdsPlayerMessageBroker().send(Event.BUFFER, e);
	});

	self.JWPlayer.on('idle', function(evt){
		
	});
	self.JWPlayer.on('complete', function(evt){
		
	});
	self.JWPlayer.on('error', function(evt){
		
	});
	self.JWPlayer.on('seek', function(evt){
		
	});
	self.JWPlayer.on('seeked', function(evt){
		
	});
	self.JWPlayer.on('time', function(evt){
	});
	self.JWPlayer.on('mute', function(evt){
		
	});
	self.JWPlayer.on('volume', function(evt){
		
	});
	self.JWPlayer.on('fullscreen', function(evt){
		
	});
	self.JWPlayer.on('resize', function(e){
		SambaAdsPlayerMessageBroker().send(Event.RESIZE, e);
	});
	self.JWPlayer.on('levels', function(evt){
		
	});
	self.JWPlayer.on('levelsChanged', function(evt){
		
	});
	self.JWPlayer.on('captionsList', function(evt){
		
	});
	self.JWPlayer.on('captionsChange', function(evt){
		
	});
	self.JWPlayer.on('controls', function(evt){
		
	});
	self.JWPlayer.on('displayClick', function(evt){
		console.log(evt);
	});
	self.JWPlayer.on('adClick', function(evt){
		console.log(evt);
	});
	self.JWPlayer.on('adCompanions', function(evt){
		console.log(evt);
	});
	self.JWPlayer.on('adComplete', function(evt){
		console.log(evt);
	});
	self.JWPlayer.on('adError', function(evt){
		console.log(evt);
	});
	self.JWPlayer.on('adImpression', function(evt){
		console.log(evt);
	});
	self.JWPlayer.on('adTime', function(evt){
		console.log(evt);
	});
	self.JWPlayer.on('adSkipped', function(evt){
		console.log(evt);
	});
	self.JWPlayer.on('beforePlay', function(evt){
		self.JWPlayer.playAd("http://ad4.liverail.com/?LR_PUBLISHER_ID=14403&LR_SCHEMA=vast2&LR_TAGS=sbtgeral&LR_VIDEO_POSITION=0&LR_URL=__referrer__&LR_FORMAT=VIDEO/MP4");
		//self.JWPlayer.playAd("https://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/387067271/RedeParceiros/SBT/Geral&cust_params=position%3Dpreroll&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=&description_url=&correlator=123");
	});
	self.JWPlayer.on('beforeComplete', function(evt){
		self.JWPlayer.playAd("http://ad4.liverail.com/?LR_PUBLISHER_ID=14403&LR_SCHEMA=vast2&LR_TAGS=sbtgeral&LR_VIDEO_POSITION=0&LR_URL=__referrer__&LR_FORMAT=VIDEO/MP4");
	});
	self.JWPlayer.on('meta', function(evt){
		
	});

	self.getStatePropagator = setInterval(function(){
		try{
			var currentState = self.JWPlayer.getState();

			if(currentState != self.newState){
				self.oldState = self.newState;
				self.newState = currentState;
				SambaAdsPlayerMessageBroker().send(Event.PLAYER_STATE_CHANGE, { oldState: self.oldState, newState: self.newState });
			}
		} catch (e){
			console.log("player Instance not available");
		}
	},100);

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.PAUSE, function(evt){
		console.log(self.newState)
		if(self.newState == PlayerState.PLAYING){
			self.JWPlayer.pause();
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.PLAY, function(evt){
		self.JWPlayer.play();
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.STOP, function(evt){
		self.JWPlayer.stop();
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.LOAD_MEDIA, function(evt){
		self.JWPlayer.load([evt.detail.data]);
	});

	$( "div.sambaads-embed" )
	.mousemove(function(evt) {
		SambaAdsPlayerMessageBroker().send(Event.MOUSE_MOVE, evt);
	})
	.mouseleave(function(evt) {
		SambaAdsPlayerMessageBroker().send(Event.MOUSE_LEAVE, evt);
	});
};

