var SambaAdsPlayerView = {};

SambaAdsPlayerView = function (){
	window.sambaads = window.sambaads || {};
	this.debug = true;
	this.displayOverlayShare 	 = document.getElementById("display-overlay-share");
	this.displayOverlayPlay 	 = document.getElementById("display-overlay-play");
	this.displayOverlayTitleShare 	 = document.getElementById("display-overlay-title-share");
	this.displayOverlayNextVideo = document.getElementById("display-overlay-next");

	this.playButtom = document.getElementById("display-buttom-play");
	this.videoTitleBar = document.getElementById("video-title-bar");
	this.videoTitle = document.getElementById("video-title");
};

SambaAdsPlayerView.prototype.showDisplay = function(option){
	var width = window.jwplayer(self.player).getWidth() + "px";
	var height = window.jwplayer(self.player).getHeight() + "px";

	$("#share-button-dock").hide();

	this.currentDisplay = option;
	this.displayOverlayPlay.style.display 		= "none";
	this.displayOverlayTitleShare.style.display 		= "none";
	$("#display-overlay-loader").hide();
	this.displayOverlayShare.style.display 		= "none";
	this.displayOverlayNextVideo.style.display 	= "none";

	if(option == 'play'){
		this.displayOverlayPlay.style.display = "block";
		this.displayOverlayTitleShare.style.display = "block";

		$("#video-title").show();
		$("#video-title").text(this.controller.getCurrentVideo().title);
		// $("#titlebar-title").text(this.controller.getCurrentVideo().title);

		this.setShareFacebookUrl("/* @echo FACEBOOK_SHARER_URL */?mid="+ this.controller.getCurrentVideo().media_id +"&pid="+this.controller.response.publisher_info.hash_code+"&t=" + this.controller.getCurrentVideo().title);
		this.setShareEmbed("<script src=\"/* @echo PLAYER_SCRIPT_URL */?"
		  			+ "m=" + this.controller.getCurrentVideo().media_id
		  			+ "&p=" + this.controller.response.publisher_info.hash_code
		  			+ "&sk=blue"
		  			+ "&tm=light"
		  			+ "&plp="
		  			+ "&plw="
		  			+ "&plh=&w=640&h=360\"></script>");

	} else if (option == 'buffer'){
		$("#display-overlay-loader").show();
	} else if (option == 'share'){

		var w = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

		var h = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

		if (w<h && (w <= 320)){
			$(".wrapper-share").css("top","10%");
			$(".close-button").css("z-index", "101");

			$("#btn-select-embed").css("margin-top","10px");
		}

		this.displayOverlayShare.style.display = "block";
	} else if (option == 'next-video'){
		this.displayOverlayNextVideo.style.display = "block";
	}

	$('#display-overlay').width(width);
	$('#display-overlay').height(height);
};

SambaAdsPlayerView.prototype.init = function(player, options){
	var self = this;
	self.player = player;
	self.options = options;

	self.showDisplay("play");

	if(options.playlist.length > 1)
		self.showPlaylist(options);

	$("#display-overlay-loader").hide();

	$("#display-overlay-play").click(function() {
		self.controller.play();
		self.updateItemCurrent();
	});

	document.getElementById("share-button-dock").onclick = function(){
		self.controller.shareLastState = self.controller.newstate;
		self.controller.play();
		self.showDisplay("share");
		$("#share-button-dock").hide();
	}

	document.getElementById("share-button").onclick = function(){
		self.controller.shareLastState = self.controller.newstate;

		if(self.controller.shareLastState == "PLAYING"){
			self.controller.play();
		}

		self.showDisplay("share");
	}

	document.getElementById("close-button").onclick = function(){
		self.showDisplay("play");

		if(self.controller.shareLastState == "PLAYING"){
			self.controller.play();
		}

		self.controller.shareLastState = self.controller.newstate;
	}

	document.getElementById("next-counter").onclick = function() {
		clearInterval(self.startNextIn);
		self.controller.playNext();
		self.updateItemCurrent();
	};

	document.getElementById("replay-button").onclick = function() {
		clearInterval(self.controller.startNextIn);
		window.jwplayer(self.player).play();
	};

	document.getElementById("btn-select-embed").onclick = function() {
		var input = document.getElementById("share-embed");

		input.select();
		input.focus();

		$("#btn-select-embed").text("ctrl + c para copiar");

		setTimeout(function(){
			$("#btn-select-embed").text("selecionar embed");
		},2000);
	};

	$( "div.sambaads-embed" )
	.mousemove(function(event) {
		$("#share-button-dock").css("z-index","2")

		if(self.controller.newstate != "IDLE" && self.controller.newstate != "PAUSED" && self.currentDisplay != "share"){
			$("#share-button-dock").show();
			$("#display-overlay-title-share").show();
		}
	})
	.mouseleave(function(event) {
		if(self.controller.newstate != "IDLE" && self.controller.newstate != "PAUSED" && self.currentDisplay != "share"){
			$("#share-button-dock").hide();
			$("#display-overlay-title-share").hide();
		}
	});
};

SambaAdsPlayerView.prototype.playVideo = function(video){
	this.playerSetup.playlist = [video];
	window.jwplayer(self.player).setup(this.playerSetup);
	this.init(self.player);
};

