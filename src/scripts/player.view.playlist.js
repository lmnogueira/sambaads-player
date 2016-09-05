var SambaAdsPlayerViewPlaylist = {};

SambaAdsPlayerViewPlaylist = function (){
	var self = this;
	self.vertical_factory_item = $("#playlist-v-item");
	self.horizontal_factory_item = $("#playlist-h-item");
	self.player_width = 0;
	self.player_height = 0;
	self.lastPlaylistIndex = 0;
	self.currentPlaylistIndex = 0;
	self.nextPlaylistIndex = 1;


	SambaAdsPlayerMessageBroker().addEventListener(Event.RESIZE, function(e){
		self.player_width = e.detail.data.width;
		self.player_height = e.detail.data.height;
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAYLIST_CONFIGURED, function(e){
		self.applyStyle(e.detail.data.playlistStyle, e.detail.data.position, e.detail.data.playlistWidth, e.detail.data.playlistHeight);
		self.init(e.detail.data);
	});

	SambaAdsPlayerMessageBroker().addEventListener(DoEvent.PLAY_NEXT, function(e){
		self.playNext();
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAY, function(e){
		self.updateItemCurrent();
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAYER_STATE_CHANGE, function(evt){
		//self.updateItemCurrent();
		self.currentState = evt.detail.data.newState;
	});
};

SambaAdsPlayerViewPlaylist.prototype.applyStyle = function(theme, position, width, height){
	var self = this;

	if(position == "right"){
		$($.find("div.sambaads-playlist.vertical")[0]).addClass(theme);
		$("#playlist-h-items").hide();
		$("#sambaads-embed").addClass("pull-left");

		$(".nano").css( "height", height );
	}else if(position == "bottom-vertical"){
		$($.find("div.sambaads-playlist.vertical")[0]).addClass(theme);
		$("#playlist-h-items").hide();
		$("#playlist-v-items").show();

		$(".nano").css( "height", height);
	}else if(position == "bottom-horizontal"){
		$($.find("div.sambaads-playlist.horizontal")[0]).addClass(theme);
		$("#playlist-h-items").show();

		//$(".nano").css( "height", height);
	}
};

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

SambaAdsPlayerViewPlaylist.prototype.init = function(options){
	var self = this;
	self.cleanPlaylist();
	self.playlist = options.playlist;

	for (var i=0; i<self.playlist.length; i++){
		if(self.playlist[i].sponsored){
			break;
		}
	}

	if(self.playlist[i] && self.playlist[i].sponsored){
	  	self.playlist.move(i,0);
	}

	self.playlist.forEach(function(item){

		var new_v_item = self.clone("vertical");
		var new_h_item = self.clone("horizontal");

		new_v_item.attr("id", "v-" + $("#playlist-v-items").children().length);//item.mediaid || item.id);
		new_h_item.find("div.playlist-item").attr("id", "h-" + $("#playlist-h-items").children().length);
		
		if (window.location.protocol != "https:"){
			item.image = item.image.replace('https:', window.location.protocol);
			item.thumbnails["90"] = item.thumbnails["90"].replace('https:', window.location.protocol);
		}

    	if(item.sponsored){
			new_v_item.addClass("highlight");
			new_h_item.addClass("highlight");

			$(new_v_item).find('span.label-patrocinado').show();
			$(new_h_item).find('span.label-patrocinado').show();
		}

		$(new_v_item).find("img").attr('src',item.thumbnails["90"] || item.image);
		$(new_h_item).find("img").attr('src',item.thumbnails["90"] || item.image);

		$(new_v_item).find("div.video-description h4 a").text(item.title.replace(/^(.{30}[^\s]*).*/, "$1") + "\n");
		$(new_h_item).find("div.video-description h4 a").text(item.title.replace(/^(.{30}[^\s]*).*/, "$1") + "\n");

		$("#playlist-v-items").append(new_v_item);
		$("#playlist-h-items").append(new_h_item);
	});

	$(".sambaads-playlist").show();

	$("#playlist-h-items").lightSlider({
		item: 3,
		autoWidth: true,
		slideMove: 1, // slidemove will be 1 if loop is true
		slideMargin: 0,
		mode: "slide",
		useCSS: true,
		loop: true,
		controls: true,
		prevHtml: '<i class="icon-previous"></i>',
        nextHtml: '<i class="icon-next"></i>',
		pager: false,
		enableTouch:false,
        enableDrag:false,
		onSliderLoad: function() {
			$('#autoWidth').removeClass('cS-hidden');
		}
	});

	$(".nano").nanoScroller();


	$( "div.playlist-item" ).click(function(e) {
		if(self.currentState == "playing" || self.currentState == "idle" || self.currentState == "paused"){
			var index = this.id.split("-")[1];

			index = +index;

			if(self.currentPlaylistIndex != index){
					SambaAdsPlayerMessageBroker().send(DoEvent.STOP);
					self.updateIndex(index);

					self.playlist[index].running_youtube = false;
				
					SambaAdsPlayerMessageBroker().send(DoEvent.LOAD_MEDIA, self.playlist[index]);
					SambaAdsPlayerMessageBroker().send(DoEvent.PLAY);
			} else {
				SambaAdsPlayerMessageBroker().send(DoEvent.PLAY);
			}
			self.updateItemCurrent();
		}
	});
};

SambaAdsPlayerViewPlaylist.prototype.playNext = function(){
	var self = this;

	self.updateIndex();

	SambaAdsPlayerMessageBroker().send(Event.VIEW_STATE_CHANGE, PlayerViewState.INITIALIZE);
	SambaAdsPlayerMessageBroker().send(DoEvent.LOAD_MEDIA, self.playlist[self.currentPlaylistIndex]);
	SambaAdsPlayerMessageBroker().send(DoEvent.PLAY);

};

SambaAdsPlayerViewPlaylist.prototype.updateItemCurrent = function(){
	var self = this;
	
	$("div.playlist-item").each(function(idex, item){
		if(item.id.indexOf("-" + self.currentPlaylistIndex) >= 0){
			$(item).find("span.video-duration").text("ASSISTINDO");
			$(item).find("span.video-duration").show();
		}

		if(item.id.indexOf("-" + self.lastPlaylistIndex) >= 0){
			if(self.lastPlaylistIndex != self.currentPlaylistIndex){
				$(item).find("span.video-duration").hide();
			}
		}
	});

	if(self.playlist.length > 1 && self.nextPlaylistIndex < self.playlist.length)
		SambaAdsPlayerMessageBroker().send(Event.CONFIGURE_NEXT_ITEM, self.playlist[self.nextPlaylistIndex]);
};

SambaAdsPlayerViewPlaylist.prototype.cleanPlaylist = function(playlist){
	$("#playlist-v-items").empty();
	$("#playlist-h-items").empty();
};

SambaAdsPlayerViewPlaylist.prototype.show = function(){
};

SambaAdsPlayerViewPlaylist.prototype.hide = function(){
};

SambaAdsPlayerViewPlaylist.prototype.clone = function(type){
	var self = this;
	if(type=="vertical"){
		return self.vertical_factory_item.clone();
	} else if(type=="horizontal"){
		return self.horizontal_factory_item.clone();
	}
};

SambaAdsPlayerViewPlaylist.prototype.updateIndex = function(index){
	var self = this;

	self.lastPlaylistIndex = self.currentPlaylistIndex;
	self.currentPlaylistIndex = index >= 0 ? index : (self.currentPlaylistIndex + 1);
	self.nextPlaylistIndex = self.currentPlaylistIndex + 1;

	if(self.currentPlaylistIndex == self.playlist.length-1){
		self.nextPlaylistIndex = 0;
	}

	if(self.currentPlaylistIndex > self.playlist.length-1){
		self.currentPlaylistIndex = 0;
	}
};

new SambaAdsPlayerViewPlaylist();