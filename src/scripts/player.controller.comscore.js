var SambaAdsPlayerControllerComscore = {};

SambaAdsPlayerControllerComscore = function (){
	var self = this;

	self.trackLoad = function(e){
		setTimeout(function(){
			self.computeComscore("04",self.media.category_name);
			self.computeComscore("01","sambaads_video_advertising");
		}, 500);
	};

	self.trackPlay = function(e){
		if(self.currentId != self.media.media_id){
			self.currentId = self.media.media_id;
			self.computeComscore("04", self.media.category_name);
		}
	};

	self.computeComscore = function(c5,c3) {
		setTimeout(function(){
			window.COMSCORE.beacon({
			    c1: 1,
			    c2: "15752844",
			    c3: c3,
			    c4: "",
			    c5: c5,
			    c6: "",
			    c10: ""
			});
		}, 500);
	};


	SambaAdsPlayerMessageBroker().addEventListener(Event.TRACK_LOAD, self.trackLoad);
	SambaAdsPlayerMessageBroker().addEventListener(Event.AD_BEFORE_PLAY, self.trackPlay);

	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(e){
		self.configuration = e.detail.data;
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAY_LIST_ITEM, function(e){
		self.media = e.detail.data.item;
	});
};

new SambaAdsPlayerControllerComscore();