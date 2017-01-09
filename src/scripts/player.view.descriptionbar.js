var SambaAdsPlayerViewDescriptionBar = {};

SambaAdsPlayerViewDescriptionBar = function (){
	var self = this;
	self.displayOverlayDescriptionBar = $("#display-overlay-title-share");
	self.buttonShare = $("#share-button");

	SambaAdsPlayerMessageBroker().addEventListener(Event.READY, function(e){
		self.show();
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAYER_STATE_CHANGE, function(e){
		self.currentState = e.detail.data.newState;
		self.currentViewState = e.detail.data.newViewState;



		if(
			( (e.detail.data.newState == PlayerState.PAUSED && e.detail.data.newViewState == PlayerViewState.INITIALIZE) || e.detail.data.newState == PlayerState.IDLE && e.detail.data.newViewState == PlayerViewState.INITIALIZE) && !e.detail.data.isAds){
			self.show();
		}
		else if(
			e.detail.data.newState == PlayerState.PLAYING ||
			e.detail.data.newState == PlayerState.BUFFERING ||
			e.detail.data.newViewState != PlayerViewState.INITIALIZE || e.detail.data.isAds){
			self.hide();
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(e){
		self.setTitleBar(e.detail.data.player.title_bar,e.detail.data.player.title_bar_color);
	});

	SambaAdsPlayerViewDescriptionBar.prototype.setTitleBar = function(title_text, color){
		if(title_text.length == 0){
			$("#titlebar").hide();
		} else {
			$("#titlebar").css("backgroundColor", (color == '' ? '#000000': color));
			$("#titlebar").css("display", "block");
			$("#titlebar-title").text(decodeURIComponent(decodeURIComponent(title_text)));
		}
	};

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAY_LIST_ITEM, function(e){
		self.setTitle(e.detail.data.item.title);
		self.setAuthor(e.detail.data.item.owner_name);
		self.setViews(e.detail.data.item.total_views);
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.MOUSE_MOVE, function(e){
		if(self.currentState == PlayerState.PLAYING && self.currentViewState != PlayerViewState.DISPLAYING_ADS){
			self.show();
		}
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.MOUSE_LEAVE, function(e){
		if(self.currentState != PlayerState.IDLE && self.currentState != PlayerState.PAUSED){
			self.hide();
		}
	});

	self.buttonShare.click(function(e){
		SambaAdsPlayerMessageBroker().send(Event.TOGGLE_SHARE, e);
	});
};

SambaAdsPlayerViewDescriptionBar.prototype.setTitle = function(title){
	$("#video-title").text(title);
};

SambaAdsPlayerViewDescriptionBar.prototype.setAuthor = function(author){
	$("#video-author").text("por " + author);
};

SambaAdsPlayerViewDescriptionBar.prototype.setViews = function(views){

	if(views > 0)
		$("#video-views-number").text(views);
	else
		$("#video-views").hide();
};

SambaAdsPlayerViewDescriptionBar.prototype.show = function(){
	this.displayOverlayDescriptionBar.show();
};

SambaAdsPlayerViewDescriptionBar.prototype.hide = function(){
	this.displayOverlayDescriptionBar.hide();
};

new SambaAdsPlayerViewDescriptionBar();
