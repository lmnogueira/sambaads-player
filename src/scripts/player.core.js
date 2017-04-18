var SambaAdsPlayerCore = {};

var PlayerState = {
	IDLE: "idle",
	BUFFERING: "buffering",
	PAUSED: "paused",
	PLAYING: "playing"
};

var is_full_screen = 0;

SambaAdsPlayerCore = function (options){
	var self = this;
	window.sambaads = window.sambaads || {};

	self.configurePlayer(options);
};

SambaAdsPlayerCore.prototype.configurePlayer = function(options){
	var self = this;

	self.player = videojs("video_js_player", {width: options.width, height: options.height, preload: "metadata"}, function(){
					//{fluid:true}, function(){
					this.poster(options.playlist[0].image);
					
					this.src({type: 'video/mp4', src: options.playlist[0].sources[0].file});

			  		SambaAdsPlayerMessageBroker().send(Event.READY, (this));

			  		$("#video_js_player").removeClass("hide");
				});

	window.sambaads.videoJSPlayer = self.player;

	self.getStatePropagator = setInterval(function(){
		try{
			var currentState = self.videojsGetState();
			var isAds = self._isAds;
			var currentViewState = window.sambaads.currentViewState || PlayerViewState.INITIALIZE;
			var dispatch = false;

			
			if(self.newState === undefined) {
				currentState = PlayerState.IDLE;
			}

			if(currentState != self.newState){
				self.oldState = self.newState;
				self.newState = currentState;
				dispatch = true;
			}


			if(currentViewState != self.newViewState){
				self.newViewState = currentViewState;
				dispatch = true;
			}

			var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

			if(currentState === "playing" || isMobile){
				$("#video_js_player_html5_api").show();
			} else if(currentState === "idle"){
				$("#video_js_player_html5_api").hide();
			}

			if(dispatch){
				SambaAdsPlayerMessageBroker().send(Event.PLAYER_STATE_CHANGE, { isAds: isAds, oldState: self.oldState, newState: self.newState, newViewState: self.newViewState });
			}
		} catch (e){
			console.log("player Instance not available");
			console.log(e);
		}
	},100);

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.FIRST_PLAY, function(){
		self.player.userActive(true);
		var currentState = self.videojsGetState();
		SambaAdsPlayerMessageBroker().send(Event.AD_BEFORE_PLAY, self.player);

		self.videoCompleted = false;
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.PLAY, function(){
		self.player.userActive(true);
		var currentState = self.videojsGetState();

		if(currentState == PlayerState.IDLE){
			SambaAdsPlayerMessageBroker().send(Event.AD_BEFORE_PLAY, self.player);
		} else if (currentState == PlayerState.PAUSED){
			self.player.play();
		}
		self.videoCompleted = false;
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.PAUSE, function(evt){
		self.player.userActive(false);
		if(self.videojsGetState() == PlayerState.PLAYING){
			self.player.pause();
		}
	});

	self.player.on("timeupdate", function(evt){
		SambaAdsPlayerMessageBroker().send(Event.TRACK_WATCHED, {
			duration : self.player.duration(),
			position : self.player.currentTime()
		});
	});

	self.player.on("ended", function(evt){
		if(self.videoCompleted == false){
			self.videoCompleted = true;
			evt.preventDefault();
			evt.stopPropagation();
			SambaAdsPlayerMessageBroker().send(Event.COMPLETE, evt);
			SambaAdsPlayerMessageBroker().send(Event.NATIVE_STOP, evt);
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.STOP, function(evt){
		self.player.hasStarted_ = false;
		//self.player.dispose();
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.MUTE, function(evt){
		if(evt.detail.data){
			self.player.volume(0);
		} else {
			self.player.volume(0.4);
		}
	});

	self.player.on("adsready", function(){
		self.player.ima.addEventListener(google.ima.AdEvent.Type.LOADED, function(){
			window.sambaads.videoJSPlayer.ima.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,self.onAdsManagerLoaded,false);
		});
		self.player.ima.addEventListener(google.ima.AdEvent.Type.FAILED_TO_REQUEST_ADS, function(){
			console.log('failed to request ads');
		});
		self.player.ima.addEventListener(google.ima.AdEvent.Type.AD_ERROR, function(){
			console.log('failed ads');
			self._isAds = false;
			self.stopAdTime();
			if(document.getElementById('ima-ad-container')){
				document.getElementById('ima-ad-container').style.visibility = 'hidden';
			}
			$(".jw-icon-fullscreen").removeClass("jw-hidden");
			$(".jw-icon-fullscreen").show();
		});
		self.player.ima.addEventListener(google.ima.AdEvent.Type.STARTED, function(evt){
			self._isAds = true;
			self.onAdsManagerLoaded(evt);
		});
		self.player.ima.addEventListener(google.ima.AdEvent.Type.IMPRESSION, function(){
			self.player.userActive(true);
			self._isAds = true;
			SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.DISPLAYING_ADS);
		});
		self.player.ima.addEventListener(google.ima.AdEvent.Type.SKIPPED, function(){
			self._isAds = false;
			self.stopAdTime();
			$(".jw-icon-fullscreen").removeClass("jw-hidden");
			$(".jw-icon-fullscreen").show();
			SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.INITIALIZE);
		});
		self.player.ima.addEventListener(google.ima.AdEvent.Type.COMPLETE, function(){
			self._isAds = false;
			$(".jw-icon-fullscreen").removeClass("jw-hidden");
			$(".jw-icon-fullscreen").show();
			self.stopAdTime();
			SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.INITIALIZE);
		});
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.VIEW_STATE_CHANGE, function(evt){
		window.sambaads.currentViewState = evt.detail.data;
	});

	self.player.on("useractive", function(evt){
		SambaAdsPlayerMessageBroker().send(Event.MOUSE_MOVE, evt);
	});

	$("div.sambaads-embed" )
	.mousemove(function(evt) {
		SambaAdsPlayerMessageBroker().send(Event.MOUSE_MOVE, evt);
	})
	.mouseleave(function(evt) {
		SambaAdsPlayerMessageBroker().send(Event.MOUSE_LEAVE, evt);
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.LOAD_MEDIA, function(evt){
		SambaAdsPlayerMessageBroker().send(Event.NATIVE_STOP, evt);

		//change source protocol
		evt.detail.data.sources[0].file = evt.detail.data.sources[0].file.replace('http:', window.location.protocol);
		self.ChangeMedia(evt);
	});

}

SambaAdsPlayerCore.prototype.videojsGetState = function(){
	var self = this, state;

	if(is_full_screen != self.player.isFullscreen()){
		is_full_screen = self.player.isFullscreen();
		SambaAdsPlayerMessageBroker().send(Event.RESIZE);
	}

	// if(self.player.networkState() == 2 && self.player.hasStarted_ == true && self.player.bufferedPercent() != 1) {
	// 	SambaAdsPlayerMessageBroker().send(Event.BUFFER);
	// 	state = PlayerState.BUFFERING;
	// }

	if(self.player.hasStarted_ == false){
		state = PlayerState.IDLE;
	} else if(self.player.seeking() == 1 || self.player.paused() == 0) {
		state = PlayerState.PLAYING;
	} else if(self.player.paused() == 1){
		state = PlayerState.PAUSED;
	}

	return state;
}

SambaAdsPlayerCore.prototype.ChangeMedia = function(evt){
	var self = this;
	self.stopAdTime();
	self.player.poster(evt.detail.data.thumbnails["360"]);
	SambaAdsPlayerMessageBroker().send(Event.PLAY_LIST_ITEM, evt.detail.data);
}

SambaAdsPlayerCore.prototype.stopAdTime = function(){
	var self = this;
	if (self.countdownTimer) {
		clearInterval(self.countdownTimer);
		self._isAds = false;
	}
}

SambaAdsPlayerCore.prototype.onAdsManagerLoaded = function(adEvent){
	var self = this;
	if(adEvent.type == google.ima.AdEvent.Type.STARTED){
		self.countdownTimer = setInterval(function(){
			if(!self._isAds){
				self._isAds = true;
			}
			var timeRemaining = window.sambaads.videoJSPlayer.ima.adsManager.getRemainingTime();
			SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.DISPLAYING_ADS);
			SambaAdsPlayerMessageBroker().send(Event.AD_TIME);
		}, 1000);
	}
}

SambaAdsPlayerCore.prototype.setup = function(options){
	var self = this;

	self.JWPlayer.setup(options);
};
