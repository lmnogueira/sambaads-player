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
	INITIALIZE: "initialize"
};

SambaAdsPlayerCore = function (options){
	var self = this;
	self.JWPlayer = window.jwplayer("jw_sambaads_player");
	window.sambaads = window.sambaads || {};
	window.sambaads.JWPlayer = self.JWPlayer;

	if (options) {
		this.setup(options);
	}
};

SambaAdsPlayerCore.prototype.setup = function(options){
	var self = this;
	
	this.JWPlayer.setup(options);

	this.JWPlayer.on('ready', function(e){
		SambaAdsPlayerMessageBroker().send(Event.READY, e);
	});

	this.JWPlayer.on('setupError', function(evt){
		
	});
	this.JWPlayer.on('playlist', function(evt){
		
	});
	this.JWPlayer.on('playlistItem', function(e){
		SambaAdsPlayerMessageBroker().send(Event.PLAY_LIST_ITEM, e);
	});
	this.JWPlayer.on('playlistComplete', function(evt){
		
	});
	this.JWPlayer.on('bufferChange', function(e){
	});

	this.JWPlayer.on('play', function(e){
		self.JWPlayer.setControls(true);
		SambaAdsPlayerMessageBroker().send(Event.PLAY, e);
	});

	this.JWPlayer.on('pause', function(e){
		self.JWPlayer.setControls(false);
		SambaAdsPlayerMessageBroker().send(Event.PAUSE, e);
	});
	
	this.JWPlayer.on('buffer', function(e){
		SambaAdsPlayerMessageBroker().send(Event.BUFFER, e);
	});

	this.JWPlayer.on('idle', function(evt){
		
	});
	this.JWPlayer.on('complete', function(evt){
		
	});
	this.JWPlayer.on('error', function(evt){
		
	});
	this.JWPlayer.on('seek', function(evt){
		
	});
	this.JWPlayer.on('seeked', function(evt){
		
	});
	this.JWPlayer.on('time', function(evt){

	});
	this.JWPlayer.on('mute', function(evt){
		
	});
	this.JWPlayer.on('volume', function(evt){
		
	});
	this.JWPlayer.on('fullscreen', function(evt){
		
	});
	this.JWPlayer.on('resize', function(e){
		SambaAdsPlayerMessageBroker().send(Event.RESIZE, e);
	});
	this.JWPlayer.on('levels', function(evt){
		
	});
	this.JWPlayer.on('levelsChanged', function(evt){
		
	});
	this.JWPlayer.on('captionsList', function(evt){
		
	});
	this.JWPlayer.on('captionsChange', function(evt){
		
	});
	this.JWPlayer.on('controls', function(evt){
		
	});
	this.JWPlayer.on('displayClick', function(evt){
		
	});
	this.JWPlayer.on('adClick', function(evt){
		
	});
	this.JWPlayer.on('adCompanions', function(evt){
		
	});
	this.JWPlayer.on('adComplete', function(evt){
		
	});
	this.JWPlayer.on('adError', function(evt){
		
	});
	this.JWPlayer.on('adImpression', function(evt){
		
	});
	this.JWPlayer.on('adTime', function(evt){
		
	});
	this.JWPlayer.on('adSkipped', function(evt){
		
	});
	this.JWPlayer.on('beforePlay', function(evt){
		
	});
	this.JWPlayer.on('beforeComplete', function(evt){
		
	});
	this.JWPlayer.on('meta', function(evt){
		
	});

	this.getStatePropagator = setInterval(function(){
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

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.PLAY, function(e){
		self.JWPlayer.play();
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.STOP, function(e){
		self.JWPlayer.stop();
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.LOAD_MEDIA, function(e){
		self.JWPlayer.load([e.detail.data]);
	});
};

