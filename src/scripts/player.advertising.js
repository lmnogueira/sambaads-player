var SambaAdsPlayerAdvertising = {};

SambaAdsPlayerAdvertising = function (){
 	var self = this;
 	self.abort_ad = false;

 	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(e){
		self.client = e.detail.data.client;
		self.player = e.detail.data.player;
	});

 	SambaAdsPlayerMessageBroker().addEventListener(Event.AD_BEFORE_PLAY, function(e){

 		var tags = self.playingNow.LR_TAGS;
		var custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.playingNow.LR_VERTICALS + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags);

 		var tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
 		"sz=640x360" +
 		"&iu=" + self.client.ad_unit_id +
 		"&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1" +
 		"&url=" + encodeURIComponent(self.player.url) +
 		"&description_url=" +
 		"&cust_params=" + custom_params +
 		"&cmsid=" + self.playingNow.dfp_partner_id +
 		"&vid=" + self.playingNow.hashed_code +
 		"&correlator=__timestamp__";

 		if(self.currentBeforePlayId != self.playingNow.hashed_code){
 			$(".jw-icon-fullscreen").addClass("jw-hidden");
			$(".jw-icon-fullscreen").hide();
 			self.currentBeforePlayId = self.playingNow.hashed_code;

 			//tagUrl = "https://local-vpaid.sambaads.com/vast/adselector.xml";

 			//if(self.playingNow.media_id == 66007){
 			  	self.playingNow.sponsored = true;
 			//}


 			var loc = window.location.toString();
			params_ads_check = loc.split('?')[1];
			if(!self.playingNow.sponsored && params_ads_check.indexOf('ads=false')<0){
				e.detail.data.playAd(tagUrl);
 			}

 			if(self.playingNow.sponsored){
 				SambaAdsPlayerMessageBroker().send(Event.NATIVE_START, self.playingNow);
 			}
 		}
 	});

 	SambaAdsPlayerMessageBroker().addEventListener(Event.PLAY_LIST_ITEM, function(e){
 		self.playingNow = e.detail.data.item;
 	});
};

new SambaAdsPlayerAdvertising();
