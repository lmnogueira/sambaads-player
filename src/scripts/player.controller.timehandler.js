var SambaAdsPlayerControllerTimeHandler = {};

SambaAdsPlayerControllerTimeHandler = function (){
	var self = this;

	// SambaAdsPlayerMessageBroker().addEventListener(Event.TIME, function(e){
	// 	self.watchedCount(Math.floor(e.detail.data.position), Math.floor(e.detail.data.duration));
	// });

	// SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(e){
	// 	self.client = e.detail.data.client;
	// });
};

SambaAdsPlayerControllerTimeHandler.prototype.watchedCount = function(position, duration){
	var percent = Math.floor(position/duration*100);
	var percent_frequency=2;

	if(percent < 0 ){
		percent = 0;
	} else if(percent > 100 ){
		percent = 100;
	}

	this.time_position = this.time_position || 0;

	if((position != this.time_position) && (this.old_percent != percent)){

		this.time_position = parseInt(position);
		this.old_percent = parseInt(percent);

		duration = parseInt(duration) < 0 || isNaN(duration) ? 0 : parseInt(duration)

		var time_slot = parseFloat((parseInt(duration)*parseInt(percent_frequency)/100));
		time_slot = time_slot < 0 || isNaN(time_slot) ? 0 : time_slot;

		if(this.old_percent%percent_frequency == 0){
			// this.sendGif_v2('watched',{
			// 	"satm_session": this.session(),
			// 	"satm_client_id": "",
			// 	"satm_playlist_id": this.response.player_info.playlist_id,
			// 	"satm_time_slot": time_slot,
			// 	"satm_tag": "video.watched." + percent,
			// 	"satm_site_id": this.response.publisher_info.hash_code || this.response.site_info.hash_code,
			// 	"satm_media_id": parseInt(this._options.playlist[this.currentPlaylistIndex].media_id),
			// 	"satm_channel_id": parseInt(this._options.playlist[this.currentPlaylistIndex].channel_id || this._options.playlist[this.currentPlaylistIndex].owner_id),
			// 	"satm_domain": "",
			// 	"satm_duration": duration,
			// 	"satm_origin": this.response.player_info.origin,
			// 	'satm_environment': this.response.player_info.environment
			// });
		}

	}
};

new SambaAdsPlayerControllerTimeHandler();

