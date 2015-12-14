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

	this._options = {};

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
        primary: "html",
        abouttext: "SambaAds - no cats playing piano.",
        aboutlink: "http://www.sambaads.com.br/publishers",
        advertising: {
            client:'googima',
            vpaidmode:'insecure',
            //client: "vast",
            admessage: "Anúncio publicitário terminará em XX segundos."
        }
    };

	new SambaAdsPlayerCore(player_config_options);
};

SambaAdsPlayerControler.prototype.getPlaylist = function(){
    return this._options.playlist;
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

