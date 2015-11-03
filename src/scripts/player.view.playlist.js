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
		
		console.log(">>> implementar valors de layout dinamicos para playlist")
		self.applyStyle("light", "right", self.player_height);
	});

	SambaAdsPlayerMessageBroker().addEventListener(Event.PLATFORM_METADATA_LOADED, function(e){
		self.init(e.detail.data);
	});
};

SambaAdsPlayerViewPlaylist.prototype.applyStyle = function(theme, position, height){
	var self = this;

	if(position == "right"){
		$($.find("div.sambaads-playlist.vertical")[0]).addClass(theme);
		$("#playlist-h-items").hide();
		$("#sambaads-embed").addClass("pull-left");
		
		$(".nano").css( "height", height);
	}else if(position == "bottom-vertical"){
		$($.find("div.sambaads-playlist.vertical")[0]).addClass(theme);
		$("#playlist-h-items").hide();
		$("#playlist-v-items").show();
		
		$(".nano").css( "height", height );
	}else if(position == "bottom-horizontal"){
		$($.find("div.sambaads-playlist.horizontal")[0]).addClass(theme);
		$("#playlist-h-items").show();
	}
};

SambaAdsPlayerViewPlaylist.prototype.init = function(options){
	var self = this;
	self.cleanPlaylist();

	options.playlist.forEach(function(item){
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


	$( "div.playlist-item" ).click(function() {
		var index = this.id.split("-")[1];

		/*
		self.controller.loadPlaylist(+index);
		self.controller.play();

		self.updateItemCurrent();
		*/
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
	} else if(type="horizontal"){
		return self.horizontal_factory_item.clone();
	}
};

new SambaAdsPlayerViewPlaylist();