SambaAdsPlayerView.prototype.hideDisplay = function(){
	$("#display-overlay-loader").hide();
	this.displayOverlayPlay.style.display = "none";
	this.displayOverlayShare.style.display = "none";
	this.displayOverlayNextVideo.style.display = "none";
};

SambaAdsPlayerView.prototype.setShareLink = function(url){
	var input = document.getElementById("share-link");

	if(input)
		input.value = url;
}

SambaAdsPlayerView.prototype.setShareEmbed = function(embed){
	var input = document.getElementById("share-embed");

	if(input)
		input.value = embed;
}

SambaAdsPlayerView.prototype.setShareFacebookUrl = function(url){
	var button = document.getElementById("facebook-url-share");

	button.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
};

SambaAdsPlayerView.prototype.setController = function(controller){
	this.controller = controller;
};

SambaAdsPlayerView.prototype.log = function (msg){
	//console.log(msg);
};

SambaAdsPlayerView.prototype.updateItemCurrent = function(){
	var self = this;

	$("div.playlist-item").each(function(idex, item){
		if(item.id.indexOf(self.controller.currentPlaylistIndex) >= 0){
			$(item).find("span.video-duration").text("ASSISTINDO");
			$(item).find("span.video-duration").show();
		}

		if(item.id.indexOf(self.controller.lastPlaylistIndex) >= 0){
			if(self.controller.lastPlaylistIndex != self.controller.currentPlaylistIndex){
				$(item).find("span.video-duration").hide();
			}
		}
	});
};

SambaAdsPlayerView.prototype.showPlaylist = function(options){
	var self = this;

	self.vitem = $("#playlist-v-item");
	self.hitem = $("#playlist-h-item");

	$("#playlist-v-items").empty();
	$("#playlist-h-items").empty();

	if(options.position == "right"){
		$($.find("div.sambaads-playlist.vertical")[0]).addClass(options.playlistStyle);
		$("#playlist-h-items").hide();
		$("#sambaads-embed").addClass("pull-left");

		$(".nano").css( "height", window.jwplayer(self.player).getHeight() );
	}else if(options.position == "bottom-vertical"){
		$($.find("div.sambaads-playlist.vertical")[0]).addClass(options.playlistStyle);
		$("#playlist-h-items").hide();
		$("#playlist-v-items").show();

		$(".nano").css( "height", options.playlistHeight );
	}else if(options.position == "bottom-horizontal"){
		$($.find("div.sambaads-playlist.horizontal")[0]).addClass(options.playlistStyle);
		$("#playlist-h-items").show();
	}

	this.controller.getPlaylist().forEach(function(item){
		var new_v_item = self.vitem.clone();
		var new_h_item = self.hitem.clone();

		new_v_item.attr("id", "v-" + $("#playlist-v-items").children().length);//item.mediaid || item.id);
		new_h_item.find("div.playlist-item").attr("id", "h-" + $("#playlist-h-items").children().length);
		$(new_v_item).find("img").attr('src',item.image)
		$(new_h_item).find("img").attr('src',item.image)

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

		self.controller.loadPlaylist(+index);
		self.controller.play();

		self.updateItemCurrent();
	});
};

SambaAdsPlayerView.prototype.onPlay = function(){
	this.hideDisplay();

	this.controller.updateViewsCount(
			this.options.playlist[this.controller.currentPlaylistIndex].media_id,
			this.options.playlist[this.controller.currentPlaylistIndex].owner_id,
			this.options.playlist[this.controller.currentPlaylistIndex].category_name);

	if(this.options.playlist[this.controller.currentPlaylistIndex + 1]) {
		$("#video-next-title").text(this.options.playlist[this.controller.currentPlaylistIndex + 1].title);
		$("#video-next-thumbnail").attr('src',this.options.playlist[this.controller.currentPlaylistIndex + 1].image);
	}
}

SambaAdsPlayerView.prototype.onFullscreen = function(evt){
	var width = window.jwplayer(this.controller.player).getWidth() + "px";
	var height = window.jwplayer(this.controller.player).getHeight() + "px";

	if(!evt.fullscreen){
		this.fullscreenActive = false;
		$('#display-overlay').width(width);
		$('#display-overlay').height(height);
	} else {
		this.fullscreenActive = true;
	}
}

SambaAdsPlayerView.prototype.onComplete = function(){
	var self = this;
	var i = 10;

	if(self.controller.currentPlaylistIndex + 1 < self.options.playlist.length) {
		self.showDisplay("next-video");

		$('.progress-circle').circleProgress({
			value: 1.0,
			size: 36,
			lineCap: 'round',
			thickness: 2,
			emptyFill: 'rgba(255, 255, 255, 0.1)',
			animation: { duration: 12000 },
			fill: { color: '#fff' }
		});

		$("#counter-down").text(i);
		self.startNextIn = setInterval(function(){
			$("#counter-down").text(i);
			if(i==0){
				self.hideDisplay();
				self.controller.playNext();
				clearInterval(self.startNextIn);
				self.updateItemCurrent();
			}
			i--
		},1000);
	} else {
		self.showDisplay("play");
	}
};
