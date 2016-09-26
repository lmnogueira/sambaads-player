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
		self.resolveParams();

		self.configureDimensions();

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

SambaAdsPlayerConfigurator.prototype.resolveParams = function(){
	this.configuration.player.params = this.parseQueryString(window.location.href);
};

SambaAdsPlayerConfigurator.prototype.configureDimensionsPlayer = function(){
	this.configuration.player.width = this.calculatePlayerWidth();
	this.configuration.player.height = this.calculatePlayerHeight();
	this.configuration.player.pertmitWidthAutoStart = this.pertmitWidthAutoStart;
}

SambaAdsPlayerConfigurator.prototype.configureDimensionsPlaylist = function(){

	this.configuration.playlist.position = "right";
	this.configuration.playlist.position = this.configuration.player.params.plp || this.metadata.player_info.playlist_position;

	if(this.configuration.playlist.position === "r" || this.configuration.playlist.position === "right"){
		this.configuration.playlist.position = "right";
		this.configuration.playlist.playlistHeight = this.calculatePlayerHeight();
		this.configuration.playlist.playlistWidth = this.configuration.player.params.plw || 300;
	}
	else if(this.configuration.playlist.position === "bv" || this.configuration.playlist.position === "bottom-vertical"){
		this.configuration.playlist.position = "bottom-vertical";
		this.configuration.playlist.playlistHeight = 150;
		this.configuration.playlist.playlistWidth = 0;
	}
	else if(this.configuration.playlist.position === "bh" || this.configuration.playlist.position === "bottom-horizontal"){
		this.configuration.playlist.position = "bottom-horizontal";
		this.configuration.playlist.playlistWidth = 0;
		this.configuration.playlist.playlistHeight = 143;
	}

	if( ($(document).height() >= $(document).width()) || /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		this.configuration.playlist.position = "bottom-vertical";
		this.configuration.playlist.playlistStyle = "dark";
		this.configuration.playlist.playlistHeight = 150;
		this.configuration.playlist.playlistWidth = 0;
	}
}


SambaAdsPlayerConfigurator.prototype.configureDimensions = function(){
	var self = this;

	this.configureDimensionsPlaylist();
	this.configureDimensionsPlayer();

	console.log(self.configuration);
}

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

SambaAdsPlayerConfigurator.prototype.parseQueryString = function( url ) {

        var queryString = url.split("?")[1],
            params = {}, queries, temp, i, l;

        // Split into key/value pairs
        try{
            queries = queryString.split("&");

            // Convert the array of strings into an object
            for ( i = 0, l = queries.length; i < l; i++ ) {
                temp = queries[i].split('=');
                params[temp[0]] = temp[1];
            }
        } catch (e){
            //console.log(e);
        }

        return params;
};

SambaAdsPlayerConfigurator.prototype.configurePlayer = function(){
	var self = this;

	var url = document.referrer || window.location.href
    var a = $('<a>', { href:url } )[0];

    self.configuration.player.hostname = a.hostname;
    self.configuration.player.url = encodeURIComponent(url);
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

	self.configuration.playlist.playlistStyle = self.configuration.player.params.tm || self.metadata.player_info.theme;
	self.configuration.playlist.playlist = self.metadata.playlist;
	//self.configuration.playlist.playlist = [];

	SambaAdsPlayerMessageBroker().send(Event.PLAYLIST_CONFIGURED, self.configuration.playlist);
};

new SambaAdsPlayerConfigurator();

