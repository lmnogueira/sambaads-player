var SambaAdsPlayerControler = {};

SambaAdsPlayerControler = function (player, view, data){
	var self = this;
	self.data = data;

	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(e){
		self.init( e.detail.data );
	})

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAY_LIST_ITEM, function(e){

		var evtObject = new SambaAdsPlayerControlerCollectorTracker(TypeTrackEvent.LOAD);

		SambaAdsPlayerMessageBroker().send(Event.TRACKER,evtObject);
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAY, function(e){

		var evtObject = new SambaAdsPlayerControlerCollectorTracker(TypeTrackEvent.PLAY);

		SambaAdsPlayerMessageBroker().send(Event.TRACKER, evtObject);
	});

	SambaAdsPlayerMessageBroker().send(Event.PLATFORM_METADATA_LOADED, data);
};

SambaAdsPlayerControler.prototype.init = function(data){
	var self = this;
	this.configuration =  data;

	console.log(data)

	this._options = {};

	//this._options.playlist = data.playlist.playlist;


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
        visualplaylist: false,
        playlist: data.playlist.playlist,

        skin: {
        	name: 'sambaads',
        	url: '/stylesheets/skin/jw-skin-sambaads.css'
        },

        width: data.player.width,
        height: data.player.height,
        captions : captions,
        primary: "flash",
        abouttext: "SambaAds - no cats playing piano.",
        aboutlink: "http://www.sambaads.com.br/publishers"
    };

    if(!data.player.custom_tag){
    	delete player_config_options.advertising;
	} else {
		delete player_config_options.plugins;
	}

	new SambaAdsPlayerCore(player_config_options);
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

