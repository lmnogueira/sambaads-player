// var SambaAdsPlayerAdvertising = {};

SambaAdsPlayerAdvertising = function (){
 	var self = this;
 	self.abort_ad = false;

 	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(e){
		self.client = e.detail.data.client;
		self.player = e.detail.data.player;
		self.user = e.detail.data.user;
		self.navegg = e.detail.data.navegg_perfil;
		self.playingNow = e.detail.data.playlist.playlist[0];
	});

 	SambaAdsPlayerMessageBroker().addEventListener(Event.AD_BEFORE_PLAY, function(e){
        e.preventDefault();
        e.stopPropagation();

 		var tags = self.playingNow.dfp_tags;
 		var navegg_tags = "nvg_gender="+ self.navegg.gender
 		+ "&nvg_age=" + self.navegg.age
 		+ "&nvg_educat=" + self.navegg.education
 		+ "&nvg_marita=" + self.navegg.marital
 		+ "&nvg_income=" + self.navegg.income
 		+ "&nvg_intere=" + self.navegg.interest.replace(/-/g,",")
 		+ "&nvg_produc=" + self.navegg.product.replace(/-/g,",")
 		+ "&nvg_career=" + self.navegg.career
 		+ "&nvg_brand="  + self.navegg.brand.replace(/-/g,",")
 		+ "&nvg_connec=" + self.navegg.connection.replace(/-/g,",")
 		+ "&nvg_everyb=" + self.navegg.everybuyer.replace(/-/g,",")
 		+ "&nvg_custom=" + self.navegg.custom.replace(/-/g,",");

 		var custom_params = encodeURIComponent(navegg_tags + "&duration=&CNT_Position=preroll&category=" + self.playingNow.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags);

		//"&scor=" + self.user.unique_score +

 		var tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
 		"sz=640x360" +
 		"&iu=" + self.client.ad_unit_id +
 		"&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1" +
 		"&url=" + encodeURIComponent(self.player.url) +
 		"&description_url=" + self.player.url +
 		"&cust_params=" + custom_params +
 		"&cmsid=" + self.playingNow.dfp_partner_id +
 		"&vid=" + self.playingNow.hashed_code +
 		"&correlator=" + Date.now();

        var options = {
              id: "video_js_player",
              adTagUrl: tagUrl,
              adsRenderingSettings: {
                  enablePreloading: true
              }
            };

 		if(self.currentBeforePlayId != self.playingNow.hashed_code){
 			$(".jw-icon-fullscreen").addClass("jw-hidden");
			$(".jw-icon-fullscreen").hide();
 			self.currentBeforePlayId = self.playingNow.hashed_code;

 			//tagUrl = "https://local-vpaid.sambaads.com/vast/adselector.xml";

 			//if(self.playingNow.media_id == 66007){
 			//  	self.playingNow.sponsored = true;
 			//}


 			var loc = window.location.toString();
			params_ads_check = loc.split('?')[1];
			if(!self.playingNow.sponsored && params_ads_check.indexOf('ads=false')<0){
                var not_function = 0;
                if(typeof window.sambaads.videoJSPlayer.ima === 'function'){
                    window.sambaads.videoJSPlayer.ima(options);
                    not_function = 1;
                }

                window.sambaads.videoJSPlayer.ima.setContentWithAdTag(self.playingNow.sources[0].file,tagUrl,true);
                window.sambaads.videoJSPlayer.ima.initializeAdDisplayContainer();
                window.sambaads.videoJSPlayer.ima.requestAds();

 			} else {
                window.sambaads.videoJSPlayer.src({type: 'video/mp4', src: self.playingNow.sources[0].file});
            }
 			//if(self.playingNow.sponsored){
 				SambaAdsPlayerMessageBroker().send(Event.NATIVE_START, self.playingNow);
 			//}
 		}
 	});

 	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAY_LIST_ITEM, function(e){
 		self.playingNow = e.detail.data;
 	});

};

new SambaAdsPlayerAdvertising();
