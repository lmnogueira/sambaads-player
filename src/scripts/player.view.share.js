var SambaAdsPlayerViewShare = {};

SambaAdsPlayerViewShare = function (){
	var self = this;
	self.displayOverlayShare = $("#display-overlay-share");
	self.buttonClose = $("#close-button");

	SambaAdsPlayerMessageBroker().addEventListener(Event.TOGGLE_SHARE, function(e){
		SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.DISPLAYING_SHARE);
		self.show();
	});

	self.buttonClose.click(function(){
		SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.INITIALIZE);
		self.hide();
	});

};

SambaAdsPlayerViewShare.prototype.show = function(){
	this.displayOverlayShare.show();
};

SambaAdsPlayerViewShare.prototype.hide = function(){
	this.displayOverlayShare.hide();
};

new SambaAdsPlayerViewShare();