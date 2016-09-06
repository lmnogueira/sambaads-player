var SambaAdsPlayerCore = {};

var PlayerState = {
	IDLE: "idle",
	BUFFERING: "buffering",
	PAUSED: "paused",
	PLAYING: "playing"
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


	self.JWPlayer.on('setupError', function(evt){});
	self.JWPlayer.on('playlist', function(evt){});
	self.JWPlayer.on('playlistComplete', function(evt){});
	self.JWPlayer.on('bufferChange', function(evt){});

	self.JWPlayer.on('ready', function(evt){
		SambaAdsPlayerMessageBroker().send(Event.READY, evt);
	});

	self.JWPlayer.on('playlistItem', function(evt){
		SambaAdsPlayerMessageBroker().send(Event.PLAY_LIST_ITEM, evt);
	});

	self.JWPlayer.on('play', function(evt){
		self.JWPlayer.setControls(true);
		SambaAdsPlayerMessageBroker().send(Event.PLAY, evt);
	});

	self.JWPlayer.on('pause', function(evt){
		self.JWPlayer.setControls(false);
		SambaAdsPlayerMessageBroker().send(Event.PAUSE, evt);
	});

	self.JWPlayer.on(Event.BUFFER, function(evt){
		SambaAdsPlayerMessageBroker().send(Event.BUFFER, evt);
	});

	//self.JWPlayer.on('idle', function(evt){});


	self.JWPlayer.on(Event.COMPLETE, function(evt){
		self.JWPlayer.stop();
		SambaAdsPlayerMessageBroker().send(Event.COMPLETE, evt);
		SambaAdsPlayerMessageBroker().send(Event.NATIVE_STOP, evt);
	});

	//self.JWPlayer.on('error', function(evt){});
	//self.JWPlayer.on('seek', function(evt){});
	//self.JWPlayer.on('seeked', function(evt){});
	self.JWPlayer.on(Event.TIME, function(evt){
		SambaAdsPlayerMessageBroker().send(Event.TIME, evt);
	});
	//self.JWPlayer.on('mute', function(evt){});
	//self.JWPlayer.on('volume', function(evt){});
	//self.JWPlayer.on('fullscreen', function(evt){});

	self.JWPlayer.on(Event.RESIZE, function(evt){
		SambaAdsPlayerMessageBroker().send(Event.RESIZE, evt);
	});

	//self.JWPlayer.on('levels', function(evt){});
	//self.JWPlayer.on('levelsChanged', function(evt){});
	//self.JWPlayer.on('captionsList', function(evt){});
	//self.JWPlayer.on('captionsChange', function(evt){});
	self.JWPlayer.on('controls', function(evt){
		console.log(evt);
	});
	//self.JWPlayer.on('meta', function(evt){});
	//self.JWPlayer.on('displayClick', function(evt){});
	self.JWPlayer.on('adClick', function(evt){
		//console.log(evt);
	});
	self.JWPlayer.on('adCompanions', function(evt){
		//console.log(evt);
	});
	self.JWPlayer.on('adComplete', function(evt){
		self._isAds = false;
		$(".jw-icon-fullscreen").removeClass("jw-hidden");
		$(".jw-icon-fullscreen").show();
		SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.INITIALIZE);
	});
	self.JWPlayer.on('adError', function(evt){
		$(".jw-icon-fullscreen").removeClass("jw-hidden");
		$(".jw-icon-fullscreen").show();
		//console.log(evt);
	});
	self.JWPlayer.on('adImpression', function(evt){
		self.JWPlayer.setControls(true);
		self._isAds = true;
		SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.DISPLAYING_ADS);

		//console.log(evt);
	});
	self.JWPlayer.on('adTime', function(evt){
		self._isAds = true;
		SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.DISPLAYING_ADS);
		SambaAdsPlayerMessageBroker().send(Event.AD_TIME, evt);
	});
	self.JWPlayer.on('adSkipped', function(evt){
		self._isAds = false;
		$(".jw-icon-fullscreen").removeClass("jw-hidden");
		$(".jw-icon-fullscreen").show();
		SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.INITIALIZE);
		//console.log(evt);
	});

	self.JWPlayer.on('beforePlay', function(evt){
		SambaAdsPlayerMessageBroker().send(Event.AD_BEFORE_PLAY, self.JWPlayer);
	});

	self.JWPlayer.on('beforeComplete', function(evt){
		//SambaAdsPlayerMessageBroker().send(Event.AD_BEFORE_COMLETE, evt);
	});

	self.getStatePropagator = setInterval(function(){
		try{
			var currentState = self.JWPlayer.getState();
			var isAds = self._isAds;
			var currentViewState = window.sambaads.currentViewState || PlayerViewState.INITIALIZE;
			var dispatch = false;

			if(currentState != self.newState){
				self.oldState = self.newState;
				self.newState = currentState;
				dispatch = true;
			}

			if(currentViewState != self.newViewState){
				self.newViewState = currentViewState;
				dispatch = true;
			}

			if(dispatch){
				SambaAdsPlayerMessageBroker().send(Event.PLAYER_STATE_CHANGE, { isAds: isAds, oldState: self.oldState, newState: self.newState, newViewState: self.newViewState });
			}
		} catch (e){
			//console.log("player Instance not available");
		}
	},100);

	SambaAdsPlayerMessageBroker().addEventListener(Event.VIEW_STATE_CHANGE, function(evt){
		window.sambaads.currentViewState = evt.detail.data;
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.PAUSE, function(evt){
		if(self.newState == PlayerState.PLAYING){
			self.JWPlayer.pause();
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.PLAY, function(evt){
		if(self.newState == PlayerState.PAUSED || self.newState == PlayerState.IDLE){
			self.JWPlayer.play();
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.STOP, function(evt){
		self.JWPlayer.stop();
		self.newState = PlayerState.IDLE;
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.MUTE, function(evt){

		if(evt.detail.data){
			jwplayer().setVolume(0);
		} else {
			jwplayer().setVolume(10);
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.LOAD_MEDIA, function(evt){
		SambaAdsPlayerMessageBroker().send(Event.NATIVE_STOP, evt);
		
		//change source protocol
		evt.detail.data.sources[0].file = evt.detail.data.sources[0].file.replace('http:', window.location.protocol);
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
