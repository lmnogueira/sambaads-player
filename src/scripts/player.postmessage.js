var SambaAdsPlayerPostMessage = {};

SambaAdsPlayerPostMessage = function (){
	var self = this;
	window.sambaads = window.sambaads || {};

	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(e){
		self.configuration = e.detail.data;
		if(!window.sambaads.parentIframeID){
			window.sambaads.parentIframeID = self.configuration.player.iframe_id;
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAYER_STATE_CHANGE, function(e){
		self.newState = e.detail.data.newState;
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.SETUP_ERROR, function(e){
		self.sendMessage("onSetupError", "" );
	});

	 window.onMessageReceive = function(evt){
	 	self.onMessageReceive(evt);
	 }

	if (window.addEventListener){
		window.addEventListener("message", window.onMessageReceive, false)
	} else {
		attachEvent("onmessage", window.onMessageReceive)
	};
};

SambaAdsPlayerPostMessage.prototype.onMessageReceive = function(evt){
	var self = this;
	var params = evt.data.split("::");

	params[1] == "onPlay" ? self.onPlay(params[2]) : false;
	params[1] == "onPause" ? self.onPause(params[2]) : false;
	params[1] == "onMute" ? self.onMute(params[2]) : false;
	params[1] == "onReady" ? self.onReady(params[0],params[2]) : false;
	params[1] == "onSeek" ? self.onSeek(params[2]) : false;
	params[1] == "onVisible" ? self.onVisible(params[2]) : false;
	params[1] == "onMouseOver" ? self.onMouseOver(params[2]) : false;
	params[1] == "onExpandedCinema" ? self.onExpandedCinema(params[2]) : false;

};

SambaAdsPlayerPostMessage.prototype.sendMessage = function(smbevent,data){
	window.parent.postMessage(window.sambaads.parentIframeID + "::" + smbevent + "::" + data, "*");
};

SambaAdsPlayerPostMessage.prototype.onPlay = function(data){
	console.log("go_play");
	if(this.response.publisher_info.auto_start){
		if(this.configuration.player.width > this.configuration.player.pertmitWidthAutoStart) {
			console.log("go_play");
  			SambaAdsPlayerMessageBroker().send(DoEvent.PLAY);
  		}
  	}

};

SambaAdsPlayerPostMessage.prototype.onPause = function(data){

	if(this.response.publisher_info.auto_start){
		if(this.configuration.player.width > this.configuration.player.pertmitWidthAutoStart) {
  			SambaAdsPlayerMessageBroker().send(DoEvent.PAUSE);
  		}
  	}

};

SambaAdsPlayerPostMessage.prototype.onReady = function(iframeID, data){
	var self = this;
	//window.sambaads.parentIframeID = iframeID; //iframe id received from parent
	window.sambaads.pageDescription = atob(data);
	self.sendMessage("onReady", self.configuration.client.auto_start + "," + self.configuration.player.width + "," + self.configuration.player.height );

	//this.sendMessage("onNowWatchTitle", this.getCurrentVideo().title);
};

SambaAdsPlayerPostMessage.prototype.onVisible = function(data){

	if(data === "true"){
		if(this.configuration.client.auto_start){
			if(this.newState != PlayerState.PLAYING){
				if(this.configuration.player.width > this.configuration.player.pertmitWidthAutoStart) {
		  			SambaAdsPlayerMessageBroker().send(DoEvent.PLAY);
		  		}

		  		SambaAdsPlayerMessageBroker().send(DoEvent.MUTE, true);
			} else {
				SambaAdsPlayerMessageBroker().send(DoEvent.MUTE, false);
			}

			if(this.firstPlay){
				this.firstPlay = false;

				if(this.configuration.player.width > this.configuration.player.pertmitWidthAutoStart) {
					SambaAdsPlayerMessageBroker().send(DoEvent.MUTE, true);
				}
			}
		} else {
			SambaAdsPlayerMessageBroker().send(DoEvent.MUTE, false);
		}
	} else {
		SambaAdsPlayerMessageBroker().send(DoEvent.MUTE, true);

		if(this.newState == PlayerState.PLAYING){
			if(this.configuration.player.width > this.configuration.player.pertmitWidthAutoStart) {
  				SambaAdsPlayerMessageBroker().send(DoEvent.PAUSE);
  			}
		}
	}
};

SambaAdsPlayerPostMessage.prototype.onSeek = function(data){
	//this.seekTo(params[2]);
};

SambaAdsPlayerPostMessage.prototype.onMute = function(data){
	SambaAdsPlayerMessageBroker().send(DoEvent.MUTE, data);
};

SambaAdsPlayerPostMessage.prototype.onMouseOver = function(data){
	console.log(data);
	if(this.newstate != PlayerState.IDLE){
		SambaAdsPlayerMessageBroker().send(DoEvent.MUTE, false);
	}
};

SambaAdsPlayerPostMessage.prototype.onExpandedCinema = function(data){
	if(data == "onClickThrough"){
  		window.sambaads.expandedCinema.getSwf(window.sambaads.expandedCinema.objectID).sendEvent('onClickThrough');
	}
};

new SambaAdsPlayerPostMessage();
