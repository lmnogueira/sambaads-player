var SambaAdsPlayerController = {};

SambaAdsPlayerController = function (player, view, data){
	var self = this;
	self.data = data;

	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(e){
		self.init( e.detail.data );
        SambaAdsPlayerMessageBroker().send(Event.TRACK_LOAD,{});
	});
	
	SambaAdsPlayerMessageBroker().send(Event.PLATFORM_METADATA_LOADED, data);
};

SambaAdsPlayerController.prototype.init = function(data){
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
        abouttext: "YContent - Dê play para começar.",
        aboutlink: "http://www.ycontent.com.br/publishers",
        advertising: {
            client:'googima',
            vpaidmode:'enabled',
            //client: "vast",
            admessage: "Anúncio publicitário terminará em xx segundos."
        }
    };

	new SambaAdsPlayerCore(player_config_options);
};

SambaAdsPlayerController.prototype.getPlaylist = function(){
    return this._options.playlist;
};



SambaAdsPlayerController.prototype.setMute = function(mute){
	if( typeof Boolean(mute) === 'boolean'){
		window.jwplayer(this.player).setMute(mute);			
	}
};

SambaAdsPlayerController.prototype.play = function(){
    window.jwplayer(this.player).play();
};

SambaAdsPlayerController.prototype.pause = function(){
    window.jwplayer(this.player).pause();
};

SambaAdsPlayerController.prototype.seekTo = function(seek_to){
    window.jwplayer(this.player).seek(seek_to);
};

SambaAdsPlayerController.prototype.stop = function(){
    window.jwplayer(this.player).stop();
};

SambaAdsPlayerController.prototype.playNext = function(){
    this.loadPlaylist(this.currentPlaylistIndex + 1);
	window.jwplayer(this.player).play();
};

