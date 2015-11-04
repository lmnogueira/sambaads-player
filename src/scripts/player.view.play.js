var SambaAdsPlayerViewPlay = {};

SambaAdsPlayerViewPlay = function (){
	var self = this;
	self.displayOverlayPlay = $("#display-overlay-play");

	SambaAdsPlayerMessageBroker().addEventListener(Event.READY, function(e){
		self.show();
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAYER_STATE_CHANGE, function(e){
		if(e.detail.data.newState == PlayerState.PLAYING || e.detail.data.newState == PlayerState.BUFFERING){
			self.hide();
		} else if(e.detail.data.newState == PlayerState.PAUSED){
			self.show();
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.VIEW_STATE_CHANGE, function(e){
		self.hide();

		if(e.detail.data == PlayerViewState.INITIALIZE){
			self.show();
		}
	});

	self.displayOverlayPlay.click(function(e) {
		SambaAdsPlayerMessageBroker().send(DoEvent.PLAY);
	});
};

SambaAdsPlayerViewPlay.prototype.show = function(){
	this.displayOverlayPlay.show();
}

SambaAdsPlayerViewPlay.prototype.hide = function(){
	this.displayOverlayPlay.hide();
}

new SambaAdsPlayerViewPlay();