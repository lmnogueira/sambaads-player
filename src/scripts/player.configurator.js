var SambaAdsPlayerConfigurator = {};

SambaAdsPlayerConfigurator = function (){
	var self = this;
	self.pertmitWidthAutoStart = 320;
	
	self.configuration = {
		playlist : {},
		player: {}
	};

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLATFORM_METADATA_LOADED, function(e){
		self.configurePlaylist(e.detail.data);
		self.configurePlayer(e.detail.data);
		self.configureClient(e.detail.data);

		SambaAdsPlayerMessageBroker().send(Event.CONFIGURATION_READY, self.configuration);
	});
};

SambaAdsPlayerConfigurator.prototype.configurePlayer = function(data){
	var self = this; 
	var calculatePlayerHeight = function(){
		var player_height = 0;
		if($("#titlebar").is(':visible')){
			player_height = ( $( document ).height() - $("#titlebar").outerHeight());

		} else {
			player_height = ( $( document ).height());
		};

		if(self.configuration.playlist.playlist.length > 1){
			player_height = player_height - self.configuration.playlist.playlistHeight;
		};

		return player_height;
	};

	var calculatePlayerWidth = function(){
		var player_width = 0;

		player_width = $( document ).width();

		if(self.configuration.playlist.playlist.length > 1){
			player_width = player_width -  self.configuration.playlist.playlistWidth;
		};
	    return player_width;
	};

	self.configuration.player.width = calculatePlayerWidth();
	self.configuration.player.height = calculatePlayerHeight();
	self.configuration.player.pertmitWidthAutoStart = self.pertmitWidthAutoStart;

};

SambaAdsPlayerConfigurator.prototype.configureClient = function(data){
	var self = this;
	self.configuration.client = data.publisher_info;
};

SambaAdsPlayerConfigurator.prototype.configurePlaylist = function(data){
	var self = this;

	//legacy support
	var discoveryPlaylistInfo = function(){
		var playlistInfo = {};

		if ($(document).height() >= $(document).width()) {
			playlistInfo.plp = "bottom-vertical";
			playlistInfo.tm = "dark";
		} else {
			playlistInfo.plp = "right";
			playlistInfo.tm = "dark";
		}
		return playlistInfo;
	};

	options = {
			position: data.player_info.playlist_position || discoveryPlaylistInfo().plp,
			playlistStyle: data.player_info.theme || discoveryPlaylistInfo().tm,
			playlist: data.playlist
	};

	if (options.position == "right") {
		options.playlistHeight = 0;
		options.playlistWidth = data.player_info.playlist_width   || 280;

	} else if (options.position == "bottom-vertical") {
		options.playlistHeight = data.player_info.playlist_height || 150;
		options.playlistWidth = 0;

	} else if (options.position == "bottom-horizontal") {
		options.playlistWidth = 0;
		options.playlistHeight = 143;
	}

	SambaAdsPlayerMessageBroker().send(Event.PLAYLIST_CONFIGURED, options);
	self.configuration.playlist = options;
};

new SambaAdsPlayerConfigurator();

