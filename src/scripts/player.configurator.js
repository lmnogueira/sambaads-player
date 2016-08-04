var SambaAdsPlayerConfigurator = {};

SambaAdsPlayerConfigurator = function (){
	var self = this;
	self.pertmitWidthAutoStart = 320;
	
	self.configuration = {
		playlist : {},
		player: {},
		user: {}
	};

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLATFORM_METADATA_LOADED, function(e){
		self.metadata = e.detail.data;
		self.configurePlaylist();

		self.configurePlayer();
		self.configureClient();
		self.configureUser();
		SambaAdsPlayerMessageBroker().send(Event.CONFIGURATION_READY, self.configuration);
		

		
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.READY, function(e){
		try{
			var skin = self.configuration.player.player_info.skin_url.split('/');
	        $("#jw_sambaads_player").toggleClass(skin[skin.length-1].split('.')[0]);
		} catch(e){
			console.error(e);
		}
	});
};

SambaAdsPlayerConfigurator.prototype.generateGuid = function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
	        .toString(16)
	        .substring(1);
		};
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

};

SambaAdsPlayerConfigurator.prototype.setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

SambaAdsPlayerConfigurator.prototype.getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

SambaAdsPlayerConfigurator.prototype.session = function() {
	var cookie = this.getCookie("sambaads_player_session");

	if (!cookie) {
		this.setCookie("sambaads_player_session", this.generateGuid(), 365);
	}

	return cookie;
};

SambaAdsPlayerConfigurator.prototype.calculatePlayerHeight = function(){
	var self = this;
	var player_height = 0;


	if($("#titlebar").is(':visible')){
		player_height = ( $( document ).height() - $("#titlebar").outerHeight());

	} else {
		player_height = ( $( document ).height());
	};


	 console.log(self.configuration.playlist.position);

	if(self.metadata.playlist.length > 1 && self.configuration.playlist.position && self.configuration.playlist.position != "right"){
		player_height = player_height - self.configuration.playlist.playlistHeight;
	};

	return player_height;
};

SambaAdsPlayerConfigurator.prototype.calculatePlayerWidth = function(){
	var self = this;
	var player_width = 0;

	player_width = $( document ).width();

	if(self.metadata.playlist.length > 1){
		player_width = player_width - self.configuration.playlist.playlistWidth;
	};

    return player_width;
};

SambaAdsPlayerConfigurator.prototype.configurePlayer = function(){
	var self = this; 

	var url = document.referrer || window.location.href
    var a = $('<a>', { href:url } )[0];

    self.configuration.player.hostname = a.hostname;
    self.configuration.player.url = encodeURIComponent(url);
	self.configuration.player.width = self.calculatePlayerWidth();
	self.configuration.player.height = self.calculatePlayerHeight();
	self.configuration.player.pertmitWidthAutoStart = self.pertmitWidthAutoStart;
	self.configuration.player.player_info = self.metadata.player_info;
};

SambaAdsPlayerConfigurator.prototype.configureClient = function(){
	var self = this;
	self.configuration.client = self.metadata.publisher_info;
	self.configuration.user = self.session();
};

SambaAdsPlayerConfigurator.prototype.configureUser = function(){
	var self = this;
	self.configuration.user = self.session();
};

SambaAdsPlayerConfigurator.prototype.configurePlaylist = function(){
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

			position: self.metadata.player_info.playlist_position || discoveryPlaylistInfo().plp,
			playlistStyle: self.metadata.player_info.theme || discoveryPlaylistInfo().tm,
			playlist: self.metadata.playlist
	};

	if (options.position == "right") {
		options.playlistHeight = self.calculatePlayerHeight();
		options.playlistWidth = self.metadata.player_info.playlist_width || 280;

	} else if (options.position == "bottom-vertical") {
		options.playlistHeight = self.metadata.player_info.playlist_height || 150;
		options.playlistWidth = 0;

	} else if (options.position == "bottom-horizontal") {
		options.playlistWidth = 0;
		options.playlistHeight = 143;
		self.metadata.player_info.playlist_height = options.playlistHeight;
	}

	self.configuration.playlist = options;
	SambaAdsPlayerMessageBroker().send(Event.PLAYLIST_CONFIGURED, options);
};

new SambaAdsPlayerConfigurator();

