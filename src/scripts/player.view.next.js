var SambaAdsPlayerViewNext = {};

SambaAdsPlayerViewNext = function (){
	var self = this;
	self.displayOverlayNext = $("#display-overlay-next");
	self.buttonReplay = $("#replay-button");
	self.nextCounter = $("#next-counter");

	SambaAdsPlayerMessageBroker().addEventListener(Event.COMPLETE, function(e){
		self.show();
		self.startCount();
		SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.DISPLAYING_NEXT);
	});


	self.buttonReplay.click(function(){
		SambaAdsPlayerMessageBroker().send(DoEvent.PLAY);
		SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.INITIALIZE);
		self.hide();
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURE_NEXT_ITEM, function(e){
		self.hide();
		$("#video-next-title").text(e.detail.data.title);
		$("#video-next-thumbnail").attr('src',e.detail.data.image);
	});

	self.nextCounter.click(function(){
		SambaAdsPlayerMessageBroker().send(DoEvent.PLAY_NEXT);
		self.hide();
	});
};



SambaAdsPlayerViewNext.prototype.show = function(){
	this.displayOverlayNext.show();
};

SambaAdsPlayerViewNext.prototype.startCount = function(){
	var self = this;
	self.i = 10;

	$('.progress-circle').circleProgress({
		value: 1.0,
		size: 36,
		lineCap: 'round',
		thickness: 2,
		emptyFill: 'rgba(255, 255, 255, 0.1)',
		animation: { duration: 12000 },
		fill: { color: '#fff' }
	});

	$("#counter-down").text(self.i);
	self.startNextIn = setInterval(function(){
		$("#counter-down").text(self.i);
		if(self.i==0){
			self.hide();
			SambaAdsPlayerMessageBroker().send(DoEvent.PLAY_NEXT);
			clearInterval(self.startNextIn);
		}
		self.i--
	},1000);
};

SambaAdsPlayerViewNext.prototype.clearCount = function(){
	clearInterval(this.startNextIn);
};


SambaAdsPlayerViewNext.prototype.hide = function(){
	this.displayOverlayNext.hide();
	this.clearCount();
};

new SambaAdsPlayerViewNext();
