var SambaAdsPlayerControllerTimeHandler = {};

SambaAdsPlayerControllerTimeHandler = function (){
	var self = this;

	SambaAdsPlayerMessageBroker().addEventListener(Event.TIME, function(e){
		self.watchedCount(Math.floor(e.detail.data.position), Math.floor(e.detail.data.duration));
	});
};

SambaAdsPlayerControllerTimeHandler.prototype.watchedCount = function(position, duration){
	SambaAdsPlayerMessageBroker().send(Event.TRACK_WATCHED,{position:position, duration:duration});
};

new SambaAdsPlayerControllerTimeHandler();

