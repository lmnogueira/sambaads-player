var SambaAdsPlayerControllerCollectorTracker = {};

var TypeTrackEvent = {
	LOAD: "media.load",
	PLAY: "media.play"
};

SambaAdsPlayerControllerCollectorTracker = function (evt_type){
	var self = this;
	self.event_type = evt_type;
};


