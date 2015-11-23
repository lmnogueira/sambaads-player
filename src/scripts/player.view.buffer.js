var SambaAdsPlayerViewBuffer = {};

SambaAdsPlayerViewBuffer = function (){
	var self = this;
	self.displayOverlayLoader = $("#display-overlay-loader");

	SambaAdsPlayerMessageBroker().addEventListener(Event.BUFFER, function(e){
		self.show();
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAYER_STATE_CHANGE, function(e){
		if(e.detail.data.newState == PlayerState.PLAYING || e.detail.data.newState == PlayerState.PAUSED){
			self.hide();
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.AD_TIME, function(e){
		self.hide();
	});
};

SambaAdsPlayerViewBuffer.prototype.show = function(){
	this.displayOverlayLoader.show();
}

SambaAdsPlayerViewBuffer.prototype.hide = function(){
	this.displayOverlayLoader.hide();
}

new SambaAdsPlayerViewBuffer();