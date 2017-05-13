var SambaAdsPlayerControllerCollector = {};

SambaAdsPlayerControllerCollector = function (){
	var self = this;

	self.trackLoad = function(e){
		var evtObject = new SambaAdsPlayerControllerCollectorTracker(TypeTrackEvent.EVENTS,{
            "satms": self.configuration.user,
            "satmtag": TypeTrackEvent.LOAD,
            "satmpid": self.configuration.client.hash_code,
            "satmoid": "",
            "satmcid": "",
            "satmref" : self.configuration.player.hostname,
            "satmfullref" : self.configuration.player.url,
            //"satm_playlist_id": this.response.player_info.playlist_id,
            "satmorigin": self.configuration.player.player_info.origin,
            'satmenv': self.configuration.player.player_info.environment
    		});
		self.sendGif(evtObject);
	};

	self.trackPlay = function(e){
		var evtObject = new SambaAdsPlayerControllerCollectorTracker(TypeTrackEvent.EVENTS,{
            "satms": self.configuration.user,
            "satmtag": TypeTrackEvent.PLAY,
            "satmpid": self.configuration.client.hash_code,
            "satmoid": self.media.owner_id,
            "satmmid": self.media.media_id,
            "satmcid": self.media.category_name,
            "satmref": self.configuration.player.hostname,
            //"satm_playlist_id": self.response.player_info.playlist_id,
            "satmfullref": self.configuration.player.url,
            "satmorigin": self.configuration.player.player_info.origin,
            "satmenv": self.configuration.player.player_info.environment
        });

		if(self.currentId != self.media.media_id){
			self.currentId = self.media.media_id;
			self.sendGif(evtObject);
		}
	};

	self.trackWatch = function(e){
		var position = e.detail.data.position;
		var duration = e.detail.data.duration;
		var percent = Math.floor(position/duration*100);
		var percent_frequency=2;

		if(percent < 0 ){
			percent = 0;
		} else if(percent > 100 ){
			percent = 100;
		}

		this.time_position = this.time_position || null;

		if((position != this.time_position) && (this.old_percent != percent)){

			this.time_position = parseInt(position);
			this.old_percent = parseInt(percent);
			
			duration = parseInt(duration) < 0 || isNaN(duration) ? 0 : parseInt(duration)

			var time_slot = parseFloat((parseInt(duration)*parseInt(percent_frequency)/100));
			time_slot = time_slot < 0 || isNaN(time_slot) ? 0 : time_slot;

			if(this.old_percent%percent_frequency == 0){

				var evtObject = new SambaAdsPlayerControllerCollectorTracker(TypeTrackEvent.WATCHED,{
	                "satm_session":  self.configuration.user,
					"satm_client_id": "",
				//	"satm_playlist_id": this.response.player_info.playlist_id,
					"satm_time_slot": time_slot,
					"satm_tag": "video.watched." + percent,
					"satm_site_id": self.configuration.client.hash_code,
					"satm_media_id": parseInt(self.media.media_id),
					"satm_channel_id": parseInt(self.media.channel_id || self.media.owner_id),
					"satm_domain": self.configuration.player.hostname,
					"satm_duration": duration,
					"satm_origin": self.configuration.player.player_info.origin,
					'satm_environment': self.configuration.player.player_info.environment
	        	});

				self.sendGif(evtObject);

				if((parseInt(self.media.media_id) == 112796) && (percent == 100)){
					self.trackPixel("https://00px.net/tracking/eyJjciI6MTM3OTUsImNhIjozMTIsInBsIjoxMDI4N30=/starts?" + Date.now());
				}
			}

		};

	};

	self.trackPixel = function(url){
		$.get(url).done(function(msg) {
			//alert("success load cont");
		}).error(function(){
			//alert("error load cont");
		});
	}

	self.sendGif = function(options){
		$.get('/* @echo COLLECTOR_URL */'+ options.event_type, options.params).done(function(msg) {
			//alert("success load cont");
		}).error(function(){
			//alert("error load cont");
		});
	};

	SambaAdsPlayerMessageBroker().addEventListener(Event.TRACK_LOAD, self.trackLoad);
	SambaAdsPlayerMessageBroker().addEventListener(Event.TRACK_WATCHED, self.trackWatch);
	SambaAdsPlayerMessageBroker().addEventListener(Event.AD_BEFORE_PLAY, self.trackPlay);

	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(e){
		self.configuration = e.detail.data;
		self.media = e.detail.data.playlist.playlist[0];
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAY_LIST_ITEM, function(e){
		self.media = e.detail.data;

		if((parseInt(self.media.media_id) == 112796)){
			self.trackPixel("https://00px.net/tracking/eyJjciI6MTM3OTUsImNhIjozMTIsInBsIjoxMDI4N30=/impressions?" + Date.now());
		}
	});
};

new SambaAdsPlayerControllerCollector();
