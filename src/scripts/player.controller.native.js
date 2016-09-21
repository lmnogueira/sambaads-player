var SambaAdsPlayerControllerNative = {};

SambaAdsPlayerControllerNative = function (){
	var self = this,
		displayOverlay = $('#display-overlay'),
		showAdTimeout = null,
		currentNative = null,
		currentVastData = null;

	var glamboxNative = function(videoId) {
			var videoType = {
					'60474': 'glam_box',
					'60475': 'glam_mag',
					'60476': 'glam_club'
				},
				glamboxData = {
					glam_box: {
						text: '<div class="simple-text"><span>Quer experimentar novos produtos todo mês e recebê-los na sua casa?</span></div>',
						action_url: 'https://www.glambox.com.br/Landing/show/DescontoAssinaturaAgosto2016?utm_source=YContent&utm_medium=Native&utm_content=BatomLiquido',
						highlight_text: '<span>Assine com</span><span class="large-text">R$60</span><span>de desconto</span>',
						impression_url: '',
						click_url: ''
					},
					glam_mag: {
						text: '<div class="simple-text single-line"><span>Quer mais dicas de beleza?</span></div>',
						action_url: 'https://www.glambox.com.br/Revista/?utm_source=YContent&utm_medium=Native&utm_content=Top5Sombra',
						highlight_text: '<span class="single-text">Conheça o GLAM MAG</span>',
						impression_url: '',
						click_url: ''
					},
					glam_club: {
						text: '<div class="simple-text"><span>Fique por dentro das últimas novidades de beleza!</span></div>',
						action_url: 'https://www.glambox.com.br/Landing/show/quetalglambox?utm_source=YContent&utm_medium=Native&utm_content=TrancasBoxeador',
						highlight_text: '<span>Faça parte desse clube exclusivo</span>',
						impression_url: '',
						click_url: ''
					}
				},
				glamboxRandon = {
					styles: [
						'type-1',
						'type-2'
					]
				},
				glamboxTrigger = $('#glambox-trigger');

				self.currentData = {
					id: videoType[videoId],
					typeData: glamboxData[videoType[videoId]],
					style: glamboxRandon.styles[Math.floor(Math.random() * glamboxRandon.styles.length)]
				};

			var triggerContent = glamboxTrigger[0].innerHTML;
			triggerContent = triggerContent.replace('{{glamText}}', self.currentData.typeData.text);
			triggerContent = triggerContent.replace('{{highlightText}}', self.currentData.typeData.highlight_text);

			glamboxTrigger[0].innerHTML = triggerContent;

			glamboxTrigger.addClass(self.currentData.style);

			var tags = self.video.LR_TAGS + ",native," + self.currentData.id + "," + self.currentData.style,
				custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.LR_VERTICALS + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags);

	 		var tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
				 		 "sz=640x360" +
				 		 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
				 		 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
				 		 "&cust_params=" + custom_params +
				 		 "&cmsid=" + self.video.dfp_partner_id +
				 		 "&vid=" + self.video.hashed_code +
				 		 "&correlator=" + new Date().getTime();

			self.loadVastTag(tagUrl, function(vastData, data){
				glamboxTrigger.off();

				currentVastData = vastData;

				glamboxTrigger.on('click', function(event){
					event.preventDefault();
					window.open(vastData.click_url);
				});
			});
		};

	var glamboxNativeUpdate = function(videoId) {
			var videoType = {
					 '60474': 'glam_box_new',
					 '60475': 'glam_mag_new',
					 '60476': 'glam_club_new'
				},
				tags = self.video.LR_TAGS + ",native," + videoType[videoId] + ",new_style",
				custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.LR_VERTICALS + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
				tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
				 		 "sz=640x360" +
				 		 "&iu=" + self.client.ad_unit_id +
				 		 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
				 		 "&cust_params=" + custom_params +
				 		 "&cmsid=" + self.video.dfp_partner_id +
				 		 "&vid=" + self.video.hashed_code +
				 		 "&correlator=" + new Date().getTime();


			var nativeType = {
					glam_box_new: 'type-1',
					glam_club_new: 'type-2',
					glam_mag_new: 'type-3'
				};

			var glamboxNew = $('.glambox-new');

			self.loadVastTag(tagUrl, function(vastData, data){
				glamboxNew.addClass(nativeType[videoType[videoId]]);
				var glamboxTrigger = $('.current-native  .glambox-new-trigger');

				currentVastData = vastData;

				glamboxTrigger.off();

				glamboxTrigger.on('click', function(event){
					event.stopPropagation();
					event.preventDefault();
					window.open(vastData.click_url);
				});
			});
		};

	var glamboxFrame = function(videoId) {
			self.setCurrentNative($('#glambox-frame'));

			var JWplayerArea = $('#jw_sambaads_player'),
				glamboxFrame = $('#glambox-frame'),
				frameClose = $('.frame-close'),
				videoTitleBar = $('#video-title-bar'),
				closeActive = true;

			self.nativeTimerTrigger = function(event) {
				if(closeActive) {
					var currentTime = parseInt(event.detail.data.position);

					if(currentTime >= 1) {
						JWplayerArea.addClass('native-frame');
					}
					if(currentTime == 10) {
						self.trackImpression(currentVastData.impression_url);
						JWplayerArea.addClass('active-native-frame');
						glamboxFrame.addClass('active-native-frame');
						videoTitleBar.addClass('inactive');
					}
					if(currentTime >= 14) {
						frameClose.addClass('active');
					}
				}
			};

			self.stopNativeFunction = function(event) {
				JWplayerArea.removeClass('active-native-frame');
				glamboxFrame.removeClass('active-native-frame');
				JWplayerArea.removeClass('native-frame');
				frameClose.removeClass('active');
				videoTitleBar.removeClass('inactive');
				self.nativeTimerTrigger = function(){};
			};

			// var videoType = {
			// 		'60474': 'glam_box_frame',
			// 		'60475': 'glam_club_frame',
			// 		'60476': 'glam_mag_frame'
			// 	},
			var videoType = [
					'glam_box_frame',
					'glam_club_frame'
				],
				glamboxRandon = {
					styles: [
						'type-1',
						'type-2'
					]
				},
				frameTrigger = $('.frame-trigger');

				self.currentData = {
					id: videoType[Math.floor(Math.random() * videoType.length)],//[videoId],
					style: glamboxRandon.styles[Math.floor(Math.random() * glamboxRandon.styles.length)],
				};

			JWplayerArea.addClass(self.currentData.style);
			frameTrigger.addClass(self.currentData.id);

			var tags = self.video.LR_TAGS + ",native," + self.currentData.id + "," + self.currentData.style,
				custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.LR_VERTICALS + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags);

	 		var tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
				 		 "sz=640x360" +
				 		 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
				 		 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
				 		 "&cust_params=" + custom_params +
				 		 "&cmsid=" + self.video.dfp_partner_id +
				 		 "&vid=" + self.video.hashed_code +
				 		 "&correlator=" + new Date().getTime();

			self.loadVastTag(tagUrl, function(vastData, data){
				frameTrigger.off();

				currentVastData = vastData;

				console.log('VAST LOADED');

				frameTrigger.on('click', function(event){
					event.preventDefault();
					window.open(vastData.click_url);
				});
			});

			frameClose.on('click', function(event){
				event.preventDefault();
				closeActive = false;
				JWplayerArea.removeClass('active-native-frame');
				glamboxFrame.removeClass('active-native-frame');
				frameClose.removeClass('active');

				window.setTimeout(function(){
					videoTitleBar.removeClass('inactive');
				},2500);
			});
		};

	//
	// var wineNative = function(){
	// 		self.loadVastTag(tagUrl, function(vastData, data)) {
	//
	// 		};
	// 	};

	self.setAdTimeout = function(time, beforeAd, callback) {
		if(typeof beforeAd === 'function') {
			beforeAd();
		}

		showAdTimeout = setTimeout(function(){
			displayOverlay.addClass('active-native');

			if(typeof callback === 'function') {
				callback();
			}
		}, time);
	};

	self.startNative = function(e){
		self.video = e.detail.data;


		var ownerId = e.detail.data.owner_id,
			videoId = e.detail.data.media_id;

		self.nativeTimerTrigger = function(event){};
		self.stopNativeFunction = function(event){};

		// Comment this before deploy on production
		//ownerId = 38;
		//videoId = 60475;

		if(false) {
			var beforeAd = function() {
					self.setCurrentNative($('*[data-hashcode="glambox"]'));
					glamboxNative(videoId.toString());
				},
				callbackAd = function() {
					var glamboxClose = $('.current-native .ad-close'),
						glamboxNew = $('.glambox-new');

					glamboxClose.on('click', function(event){
						event.stopPropagation();
						event.preventDefault();
						self.hideNative();
					});

					self.trackImpression(currentVastData.impression_url);

					glamboxNew.removeClass('flip');

					if(videoId === 60476) {
						setTimeout(function(){
							glamboxNew.addClass('flip');
						}, 4000);
					}
				};

			self.setAdTimeout(15000, beforeAd, callbackAd);
		}

		//videoId = 62639;

		if(videoId === 62639) {
			var selfVastData = null,
				beforeAd = function() {
					self.setCurrentNative($('#wine-native'));

					var custom_params = encodeURIComponent(
											"duration=&CNT_Position=preroll&category=" +
											self.video.LR_VERTICALS + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" +
											self.video.LR_TAGS +
											",native," +
											videoId
										);

			 		var tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
						 		 "sz=640x360" +
						 		 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
						 		 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
						 		 "&cust_params=" + custom_params +
						 		 "&cmsid=" + self.video.dfp_partner_id +
						 		 "&vid=" + self.video.hashed_code +
						 		 "&correlator=" + new Date().getTime();

					self.loadVastTag(tagUrl, function(vastData){
						selfVastData = vastData;
					});
				},
				callbackAd = function() {
					var wineClose = $('.current-native .ad-close'),
						wineClick = $('.current-native .ad-trigger');

					wineClose.on('click', function(event){
						event.preventDefault();
						self.hideNative();
					});

					wineClick.off();

					wineClick.on('click', function(event){
						event.stopPropagation();
						event.preventDefault();
						window.open(vastData.click_url);
					});

					self.trackImpression(selfVastData.impression_url);
				};

			self.setAdTimeout(2000, beforeAd, callbackAd);
		}

		//if(ownerId === 150) {
		//if(ownerId === 38) {

			can_publisher_play = "e7a0e7ece4bf9e68a0656c09ce1479a0,97faba17c7747183dc86c29e40f1adad,949fe90cced05c43bd73410701dc198d,092ac38067a00fa2a5c3335c61565cc1,15663c838a3846e8c06e25a69b89f276".indexOf(self.client.hash_code) >= 0;
			can_vertical_play = "FEMININO,FASHION,LIFESTYLE,GASTRONOMIA,SAUDE_E_FITNESS".indexOf(self.video.LR_VERTICALS) >= 0;

			if(can_publisher_play || can_vertical_play){
				glamboxFrame(videoId);
			}
		

	};

	// self.nativeImpressionStart = function(time, vastUrl, options) {
	// 	var insideOptions = {
	// 			beforeAd = options.beforeAd function(){},
	// 			callbackAd = options.callbackAd || function(){},
	// 			callbackVast = optiosn.callbackVast || function(){}
	// 		};
	//
	// 	if(typeof beforeAd === 'function') {
	// 		beforeAd();
	// 	}
	//
	// 	self.loadVastTag(vastUrl, function(vastData){
	// 		callbackVast(vastData);
	//
	// 		showAdTimeout = setTimeout(function(){
	// 			displayOverlay.addClass('active-native');
	//
	// 			if(typeof callbackAd === 'function') {
	// 				callbackAd();
	// 			}
	// 		}, time);
	// 	});
	// };

	self.setCurrentNative = function(nativeEl) {
		$('.current-native').removeClass('current-native');
		nativeEl.addClass('current-native');
	};

	self.hideNative = function() {
		displayOverlay.removeClass('active-native');
	};

	self.trackImpression = function(impressionUrl){
		self.sendTrack(impressionUrl);
	};

	self.trackClick = function(){
		self.sendTrack();
	};

	self.onceTrigger = "";
	self.sendTrack = function(url){
		if(self.onceTrigger != url){
			self.onceTrigger = url;
			$.get( url );
		}
	};

	self.loadVastTag = function(tagUrl, callback){
		$.ajax({
	        type: "get",
	        url:  tagUrl,
	        dataType: "xml",
	        success: function(data) {
				var vastData = {
						impression_url: '',
						click_url: ''
					};

				if(typeof data.getElementsByTagName("Impression")[0] !== 'undefined') {
					var el = data.getElementsByTagName("Impression")[0].childNodes[0];
					vastData.impression_url = el.nodeValue;
				}

				if(typeof data.getElementsByTagName("Impression")[0] !== 'undefined') {
					el = data.getElementsByTagName("ClickThrough")[0].childNodes[0];
					vastData.click_url = el.nodeValue;
				}

				if(typeof callback === 'function') {
					callback(vastData, data);
				}
	        },
	        error: function(xhr, status) {
	            console.log("error");
	        }
    	});
	}

	self.stopNative = function(e){
		clearTimeout(showAdTimeout);
		displayOverlay.removeClass('active-native');

		try {
			self.stopNativeFunction(e);
		} catch(error){

		}

		self.nativeTimerTrigger = function(event){};
		self.stopNativeFunction = function(event){};
	};

	self.hoverNative = function(e){
		displayOverlay.addClass('show-controls');
	};

	self.leaveNative = function(e){
		setTimeout(function(){
			displayOverlay.removeClass('show-controls');
		}, 2000);
	};

	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(e){
		self.client = e.detail.data.client;
	});

	self.nativeTimer = function(event){
		if(self.nativeTimerTrigger) {
			self.nativeTimerTrigger(event);
		}
	};

	SambaAdsPlayerMessageBroker().addEventListener(Event.MOUSE_MOVE, self.hoverNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.MOUSE_LEAVE, self.leaveNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_START, self.startNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, self.stopNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.TIME, self.nativeTimer);
};

new SambaAdsPlayerControllerNative();
