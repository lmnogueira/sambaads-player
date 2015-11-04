var SambaAdsPlayerViewPlaylist = {};

SambaAdsPlayerViewPlaylist = function (){
	var self = this;
	self.vertical_factory_item = $("#playlist-v-item");
	self.horizontal_factory_item = $("#playlist-h-item");
	self.player_width = 0;
	self.player_height = 0;


	SambaAdsPlayerMessageBroker().addEventListener(Event.RESIZE, function(e){
		self.player_width = e.detail.data.width;
		self.player_height = e.detail.data.height;

		$(".nano").css( "height", self.player_height);
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAYLIST_CONFIGURED, function(e){
		self.applyStyle(e.detail.data.playlistStyle, e.detail.data.position);
		self.init(e.detail.data);
	});
};

SambaAdsPlayerViewPlaylist.prototype.applyStyle = function(theme, position){
	var self = this;

	if(position == "right"){
		$($.find("div.sambaads-playlist.vertical")[0]).addClass(theme);
		$("#playlist-h-items").hide();
		$("#sambaads-embed").addClass("pull-left");
	}else if(position == "bottom-vertical"){
		$($.find("div.sambaads-playlist.vertical")[0]).addClass(theme);
		$("#playlist-h-items").hide();
		$("#playlist-v-items").show();
	}else if(position == "bottom-horizontal"){
		$($.find("div.sambaads-playlist.horizontal")[0]).addClass(theme);
		$("#playlist-h-items").show();
	}
};

SambaAdsPlayerViewPlaylist.prototype.init = function(options){
	var self = this;
	self.cleanPlaylist();
	self.playlist = options.playlist;

	self.playlist.forEach(function(item){
		var new_v_item = self.clone("vertical");
		var new_h_item = self.clone("horizontal");

		new_v_item.attr("id", "v-" + $("#playlist-v-items").children().length);//item.mediaid || item.id);
		new_h_item.find("div.playlist-item").attr("id", "h-" + $("#playlist-h-items").children().length);
		$(new_v_item).find("img").attr('src',item.image);
		$(new_h_item).find("img").attr('src',item.image);

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
		var index = this.id.split("-")[1];

		index = +index;

		if(self.currentPlaylistIndex != index){
			SambaAdsPlayerMessageBroker().send(DoEvent.STOP);

			self.lastPlaylistIndex = self.currentPlaylistIndex;
			self.currentPlaylistIndex = index;

			self.playlist[index].running_youtube = false;

			SambaAdsPlayerMessageBroker().send(DoEvent.LOAD_MEDIA, self.playlist[index]);
			SambaAdsPlayerMessageBroker().send(DoEvent.PLAY);
		}

		self.updateItemCurrent();
		
	});
};

SambaAdsPlayerViewPlaylist.prototype.updateItemCurrent = function(){
	var self = this;
	
	$("div.playlist-item").each(function(idex, item){
		if(item.id.indexOf(self.currentPlaylistIndex) >= 0){
			$(item).find("span.video-duration").text("ASSISTINDO");
			$(item).find("span.video-duration").show();
		}

		if(item.id.indexOf(self.lastPlaylistIndex) >= 0){
			if(self.lastPlaylistIndex != self.currentPlaylistIndex){
				$(item).find("span.video-duration").hide();
			}
		}
	});
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

new SambaAdsPlayerViewPlaylist();