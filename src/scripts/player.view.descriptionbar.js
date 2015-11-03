var SambaAdsPlayerViewDescriptionBar = {};

SambaAdsPlayerViewDescriptionBar = function (){
	var self = this;
	self.displayOverlayDescriptionBar = $("#display-overlay-title-share");
	self.buttonShare = $("#share-button");

	SambaAdsPlayerMessageBroker().addEventListener(Event.IDLE, function(e){
		self.show();
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAYER_STATE_CHANGE, function(e){
		if(e.detail.data.newState == PlayerState.PAUSED || e.detail.data.newState == PlayerState.IDLE){
			self.show();
		}
		else if(e.detail.data.newState == PlayerState.PLAYING || e.detail.data.newState == PlayerState.BUFFERING){
			self.hide();
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAY_LIST_ITEM, function(e){
		self.setTitle(e.detail.data.item.title);
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.VIEW_STATE_CHANGE, function(e){
		self.hide();

		if(e.detail.data == PlayerViewState.INITIALIZE){
			self.show();
		}
	});

	self.buttonShare.click(function(e){
		SambaAdsPlayerMessageBroker().send(Event.TOGGLE_SHARE, e);
	});
};

SambaAdsPlayerViewDescriptionBar.prototype.setTitle = function(title){
	$("#video-title").text(title);
};

SambaAdsPlayerViewDescriptionBar.prototype.show = function(){
	this.displayOverlayDescriptionBar.show();
};

SambaAdsPlayerViewDescriptionBar.prototype.hide = function(){
	this.displayOverlayDescriptionBar.hide();
};

new SambaAdsPlayerViewDescriptionBar();