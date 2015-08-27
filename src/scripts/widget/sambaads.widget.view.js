var SambaAdsWidgetView = {};

SambaAdsWidgetView = function (){
	this.debug = true;
	this.displayOverlayShare 	 = document.getElementById("display-overlay-share");
	this.displayOverlayPlay 	 = document.getElementById("display-overlay-play");
	this.displayOverlayNextVideo = document.getElementById("display-overlay-next");
	
	this.playButtom = document.getElementById("display-buttom-play");
	this.videoTitleBar = document.getElementById("video-title-bar");
	this.videoTitle = document.getElementById("video-title");
	
};

SambaAdsWidgetView.prototype.showDisplay = function(option){};

SambaAdsWidgetView.prototype.init = function(widget){
	var self = this;
	this.controller = widget;

	self.showDisplay("play");

	if(this.controller.getPlaylist().length > 0)
		self.showPlaylist(self.options());
};

SambaAdsWidgetView.prototype.playVideo = function(video){
	this.playerSetup.playlist = [video];
};

SambaAdsWidgetView.prototype.hideDisplay = function(){
	$("#display-overlay-loader").hide();
	this.displayOverlayPlay.style.display = "none";
	this.displayOverlayShare.style.display = "none";
	this.displayOverlayNextVideo.style.display = "none";
};


SambaAdsWidgetView.prototype.updateItemCurrent = function(){
	var self = this;

	$("div.playlist-item").each(function(idex, item){
		if(item.id.indexOf(self.controller.currentPlaylistIndex) >= 0){
			$(item).find("span.video-duration").text("ASSISTIU");
			$(item).find("span.video-duration").show();
		}

		if(item.id.indexOf(self.controller.lastPlaylistIndex) >= 0){
			if(self.controller.lastPlaylistIndex != self.controller.currentPlaylistIndex){
				$(item).find("span.video-duration").hide();
			}
		}
	});
};

SambaAdsWidgetView.prototype.options = function(){
	var self = this;

	var playlistInfo = {}

	if ($(document).height() >= $(document).width()) {
		playlistInfo.plp = "bottom-vertical";
		playlistInfo.tm = "dark";
	} else {
		playlistInfo.plp = "right";
		playlistInfo.tm = "dark";
	}

	var _options = {
			position: this.controller.playerInfo.playlist_position || playlistInfo.plp,
			playlistStyle: this.controller.playerInfo.theme || playlistInfo.tm,
			playlist:[]
	};

	if (_options.position == "bottom-horizontal") {
		_options.playlistWidth = 0;
		_options.playlistHeight = 143;
	}

	return _options;
};


SambaAdsWidgetView.prototype.showPlaylist = function(options){
	var self = this;

	self.hitem = $("#playlist-h-item");

	$("#playlist-h-items").empty();

	if(options.position == "bottom-horizontal"){
		$($.find("div.sambaads-playlist.horizontal")[0]).addClass(options.playlistStyle);
		$("#playlist-h-items").show();
	}

	this.controller.getPlaylist().forEach(function(item){
		var new_h_item = self.hitem.clone();

		new_h_item.find("div.playlist-item").attr("id", "h-" + $("#playlist-h-items").children().length);

		$(new_h_item).find("img").attr('src',item.image);

		$(new_h_item).find("div.video-description h4 a").text(item.title.replace(/^(.{30}[^\s]*).*/, "$1") + "\n");

		$(new_h_item).find("a").attr('data-href', "/* @echo PLAYER_IFRAME_URL */" + self.controller.publisherInfo.hash_code + "?m=" + item.media_id);

		$("#playlist-h-items").append(new_h_item);
	});

	if(this.controller.getPlaylistSize() > 1){
		setTimeout(function(){
			var newWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			var newHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var maxRatio = newWidth/newHeight;
			var currentRatio;
			var ratio = 0;
			var heightControlsSlide = 66;

			$(".sambaads-playlist").show();

			$(".playlist-item").each(function(index, element){
				// var myImg = $(this).find("img")[0];
				// console.log(element);
				// console.log(myImg);
				// console.log(myImg.complete);

				var originalWidth = $(this).width();
				var originalHeight = $(this).height();
				currentRatio = originalHeight/originalWidth;

				if(currentRatio>maxRatio){
					ratio = (newWidth / originalWidth);
					$(this).height(originalHeight*ratio);
					$(this).width(newWidth - heightControlsSlide);
				}else{
					ratio = (newHeight / originalHeight);
					$(this).height(newHeight);
					$(this).width((originalWidth*ratio) - heightControlsSlide);
				}
			});

			var slide = $("#playlist-h-items").lightSlider({
				autoWidth: true,
				slideMove: 1,
				slideMargin: 10,
				mode: "slide",
				useCSS: true,
				loop: true,
				controls: true,
				prevHtml: '<i class="icon-previous"></i>',
		    nextHtml: '<i class="icon-next"></i>',
				pager: false,
				enableTouch:false,
		    enableDrag:false,
		    adaptiveHeight: false,
				onSliderLoad: function() {
					$('#autoWidth').removeClass('cS-hidden');
				}
			});

			// setTimeout(function(){
			// 	$(".playlist-item").each(function(index, element){
			// 		console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
			// 		console.log($(this).width());
			// 		console.log($(this).height());
			// 		console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
			// 		var heightDesc = $(this).find(".video-description").innerHeight();
			// 		$(this).height($(this).height() - heightDesc);
			// 		$(this).width($(this).width() - heightDesc);

			// 		console.log("******************************");
			// 		console.log(heightDesc);
			// 		console.log($(this).width());
			// 		console.log($(this).height());
			// 		console.log("******************************");
			// 	});

			// 	slide.refresh();
			// },2000);	
		},1000);
	}else{
		$(".sambaads-playlist").show();
	}

	$(".nano").nanoScroller();


	$( "div.playlist-item" ).click(function() {
		self.controller.play(this);
		self.updateItemCurrent();
	});
};

SambaAdsWidgetView.prototype.onPlay = function(){
	this.controller.updateViewsCount(
			this.options.playlist[this.controller.currentPlaylistIndex].media_id, 
			this.options.playlist[this.controller.currentPlaylistIndex].owner_id, 
			this.options.playlist[this.controller.currentPlaylistIndex].category_name);
};