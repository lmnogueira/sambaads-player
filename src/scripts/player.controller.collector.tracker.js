var SambaAdsPlayerControlerCollectorTracker = {};

var TypeTrackEvent = {
	LOAD: "media.load",
	PLAY: "media.play"
};

SambaAdsPlayerControlerCollectorTracker = function (evt_type){
	var self = this;
	self.event_type = evt_type;	
};


