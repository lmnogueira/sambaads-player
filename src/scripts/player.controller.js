var SambaAdsPlayerControler = {};

SambaAdsPlayerControler = function (player, view, data){
	var self = this;

	SambaAdsPlayerMessageBroker().send(Event.PLATFORM_METADATA_LOADED, data);
	self.init( data );
};

SambaAdsPlayerControler.prototype.init = function(data){
	var self = this;
	this.response =  data ;

	this._options = {
			//position:"rigth",
			//position:"bottom-vertical",
			//position:"bottom-horizontal",
			position: this.response.player_info.playlist_position || self.discoveryPlaylistInfo().plp,
			playlistStyle: this.response.player_info.theme || self.discoveryPlaylistInfo().tm,
			playlist:[]
	};

	if (this._options.position == "right") {
		this._options.playlistHeight = 0;
		this._options.playlistWidth = this.response.player_info.playlist_width   || 280;
	}

	if (this._options.position == "bottom-vertical") {
		this._options.playlistHeight = this.response.player_info.playlist_height || 150;
		this._options.playlistWidth = 0;
	} 

	if (this._options.position == "bottom-horizontal") {
		this._options.playlistWidth = 0;
		this._options.playlistHeight = 143;
	}

	this._options.playlist = this.response.playlist;

	//calculate player size
	var player_width = this.calculatePlayerWidth();
	var player_height = this.calculatePlayerHeight();

	var captions = {
                color: '#FFFFFF',
                fontSize: 12,
                fontFamily: 'verdana-bold, verdana',
                fontOpacity: 100,
                backgroundColor: '#000000',
                backgroundOpacity: 0,
                edgeStyle: 'dropshadow',
                windowColor: '#000000',
                windowOpacity: 0
    };


        //advertising:{
        //  client:'vast',
        //  tag: decodeURIComponent(this.response.player_info.custom_tag)
        //},
        
        //plugins: {
        //      '/* @echo LIVERAIL_PLUGIN_URL */' : {
     	//		'LR_ADMAP': 'in::0',
        //        'LR_URL': this.discoveryHost(),
        //        'LR_TAGS': this.response.publisher_info.auto_start ? "autostart" : "normal"
        //    }
        //},
        //skin: "http:" + this.response.player_info.skin_url,
    var player_config_options = {
        displaytitle: false,
        displaydescription: false,
        playlist: this._options.playlist,

        width: player_width,
        height: player_height,
        captions : captions,
        primary: "flash",
        abouttext: "SambaAds - no cats playing piano.",
        aboutlink: "http://www.sambaads.com.br/publishers"
    };

    if(!this.response.player_info.custom_tag){
    	delete player_config_options.advertising;
	} else {
		delete player_config_options.plugins;
	}

	new SambaAdsPlayerCore(player_config_options);
};

SambaAdsPlayerControler.prototype.calculatePlayerHeight = function(){
	var player_height = 0;
	if($("#titlebar").is(':visible')){
		player_height = ( $( document ).height() - $("#titlebar").outerHeight());

	} else {
		player_height = ( $( document ).height());
	};

	if(this._options.playlist.length > 1){
		player_height = player_height - this._options.playlistHeight;
	};

	return player_height;
};

SambaAdsPlayerControler.prototype.calculatePlayerWidth = function(){
	var player_width = 0;

	player_width = $( document ).width();

	if(this._options.playlist.length > 1){
		player_width = player_width - this._options.playlistWidth;
	};
    
    return player_width;
};

SambaAdsPlayerControler.prototype.getPlaylist = function(){
    return this._options.playlist;
};

SambaAdsPlayerControler.prototype.loadPlaylist = function(index){
	if(this.currentPlaylistIndex != index){
		this.stop();
		this.lastPlaylistIndex = this.currentPlaylistIndex;
		this.currentPlaylistIndex = index;
		this._options.playlist[index].running_youtube = false;
		window.jwplayer(this.player).load([this._options.playlist[index]]);
	}

	this.view.videoTitle.innerHTML = this._options.playlist[index].title;
};

SambaAdsPlayerControler.prototype.setMute = function(mute){
	if( typeof Boolean(mute) === 'boolean'){
		window.jwplayer(this.player).setMute(mute);			
	}
};

SambaAdsPlayerControler.prototype.play = function(){
    window.jwplayer(this.player).play();
    //window.jwplayer(this.player).callInternal("jwCallVPAID", "pauseAd");
};

SambaAdsPlayerControler.prototype.pause = function(){
    window.jwplayer(this.player).pause();
    //window.jwplayer(this.player).callInternal("jwCallVPAID", "pauseAd");
};

SambaAdsPlayerControler.prototype.seekTo = function(seek_to){
    window.jwplayer(this.player).seek(seek_to);
};

SambaAdsPlayerControler.prototype.stop = function(){
    window.jwplayer(this.player).stop();
};

SambaAdsPlayerControler.prototype.playNext = function(){
    this.loadPlaylist(this.currentPlaylistIndex + 1);
	window.jwplayer(this.player).play();
};

