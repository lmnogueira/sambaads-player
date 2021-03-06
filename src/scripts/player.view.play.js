var SambaAdsPlayerViewPlay = {};

SambaAdsPlayerViewPlay = function (){
	var self = this;
	self.displayOverlayPlay = $("#display-overlay-play");
	self.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	SambaAdsPlayerMessageBroker().addEventListener(Event.READY, function(evt){
			self.show();		
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAYER_STATE_CHANGE, function(evt){
		if((evt.detail.data.newState == PlayerState.PAUSED || evt.detail.data.newState == PlayerState.IDLE) && (evt.detail.data.newViewState == PlayerViewState.INITIALIZE) && !evt.detail.data.isAds){
			if(!self.isMobile)
				self.show();
		} else {
			self.hide();
		}
	});

	self.displayOverlayPlay.click(function(evt) {

		SambaAdsPlayerMessageBroker().send(DoEvent.PLAY);
	});
};

SambaAdsPlayerViewPlay.prototype.show = function(){
	this.displayOverlayPlay.show();
};

SambaAdsPlayerViewPlay.prototype.hide = function(){
	this.displayOverlayPlay.hide();
};

new SambaAdsPlayerViewPlay();