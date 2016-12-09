var SambaAdsPlayerControllerComscore = {};

SambaAdsPlayerControllerComscore = function (){
	var self = this;

	self.trackLoad = function(e){
		setTimeout(function(){
			self.computeComscore("04",self.media.category_name);
			self.computeComscore("01","sambaads_video_advertising");
		}, 1000);
	};

	self.trackPlay = function(e){
		if(self.currentId != self.media.media_id){
			setTimeout(function(){
				self.currentId = self.media.media_id;
				self.computeComscore("04", self.media.category_name);
			}, 1000);	
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
		self.media = self.configuration.playlist.playlist[0];
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAY_LIST_ITEM, function(e){
		self.media = e.detail.data.item;
	});
};

new SambaAdsPlayerControllerComscore();