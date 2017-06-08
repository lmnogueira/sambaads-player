var SambaAdsPlayerControllerNative = {};

SambaAdsPlayerControllerNative = function (){
	var self = this,
		displayOverlay = $('#display-overlay'),
		videoJsPlayer = window.document.getElementById('video_js_player'),//JWPlayer = window.jwplayer('jw_sambaads_player'),
		playerConfiguration = null,
		showAdTimeout = null,
		currentNative = null,
		currentVastData = null;
		click_added = false;

	// var glamboxNative = function(videoId) {
	// 		var videoType = {
	// 				'60474': 'glam_box',
	// 				'60475': 'glam_mag',
	// 				'60476': 'glam_club'
	// 			},
	// 			glamboxData = {
	// 				glam_box: {
	// 					text: '<div class="simple-text"><span>Quer experimentar novos produtos todo mês e recebê-los na sua casa?</span></div>',
	// 					action_url: 'https://www.glambox.com.br/Landing/show/DescontoAssinaturaAgosto2016?utm_source=YContent&utm_medium=Native&utm_content=BatomLiquido',
	// 					highlight_text: '<span>Assine com</span><span class="large-text">R$60</span><span>de desconto</span>',
	// 					impression_url: '',
	// 					click_url: ''
	// 				},
	// 				glam_mag: {
	// 					text: '<div class="simple-text single-line"><span>Quer mais dicas de beleza?</span></div>',
	// 					action_url: 'https://www.glambox.com.br/Revista/?utm_source=YContent&utm_medium=Native&utm_content=Top5Sombra',
	// 					highlight_text: '<span class="single-text">Conheça o GLAM MAG</span>',
	// 					impression_url: '',
	// 					click_url: ''
	// 				},
	// 				glam_club: {
	// 					text: '<div class="simple-text"><span>Fique por dentro das últimas novidades de beleza!</span></div>',
	// 					action_url: 'https://www.glambox.com.br/Landing/show/quetalglambox?utm_source=YContent&utm_medium=Native&utm_content=TrancasBoxeador',
	// 					highlight_text: '<span>Faça parte desse clube exclusivo</span>',
	// 					impression_url: '',
	// 					click_url: ''
	// 				}
	// 			},
	// 			glamboxRandon = {
	// 				styles: [
	// 					'type-1',
	// 					'type-2'
	// 				]
	// 			},
	// 			glamboxTrigger = $('#glambox-trigger');

	// 			self.currentData = {
	// 				id: videoType[videoId],
	// 				typeData: glamboxData[videoType[videoId]],
	// 				style: glamboxRandon.styles[Math.floor(Math.random() * glamboxRandon.styles.length)]
	// 			};

	// 		var triggerContent = glamboxTrigger[0].innerHTML;
	// 		triggerContent = triggerContent.replace('{{glamText}}', self.currentData.typeData.text);
	// 		triggerContent = triggerContent.replace('{{highlightText}}', self.currentData.typeData.highlight_text);

	// 		glamboxTrigger[0].innerHTML = triggerContent;

	// 		glamboxTrigger.addClass(self.currentData.style);

	// 		var tags = self.video.dfp_tags + ",native," + self.currentData.id + "," + self.currentData.style,
	// 			custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags);

	//  		var tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
	// 			 		 "sz=640x360" +
	// 			 		 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
	// 			 		 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
	// 			 		 "&cust_params=" + custom_params +
	// 			 		 "&cmsid=" + self.video.dfp_partner_id +
	// 			 		 "&vid=" + self.video.hashed_code +
	// 			 		 "&correlator=" + new Date().getTime();

	// 		self.loadVastTag(tagUrl, function(vastData, data){
	// 			glamboxTrigger.off();

	// 			currentVastData = vastData;

	// 			glamboxTrigger.on('click', function(event){
	// 				event.preventDefault();
	// 				window.open(vastData.click_url);
	// 			});
	// 		});
	// 	};

	// var glamboxNativeUpdate = function(videoId) {
	// 		var videoType = {
	// 				 '60474': 'glam_box_new',
	// 				 '60475': 'glam_mag_new',
	// 				 '60476': 'glam_club_new'
	// 			},
	// 			tags = self.video.dfp_tags + ",native," + videoType[videoId] + ",new_style",
	// 			custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
	// 			tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
	// 			 		 "sz=640x360" +
	// 			 		 "&iu=" + self.client.ad_unit_id +
	// 			 		 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
	// 			 		 "&cust_params=" + custom_params +
	// 			 		 "&cmsid=" + self.video.dfp_partner_id +
	// 			 		 "&vid=" + self.video.hashed_code +
	// 			 		 "&correlator=" + new Date().getTime();


	// 		var nativeType = {
	// 				glam_box_new: 'type-1',
	// 				glam_club_new: 'type-2',
	// 				glam_mag_new: 'type-3'
	// 			};

	// 		var glamboxNew = $('.glambox-new');

	// 		self.loadVastTag(tagUrl, function(vastData, data){
	// 			glamboxNew.addClass(nativeType[videoType[videoId]]);
	// 			var glamboxTrigger = $('.current-native  .glambox-new-trigger');

	// 			currentVastData = vastData;

	// 			glamboxTrigger.off();

	// 			glamboxTrigger.on('click', function(event){
	// 				event.stopPropagation();
	// 				event.preventDefault();
	// 				window.open(vastData.click_url);
	// 			});
	// 		});
	// 	};

	// var glamboxFrame = function(videoId) {
	// 		self.setCurrentNative($('#glambox-frame'));

	// 		var videosJsArea = $('#vjs_sambaads_player'),
	// 			glamboxFrame = $('#glambox-frame'),
	// 			frameClose = glamboxFrame.find('.frame-close'),
	// 			videoTitleBar = $('#video-title-bar'),
	// 			closeActive = true,
	// 			impression_trigger = false;

	// 		self.nativeTimerTrigger = function(event) {
	// 			if(closeActive) {
	// 				var currentTime = parseInt(event.detail.data.position);

	// 				if(currentTime >= 1) {
	// 					videosJsArea.addClass('native-frame');
	// 					videosJsArea.addClass('glambox-player-frame');
	// 				}
	// 				if(currentTime == 10) {
	// 					if(!impression_trigger){
	// 						impression_trigger = true;
	// 						self.trackImpression(currentVastData.impression_url);
	// 					}
	// 					videosJsArea.addClass('active-native-frame');
	// 					glamboxFrame.addClass('active-native-frame');
	// 					videoTitleBar.addClass('inactive');
	// 				}
	// 				if(currentTime >= 14) {
	// 					frameClose.addClass('active');
	// 				}
	// 			}
	// 		};

	// 		var currentStopFunction = function(event) {
	// 				videosJsArea.removeClass('active-native-frame');
	// 				glamboxFrame.removeClass('active-native-frame');
	// 				videosJsArea.removeClass('native-frame');
	// 				videosJsArea.removeClass('glambox-player-frame');
	// 				frameClose.removeClass('active');
	// 				videoTitleBar.removeClass('inactive');
	// 				self.nativeTimerTrigger = function(){};
	// 			};

	// 		SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentStopFunction);

	// 		var videoType = [
	// 				'glam_box_frame',
	// 				'glam_club_frame'
	// 			],
	// 			glamboxRandon = {
	// 				styles: [
	// 					'type-1',
	// 					'type-2'
	// 				]
	// 			},
	// 			frameTrigger = $('.frame-trigger');

	// 			self.currentData = {
	// 				id: videoType[Math.floor(Math.random() * videoType.length)],//[videoId],
	// 				style: glamboxRandon.styles[Math.floor(Math.random() * glamboxRandon.styles.length)],
	// 			};

	// 		videosJsArea.addClass(self.currentData.style);
	// 		frameTrigger.addClass(self.currentData.id);

	// 		var tags = self.video.dfp_tags + ",native," + self.currentData.id + "," + self.currentData.style,
	// 			custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags);

	//  		var tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
	// 			 		 "sz=640x360" +
	// 			 		 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
	// 			 		 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
	// 			 		 "&cust_params=" + custom_params +
	// 			 		 "&cmsid=" + self.video.dfp_partner_id +
	// 			 		 "&vid=" + self.video.hashed_code +

	// 			 		 "&correlator=" + new Date().getTime();

	// 		self.loadVastTag(tagUrl, function(vastData, data){
	// 			frameTrigger.off();

	// 			currentVastData = vastData;

	// 			frameTrigger.on('click', function(event){
	// 				event.preventDefault();
	// 				window.open(vastData.click_url);
	// 			});
	// 		});

	// 		frameClose.on('click', function(event){
	// 			event.preventDefault();
	// 			closeActive = false;
	// 			videosJsArea.removeClass('active-native-frame');
	// 			glamboxFrame.removeClass('active-native-frame');
	// 			frameClose.removeClass('active');

	// 			window.setTimeout(function(){
	// 				videoTitleBar.removeClass('inactive');
	// 			},2500);
	// 		});
	// 	};

	// var toroRadarFrame = function(videoId) {
	// 		self.setCurrentNative($('#toro-frame'));

	// 		var videosJsArea = $('#vjs_sambaads_player'),
	// 			toroRadarAdFrame = $('#toro-frame'),
	// 			frameClose = toroRadarAdFrame.find('.frame-close'),
	// 			videoTitleBar = $('#video-title-bar'),
	// 			closeActive = true;

	// 		self.nativeTimerTrigger = function(event) {
	// 			if(closeActive) {
	// 				var currentTime = parseInt(event.detail.data.position);

	// 				if(currentTime >= 1) {
	// 					videosJsArea.addClass('native-frame');
	// 					videosJsArea.addClass('toro-player-frame');
	// 				}
	// 				if(currentTime == 10) {
	// 					self.trackImpression(currentVastData.impression_url);
	// 					videosJsArea.addClass('active-native-frame');
	// 					toroRadarAdFrame.addClass('active-native-frame');
	// 					videoTitleBar.addClass('inactive');
	// 				}
	// 				if(currentTime >= 14) {
	// 					frameClose.addClass('active');
	// 				}
	// 			}
	// 		};

	// 		self.stopNativeFunction = function(event) {
	// 			videosJsArea.removeClass('active-native-frame');
	// 			toroRadarAdFrame.removeClass('active-native-frame');
	// 			videosJsArea.removeClass('native-frame');
	// 			videosJsArea.removeClass('toro-player-frame');
	// 			frameClose.removeClass('active');
	// 			videoTitleBar.removeClass('inactive');
	// 			self.nativeTimerTrigger = function(){};
	// 		};

	// 		var frameType = [
	// 				'start-investing',
	// 				'today-scenario',
	// 				'ebook'
	// 			],
	// 			bgType = [
	// 				'toro-black',
	// 				'toro-blue',
	// 				'toro-green'
	// 			],
	// 			frameTrigger = $('.frame-trigger');

	// 			self.currentData = {
	// 				id: videoId
	// 			};

	// 		var currentFrameType = frameType[Math.floor(Math.random() * frameType.length)],
	// 			currentBgType = bgType[Math.floor(Math.random() * frameType.length)];

	// 		frameTrigger.addClass(currentFrameType);
	// 		videosJsArea.addClass(currentBgType);

	// 		var tags = self.video.dfp_tags + ",native,toro_frame_" + currentFrameType + "toro_bg_type" + currentBgType + ",",
	// 			custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
	// 			tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
	// 			 		 "sz=640x360" +
	// 			 		 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
	// 			 		 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
	// 			 		 "&cust_params=" + custom_params +
	// 			 		 "&cmsid=" + self.video.dfp_partner_id +
	// 			 		 "&vid=" + self.video.hashed_code +
	// 			 		 "&correlator=" + new Date().getTime();

	// 		self.loadVastTag(tagUrl, function(vastData, data){
	// 			frameTrigger.off();

	// 			currentVastData = vastData;

	// 			frameTrigger.on('click', function(event){
	// 				event.preventDefault();
	// 				window.open(vastData.click_url);
	// 			});
	// 		});

	// 		frameClose.on('click', function(event){
	// 			event.preventDefault();
	// 			closeActive = false;
	// 			videosJsArea.removeClass('active-native-frame');
	// 			toroRadarAdFrame.removeClass('active-native-frame');
	// 			frameClose.removeClass('active');

	// 			window.setTimeout(function(){
	// 				videoTitleBar.removeClass('inactive');
	// 			},2500);
	// 		});
	// 	};


// var bradescoAd = function(videoId) {
// 			var vastSuccessAction = function(vastData, data){}
// 				showClose = true,
// 				tagUrl = '';
		
// 			var setVastUrl = function(adType) {
// 				var tags = self.video.dfp_tags + ",native,bradesco_" + adType + ",",
// 					custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
// 					tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
// 							 "sz=640x360" +
// 							 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
// 							 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
// 							 "&cust_params=" + custom_params +
// 							 "&cmsid=" + self.video.dfp_partner_id +
// 							 "&vid=" + self.video.hashed_code +
// 							 "&correlator=" + new Date().getTime();

// 					return tagUrl;
// 				};

// 			var adsType = {
// 					empiricusPlaylistFrame: function(videoId) {
// 						var $currentPlaylistAd = $('#empiricus-playlist'),
// 							$playlistAdArea = $('#playlist-ad-area'),
// 							$closeButton = $('#empiricus-playlist-close'),
// 							$productsTrigger = $('.playlist-product');

// 						tagUrl = setVastUrl('playlist_frame');

// 						var startPlaylistFrameAd = function(vastData) {
// 								productsHtml = '';

// 								var jsonPlaylistMockup = {
// 										products: [],
// 										footerContent: '',
// 										banner: '<img width="100%" src="//thumbs.sambaads.com/thumbnail/bradesco_v1.jpg" alt="Empiricus Logo">'
// 									};

// 								// for(var x = 0; x < jsonPlaylistMockup.products.length; x++) {
// 								// 	productsHtml += '<a href="' + jsonPlaylistMockup.products[x].clickThrough +
// 								// 					'" target="_blank" class="playlist-product"><img src="' + jsonPlaylistMockup.products[x].image +
// 								// 					'" alt="' + jsonPlaylistMockup.products[x].title +
// 								// 					'" title="' + jsonPlaylistMockup.products[x].title + '"></a>';
// 								// }

// 								if(jsonPlaylistMockup.banner)
// 								$('#playlist-products-area').html(jsonPlaylistMockup.banner);

// 								if(jsonPlaylistMockup.products.length)
// 								$('#playlist-products-area').html(productsHtml);
								
// 								if(jsonPlaylistMockup.footerContent)
// 								$('#playlist-footer').html(jsonPlaylistMockup.footerContent);

// 								self.nativeTimerTrigger = function(event) {
// 									if(showClose) {
// 										var currentTime = parseInt(event.detail.data.position);

// 										if(currentTime >= 4) {
// 												self.trackImpression(vastData.impression_url);
// 												$playlistAdArea.addClass('active');
// 												$currentPlaylistAd.addClass('active');
// 										}
// 										if(currentTime >= 14) {
// 												$closeButton.addClass('active');
// 										}
// 									}
// 								};

// 								if(!self.click_added){
// 									self.click_added = true;
// 									$('#playlist-products-area').on('click', function(event){
									
// 									event.preventDefault();
// 									console.log("teste");
// 									window.open(vastData.click_url);
// 									});
// 								}
								

// 								$closeButton.on('click', function(event){
// 									event.preventDefault();
// 									event.stopPropagation();
// 									showClose = false;
// 									$playlistAdArea.removeClass('active');
// 									$currentPlaylistAd.removeClass('active');
// 									$closeButton.removeClass('active');
// 								});
// 							};

// 						var vastSuccessAction = function(vastData, data) {
// 							$productsTrigger.off();

// 							if(vastData.impression_url){
// 								startPlaylistFrameAd(vastData);
// 							}
							
// 						};

// 						self.loadVastTag(tagUrl, vastSuccessAction);
// 					},
// 					empiricusLead: function(videoId) {
// 						var $currentTrigger = $('#empiricus-trigger'),
// 							$closeButton = $('#empiricus-lead-close'),
// 							$insideClose = $('.inside-close');
// 							$leadArea = $('#empriricus-lead-area'),
// 							$sendLead = $('#send-lead'),
// 							$leadSuccess = $('#lead-success'),
// 							leadAreaContent = $('.lead-area-content');

// 						var startLeadAd = function() {
// 								self.nativeTimerTrigger = function(event) {
// 									if(showClose) {
// 										var currentTime = parseInt(event.detail.data.position);

// 										//if(currentTime === 10) {
// 										if(currentTime >= 4) {
// 											self.trackImpression(currentVastData.impression_url);
// 											$currentTrigger.addClass('active');
// 										}
// 										if(currentTime >= 14) {
// 											$closeButton.addClass('active');
// 										}
// 									}
// 								};

// 								$currentTrigger.on('click', function(event){
// 									event.preventDefault();
// 									event.stopPropagation();
// 									videoJsPlayer.pause();
// 									showClose = false;
// 									$closeButton.removeClass('active');
// 									$currentTrigger.removeClass('active');
// 									$leadArea.addClass('active');
// 								});

// 								$insideClose.on('click', function(event){
// 									event.preventDefault();
// 									event.stopPropagation();
// 									$leadArea.removeClass('active');

// 									setTimeout(function(){
// 										videoJsPlayer.play();
// 									}, 200);
// 								});

// 								$closeButton.on('click', function(event){
// 									event.preventDefault();
// 									event.stopPropagation();
// 									showClose = false;

// 									$closeButton.removeClass('active');
// 									$currentTrigger.removeClass('active');
// 								});

// 								$sendLead.on('click', function(event){
// 									event.preventDefault();
// 									event.stopPropagation();
// 									leadAreaContent.removeClass('active');

// 									setTimeout(function () {
// 										$leadSuccess.addClass('active');
// 									}, 300);
// 								});
// 							};

// 						var vastSuccessAction = function(vastData, data) {
// 							$currentTrigger.off();
// 							currentVastData = vastData;
// 							startLeadAd();
// 						};

// 						tagUrl = setVastUrl('lead');

// 						self.setCurrentNative($currentTrigger);
// 						self.loadVastTag(tagUrl, vastSuccessAction);
// 					}
// 				};

// 			if(playerConfiguration.detail.data.playlist.position === 'right') {
// 				adsType.empiricusPlaylistFrame(videoId);
// 			} else {
// 				adsType.empiricusLead(videoId);
// 			}
// 		};
	

	// var empiricusAd = function(videoId) {
	// 		var vastSuccessAction = function(vastData, data){}
	// 			showClose = true,
	// 			tagUrl = '';

	// 		var setVastUrl = function(adType) {
	// 			var tags = self.video.dfp_tags + ",native,empiricus_" + adType + ",",
	// 				custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
	// 				tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
	// 						 "sz=640x360" +
	// 						 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
	// 						 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
	// 						 "&cust_params=" + custom_params +
	// 						 "&cmsid=" + self.video.dfp_partner_id +
	// 						 "&vid=" + self.video.hashed_code +
	// 						 "&correlator=" + new Date().getTime();

	// 				return tagUrl;
	// 			};

	// 		var adsType = {
	// 				empiricusPlaylistFrame: function(videoId) {
	// 					var $currentPlaylistAd = $('#empiricus-playlist'),
	// 						$playlistAdArea = $('#playlist-ad-area'),
	// 						$closeButton = $('#empiricus-playlist-close'),
	// 						$productsTrigger = $('.playlist-product');

	// 					tagUrl = setVastUrl('playlist_frame');

	// 					var startPlaylistFrameAd = function(vastData) {
	// 							productsHtml = '';

	// 							var jsonPlaylistMockup = {
	// 									products: [
	// 										{
	// 											title: 'A febre do Ouro',
	// 											clickThrough: 'http://www.ycontent.com.br',
	// 											image: 'http://local-player.sambaads.com/native/empiricus/image/book-a-febre-do-ouro.png'
	// 										},
	// 										{
	// 											title: 'Relatório: A megaprivatização da Petrobras?',
	// 											clickThrough: 'http://www.ycontent.com.br',
	// 											image: 'http://local-player.sambaads.com/native/empiricus/image/relatorio-petrobras.png'
	// 										}
	// 									],
	// 									footerContent: '<img src="http://local-player.sambaads.com/native/empiricus/image/logo-empiricus.png" alt="Empiricus Logo">'
	// 								};

	// 							for(var x = 0; x < jsonPlaylistMockup.products.length; x++) {
	// 								productsHtml += '<a href="' + jsonPlaylistMockup.products[x].clickThrough +
	// 												'" target="_blank" class="playlist-product"><img src="' + jsonPlaylistMockup.products[x].image +
	// 												'" alt="' + jsonPlaylistMockup.products[x].title +
	// 												'" title="' + jsonPlaylistMockup.products[x].title + '"></a>';
	// 							}

	// 							$('#playlist-products-area').html(productsHtml);
	// 							$('#playlist-footer').html(jsonPlaylistMockup.footerContent);

	// 							self.nativeTimerTrigger = function(event) {
	// 								if(showClose) {
	// 									var currentTime = parseInt(event.detail.data.position);

	// 									if(currentTime >= 4) {
	// 										self.trackImpression(vastData.impression_url);
	// 										$playlistAdArea.addClass('active');
	// 										$currentPlaylistAd.addClass('active');
	// 									}
	// 									if(currentTime >= 14) {
	// 										$closeButton.addClass('active');
	// 									}
	// 								}
	// 							};

	// 							$closeButton.on('click', function(event){
	// 								event.preventDefault();
	// 								event.stopPropagation();
	// 								showClose = false;
	// 								$playlistAdArea.removeClass('active');
	// 								$currentPlaylistAd.removeClass('active');
	// 								$closeButton.removeClass('active');
	// 							});
	// 						};

	// 					var vastSuccessAction = function(vastData, data) {
	// 						$productsTrigger.off();
	// 						startPlaylistFrameAd(vastData);
	// 					};

	// 					self.loadVastTag(tagUrl, vastSuccessAction);
	// 				},
	// 				empiricusLead: function(videoId) {
	// 					var $currentTrigger = $('#empiricus-trigger'),
	// 						$closeButton = $('#empiricus-lead-close'),
	// 						$insideClose = $('.inside-close');
	// 						$leadArea = $('#empriricus-lead-area'),
	// 						$sendLead = $('#send-lead'),
	// 						$leadSuccess = $('#lead-success'),
	// 						leadAreaContent = $('.lead-area-content');

	// 					var startLeadAd = function() {
	// 							self.nativeTimerTrigger = function(event) {
	// 								if(showClose) {
	// 									var currentTime = parseInt(event.detail.data.position);

	// 									//if(currentTime === 10) {
	// 									if(currentTime >= 4) {
	// 										self.trackImpression(currentVastData.impression_url);
	// 										$currentTrigger.addClass('active');
	// 									}
	// 									if(currentTime >= 14) {
	// 										$closeButton.addClass('active');
	// 									}
	// 								}
	// 							};

	// 							$currentTrigger.on('click', function(event){
	// 								event.preventDefault();
	// 								event.stopPropagation();
	// 								videoJsPlayer.pause();
	// 								showClose = false;
	// 								$closeButton.removeClass('active');
	// 								$currentTrigger.removeClass('active');
	// 								$leadArea.addClass('active');
	// 							});

	// 							$insideClose.on('click', function(event){
	// 								event.preventDefault();
	// 								event.stopPropagation();
	// 								$leadArea.removeClass('active');

	// 								setTimeout(function(){
	// 									videoJsPlayer.play();
	// 								}, 200);
	// 							});

	// 							$closeButton.on('click', function(event){
	// 								event.preventDefault();
	// 								event.stopPropagation();
	// 								showClose = false;

	// 								$closeButton.removeClass('active');
	// 								$currentTrigger.removeClass('active');
	// 							});

	// 							$sendLead.on('click', function(event){
	// 								event.preventDefault();
	// 								event.stopPropagation();
	// 								leadAreaContent.removeClass('active');

	// 								setTimeout(function () {
	// 									$leadSuccess.addClass('active');
	// 								}, 300);
	// 							});
	// 						};

	// 					var vastSuccessAction = function(vastData, data) {
	// 						$currentTrigger.off();
	// 						currentVastData = vastData;
	// 						startLeadAd();
	// 					};

	// 					tagUrl = setVastUrl('lead');

	// 					self.setCurrentNative($currentTrigger);
	// 					self.loadVastTag(tagUrl, vastSuccessAction);
	// 				}
	// 			};

	// 		if(playerConfiguration.detail.data.playlist.position === 'right') {
	// 			adsType.empiricusPlaylistFrame(videoId);
	// 		} else {
	// 			adsType.empiricusLead(videoId);
	// 		}
	// 	};

	// var blackFriday = function(videoId) {
	// 		var vastSuccessAction = function(vastData, data){}
	// 			showClose = true,
	// 			tagUrl = '',
	// 			impression_trigger = false,
	// 			currentFrameStop = function(){};

	// 		var defaultHtmlContent = '<div id="black-friday-playlist" class="black-friday-playlist ad-playlist">' +
	// 									'<button type="button" id="black-friday-playlist-close" class="black-friday-playlist-close ad-playlist-close ir inside-close" title="Fechar playlist Ad">Fechar</button>' +
	// 									'<div class="black-friday-playlist-title ad-playlist-title"><img src="/native/black-friday/image/logo-black-friday.png"></div>' +
	// 									'<div id="playlist-products-area" class="playlist-products-area cf"></div>' +
	// 									'<div id="playlist-footer" class="playlist-footer"></div>' +
	// 								'</div>';

	// 		var setVastUrl = function(adType) {
	// 			var tags = self.video.dfp_tags + ",native,black_friday_" + adType + ",",
	// 				custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
	// 				tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
	// 						 "sz=640x360" +
	// 						 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
	// 						 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
	// 						 "&cust_params=" + custom_params +
	// 						 "&cmsid=" + self.video.dfp_partner_id +
	// 						 "&vid=" + self.video.hashed_code +
	// 						 "&correlator=" + new Date().getTime();

	// 				return tagUrl;
	// 			};

	// 		var adsType = {
	// 				playlistFrame: function(videoId) {
	// 					var $closeButton = null,
	// 						$currentPlaylistAd = null,


	// 					tagUrl = setVastUrl('playlist_frame');

	// 					var startPlaylistFrameAd = function(vastData) {
	// 							var productsHtml = '',
	// 								currentVideoDuration = 0;

	// 								// 62904 - Smartphone - Bateria
	// 								// 62903 - Smartphone - Fotos
	// 								// 70261 - Beleza - Boca Glitter
	// 								// 71472 - Beleza - Delineado Esfumado

	// 							var videosCheck = {
	// 									62904: 'tech',
	// 									62903: 'tech',
	// 									70261: 'boca_glitter',
	// 									71472: 'delineado_esfumado'
	// 								};

	// 							var jsonPlaylistMockup = {
	// 									type: {
	// 										full: {
	// 											tech: {
	// 												products: [
	// 													{
	// 														title: 'Iphone 6',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/iphone.png'
	// 													},
	// 													{
	// 														title: 'Samsung Galaxy',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/samsung.png'
	// 													},
	// 													{
	// 														title: 'Motorola',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/samsung.png'
	// 													}
	// 												]
	// 											},
	// 											boca_glitter: {
	// 												products: [
	// 													{
	// 														title: 'Batom Retro',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/battom-retro.png'
	// 													},
	// 													{
	// 														title: 'Mac Sombra',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/mac-sombra.png'
	// 													}
	// 												]
	// 											},
	// 											delineado_esfumado: {
	// 												products: [
	// 													{
	// 														title: 'Perfect Lapis',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/lapis.png'
	// 													},
	// 													{
	// 														title: 'Cilios',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/cilios.png'
	// 													}
	// 												]
	// 											}
	// 										},
	// 										playlist_only: {
	// 											tech: {
	// 												products: [
	// 													{
	// 														title: 'Iphone 6',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/iphone.png'
	// 													},
	// 													{
	// 														title: 'Samsung Galaxy',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/samsung.png'
	// 													}
	// 												]
	// 											},
	// 											boca_glitter: {
	// 												products: [
	// 													{
	// 														title: 'Batom Líquido',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/battom-retro.png'
	// 													},
	// 													{
	// 														title: 'Mac Sombra',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/mac-sombra.png'
	// 													}
	// 												]
	// 											},
	// 											delineado_esfumado: {
	// 												products: [
	// 													{
	// 														title: 'Perfect Lapis',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/lapis.png'
	// 													},
	// 													{
	// 														title: 'Cilios',
	// 														clickThrough: 'http://www.ycontent.com.br',
	// 														image: '/native/black-friday/image/cilios.png'
	// 													}
	// 												]
	// 											}
	// 										}
	// 									},
	// 									footerContent: '<span class="footer-time">Essa oferta termina em: <span><span id="blackfriday-time-left" class="time-left"></span> minutos</span></span>'
	// 								};

	// 							var currentProducts = jsonPlaylistMockup.type[currentAdType][videosCheck[videoId]].products;
	// 							//var currentProducts = jsonPlaylistMockup.type[videosCheck[videoId]].products;

	// 							for(var x = 0; x < currentProducts.length; x++) {
	// 								productsHtml += '<a href="' + currentProducts[x].clickThrough +
	// 												'" id="' + x + '" target="_blank" class="playlist-product"><img src="' + currentProducts[x].image +
	// 												'" alt="' + currentProducts[x].title +
	// 												'" title="' + currentProducts[x].title + '" ></a>';
	// 							}

	// 							$('#playlist-products-area').html(productsHtml);
	// 							$('#black-friday-playlist').addClass(currentAdType);
	// 							$('#playlist-footer').html(jsonPlaylistMockup.footerContent);

	// 							var $currentPlaylistAd = $('#black-friday-playlist'),
	// 								$playlistAdArea = $('#playlist-ad-area'),
	// 								$closeButton = $('#black-friday-playlist-close'),
	// 								$productsTrigger = $('.playlist-product'),
	// 								$timeLeft = $('#blackfriday-time-left');

	// 							$productsTrigger.on('click', function(e){
	// 								videoJsPlayer.pause();
	// 								ga('send', 'event', 'Performance', 'click', 'hotmart', this.id);
	// 							});

	// 							var secondsToTime = function(currentSeconds) {
	// 									var minutes = Math.floor(currentSeconds % 3600 / 60),
	// 										seconds = Math.floor(currentSeconds % 3600 % 60);

	// 									return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
	// 								};

	// 							var currentStopFunction = function(event) {
	// 									showClose = false;
	// 									$playlistAdArea.removeClass('active');
	// 									$currentPlaylistAd.removeClass('active');
	// 									$closeButton.removeClass('active');
	// 								};

	// 							SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentStopFunction);

	// 							var nativeTimerTrigger = function(event) {
	// 									if(showClose) {
	// 										var currentTime = parseInt(event.detail.data.position);

	// 										if(currentTime === 0) {
	// 											if(!impression_trigger){
	// 												impression_trigger = true;
	// 												//ga('send', 'event', 'Performance', 'impression', 'hotmart');
	// 											}

	// 											$timeLeft.html(secondsToTime(parseInt(event.detail.data.duration)));
	// 										} if(currentTime >= 4) {
	// 											self.trackImpression(vastData.impression_url);

	// 											$playlistAdArea.addClass('active');
	// 											$currentPlaylistAd.addClass('active');

	// 										} if(currentTime >= 14) {
	// 											$closeButton.addClass('active');
	// 										}

	// 										if(currentTime >= 4 && currentVideoDuration === 0) {
	// 											currentVideoDuration = parseInt(event.detail.data.duration) - 4;

	// 											var timerCount = 0,
	// 												timerControl = function() {
	// 									                showAdTimeout = setTimeout(function(){

	// 														var currentLeftTime = currentVideoDuration - timerCount,
	// 															timeLeft = secondsToTime(currentLeftTime);

	// 														$timeLeft.html(timeLeft);

	// 									                    if(currentLeftTime === 0) {
	// 									                        clearTimeout(showAdTimeout);
	// 															currentStopFunction();
	// 															currentFrameStop();
	// 									                    } else {
	// 									                        timerCount++;
	// 									                        timerControl();
	// 									                    }
	// 									                }, 1000);
	// 									            };
	// 									        timerControl();
	// 										}
	// 									}
	// 								};

	// 							SambaAdsPlayerMessageBroker().addEventListener(Event.TIME, nativeTimerTrigger);

	// 							$closeButton.on('click', function(event){
	// 								event.preventDefault();
	// 								event.stopPropagation();
	// 								currentStopFunction();
	// 								currentFrameStop();
	// 							});
	// 						};

	// 					vastSuccessAction = function(vastData, data) {
	// 						$playlistAdArea.html(defaultHtmlContent).promise().done(function(){
	// 							$closeButton = $('.ad-playlist-close');
	// 							$currentPlaylistAd = $('#related-offers-playlist');

	// 							startPlaylistFrameAd(vastData);
	// 						});
	// 					};

	// 					self.loadVastTag(tagUrl, vastSuccessAction);
	// 				},
	// 				blackFridayFrame: function(videoId) {
	// 					self.setCurrentNative($('#blackfriday-frame'));

	// 					var videoJsArea = $('#vjs_sambaads_player'),
	// 						blackFridayFrame = $('#blackfriday-frame'),
	// 						frameClose = blackFridayFrame.find('.frame-close'),
	// 						videoTitleBar = $('#video-title-bar'),
	// 						closeActive = true,
	// 						impression_trigger = false;

	// 					self.nativeTimerTrigger = function(event) {
	// 						if(closeActive) {
	// 							var currentTime = parseInt(event.detail.data.position);

	// 							if(currentTime >= 1) {
	// 								videoJsArea.addClass('native-frame');
	// 								videoJsArea.addClass('blackfriday-player-frame');
	// 							} if(currentTime == 4) {
	// 								if(!impression_trigger){
	// 									impression_trigger = true;
	// 									//self.trackImpression(currentVastData.impression_url);
	// 								}
	// 								videoJsArea.addClass('active-native-frame');
	// 								blackFridayFrame.addClass('active-native-frame');
	// 								videoTitleBar.addClass('inactive');
	// 							} if(currentTime >= 14) {
	// 								frameClose.addClass('active');
	// 							}
	// 						}
	// 					};

	// 					currentFrameStop = function(event) {
	// 						videoJsArea.removeClass('active-native-frame');
	// 						blackFridayFrame.removeClass('active-native-frame');
	// 						videoJsArea.removeClass('native-frame');
	// 						videoJsArea.removeClass('blackfriday-player-frame');
	// 						frameClose.removeClass('active');
	// 						videoTitleBar.removeClass('inactive');
	// 						self.nativeTimerTrigger = function(){};
	// 					};

	// 					SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentFrameStop);

	// 					frameTrigger = $('.frame-trigger');

	// 					frameTrigger.off();
	// 					frameTrigger.on('click', function(event){
	// 						event.preventDefault();
	// 						window.open(vastData.click_url);
	// 					});

	// 					frameClose.on('click', function(event){
	// 						event.preventDefault();
	// 						closeActive = false;
	// 						videoJsArea.removeClass('active-native-frame');
	// 						blackFridayFrame.removeClass('active-native-frame');
	// 						frameClose.removeClass('active');

	// 						window.setTimeout(function(){
	// 							videoTitleBar.removeClass('inactive');
	// 						}, 2500);
	// 					});
	// 				}
	// 			};

	// 		var $playlistAdArea = null,
	// 			//currentAdType = ['full','playlist_only'][Math.round(Math.random())],
	// 			currentAdType = 'full',
	// 			startAd = function() {
	// 				adsType.playlistFrame(videoId);
	// 				if(currentAdType ==='full') {
	// 					adsType.blackFridayFrame(videoId);
	// 				}
	// 			};

	// 		if(playerConfiguration.detail.data.playlist.position === 'right') {
	// 			$playlistAdArea = $('.playlist-ad-right');
	// 			startAd();
	// 		} else if (playerConfiguration.detail.data.playlist.position === 'bottom-horizontal') {
	// 			$playlistAdArea = $('.playlist-ad-horizontal');
	// 			startAd();
	// 		}
	// 	};

		// var relatedOffersAd = function(videoId) {
		// 		var vastSuccessAction = function(vastData, data){}
		// 			showClose = true,
		// 			tagUrl = '',
		// 			impression_trigger = false,
		// 			offerButtonTypes = [
		// 				'color',
		// 				'line'
		// 			],
		// 			currentButtonType = offerButtonTypes[Math.round(Math.random())];

		// 		var defaultHtmlContent = '<div id="related-offers-playlist" class="related-offers-playlist ad-playlist">' +
		// 									'<button type="button" id="related-offers-playlist-close" class="related-offers-playlist-close ad-playlist-close ir inside-close" title="Fechar playlist Ad">Fechar</button>' +
		// 									'<div class="related-offers-playlist-title ad-playlist-title">Ofertas Incríveis para Você</div>' +
		// 									'<div id="playlist-products-area" class="playlist-products-area"></div>' +
		// 									'<div id="playlist-footer" class="playlist-footer"></div>' +
		// 								'</div>';

		// 		var setVastUrl = function(adType) {
		// 			var tags = self.video.dfp_tags + ",native,related_offers_" + adType + "_" + currentButtonType + ",",
		// 				custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
		// 				tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
		// 						 "sz=640x360" +
		// 						 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
		// 						 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
		// 						 "&cust_params=" + custom_params +
		// 						 "&cmsid=" + self.video.dfp_partner_id +
		// 						 "&vid=" + self.video.hashed_code +
		// 						 "&correlator=" + new Date().getTime();

		// 				return tagUrl;
		// 			};

		// 		var adsType = {
		// 				playlistFrame: function(videoId) {
		// 					var $closeButton = null,
		// 						$currentPlaylistAd = null;

		// 					tagUrl = setVastUrl('playlist_frame');

		// 					var startPlaylistFrameAd = function(vastData) {
		// 							var productsHtml = '',
		// 								currentVideoDuration = 0;

		// 							var jsonPlaylistMockup = {
		// 									products: [
		// 										{
		// 											title: 'Curso Online de Maquiagem Profissional',
		// 											clickThrough: 'https://go.hotmart.com/W4802199C',
		// 											image: '/native/offers/image/offer-1-' + currentButtonType + '.png'
		// 										},
		// 										{
		// 											title: 'Dieta de 21 dias - 100% garantido',
		// 											clickThrough: 'https://go.hotmart.com/S4945421D?ap=1323',
		// 											image: '/native/offers/image/offer-2-' + currentButtonType + '.png'
		// 										}
		// 									],
		// 									footerContent: '<span class="footer-time">Essa oferta termina em: <span><span id="time-left-offers" class="time-left"></span> minutos</span></span>'
		// 								};

		// 							for(var x = 0; x < jsonPlaylistMockup.products.length; x++) {
		// 								productsHtml += '<a href="' + jsonPlaylistMockup.products[x].clickThrough +
		// 												'" id="' + x + '" target="_blank" class="playlist-product"><img src="' + jsonPlaylistMockup.products[x].image +
		// 												'" alt="' + jsonPlaylistMockup.products[x].title +
		// 												'" title="' + jsonPlaylistMockup.products[x].title + '" ></a>';
		// 							}

		// 							$('#playlist-products-area').html(productsHtml);
		// 							$('#playlist-footer').html(jsonPlaylistMockup.footerContent);

		// 							$('.playlist-product').on('click', function(e){
		// 								videoJsPlayer.pause();
		// 								ga('send', 'event', 'Performance', 'click', 'hotmart', this.id);
		// 							});

		// 							var secondsToTime = function(currentSeconds) {
		// 									var minutes = Math.floor(currentSeconds % 3600 / 60),
		// 										seconds = Math.floor(currentSeconds % 3600 % 60);

		// 									return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
		// 								};

		// 							var currentStopFunction = function(event) {
		// 									showClose = false;
		// 									$playlistAdArea.removeClass('active');
		// 									$currentPlaylistAd.removeClass('active');
		// 									$closeButton.removeClass('active');
		// 								};

		// 							//self.stopNativeFunction = currentStopFunction();

		// 							SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentStopFunction);

		// 							$timeLeft = $('#time-left-offers');

		// 							var nativeTimerTrigger = function(event) {
		// 									if(showClose) {
		// 										var currentTime = parseInt(event.detail.data.position);

		// 										if(currentTime === 0) {
		// 											if(!impression_trigger){
		// 												impression_trigger = true;
		// 												ga('send', 'event', 'Performance', 'impression', 'hotmart');
		// 											}

		// 											$timeLeft.html(secondsToTime(parseInt(event.detail.data.duration)));
		// 										} if(currentTime >= 4) {
		// 											//self.trackImpression(vastData.impression_url);

		// 											$playlistAdArea.addClass('active');
		// 											$currentPlaylistAd.addClass('active');

		// 										} if(currentTime >= 14) {
		// 											$closeButton.addClass('active');
		// 										}

		// 										if(currentTime >= 4 && currentVideoDuration === 0) {
		// 											currentVideoDuration = parseInt(event.detail.data.duration) - 4;

		// 											var timerCount = 0,
		// 												timerControl = function() {
		// 									                showAdTimeout = setTimeout(function(){

		// 														var currentLeftTime = currentVideoDuration - timerCount,
		// 															timeLeft = secondsToTime(currentLeftTime);

		// 														$timeLeft.html(timeLeft);

		// 									                    if(currentLeftTime === 0) {
		// 									                        clearTimeout(showAdTimeout);
		// 															currentStopFunction();
		// 									                    } else {
		// 									                        timerCount++;
		// 									                        timerControl();
		// 									                    }
		// 									                }, 1000);
		// 									            };

		// 									        timerControl();
		// 										}
		// 									}
		// 								};

		// 							SambaAdsPlayerMessageBroker().addEventListener(Event.TIME, nativeTimerTrigger);

		// 							$closeButton.on('click', function(event){
		// 								event.preventDefault();
		// 								event.stopPropagation();
		// 								currentStopFunction();
		// 							});
		// 						};

		// 					vastSuccessAction = function(vastData, data) {
		// 						$playlistAdArea.html(defaultHtmlContent).promise().done(function(){
		// 							$closeButton = $('.ad-playlist-close');
		// 							$currentPlaylistAd = $('#related-offers-playlist');

		// 							startPlaylistFrameAd(vastData);
		// 						});
		// 					};

		// 					self.loadVastTag(tagUrl, vastSuccessAction);
		// 				}
		// 			};

		// 		var $playlistAdArea = null;

		// 		if(playerConfiguration.detail.data.playlist.position === 'right') {
		// 			$playlistAdArea = $('.playlist-ad-right');
		// 			adsType.playlistFrame(videoId);
		// 		} else if (playerConfiguration.detail.data.playlist.position === 'bottom-horizontal') {
		// 			$playlistAdArea = $('.playlist-ad-horizontal');
		// 			adsType.playlistFrame(videoId);
		// 		}
		// 	};
	
	// self.bradescoFrame = function() {
	// 	var self = this;

	// 		if(!self.vastData.impression_url)
	// 			return;

	// 		self.setCurrentNative($('#bradesco-frame'));

	// 		var videosJsArea = $('#video_js_player'),
	// 			bradescoFrame = $('#bradesco-frame'),
	// 			frameClose = bradescoFrame.find('.frame-close'),
	// 			videoTitleBar = $('#video-title-bar'),
	// 			closeActive = true,
	// 			impression_trigger = false;

	// 		self.nativeTimerTrigger = function(event) {
	// 			if(closeActive) {
	// 				var currentTime = parseInt(event.detail.data.position);

	// 				if(currentTime >= 2) {
	// 					videosJsArea.addClass('native-frame');
	// 					videosJsArea.addClass('bradesco-player-frame');
	// 				//}
	// 				//if(currentTime == 10) {
	// 					if(!impression_trigger){
	// 						impression_trigger = true;
	// 						$(".vjs-control-bar").css({"display":"none"});
	// 						$(".sambaads-playlist").hide();
	// 						$("#sambaads-embed").removeClass('pull-left');
	// 						self.trackImpression(self.vastData.impression_url);
	// 					}
	// 					videosJsArea.addClass('active-native-frame');
	// 					bradescoFrame.addClass('active-native-frame');
	// 					videoTitleBar.addClass('inactive');
	// 				}
	// 				if(currentTime >= 10) {
	// 					frameClose.addClass('active');
	// 				}
	// 			}
	// 		};

	// 		var currentStopFunction = function(event) {
	// 			    $(".vjs-control-bar").css({"display":"flex"});
	// 				videosJsArea.removeClass('active-native-frame');
	// 				bradescoFrame.removeClass('active-native-frame');
	// 				videosJsArea.removeClass('native-frame');
	// 				$(".sambaads-playlist").show();
	// 				videosJsArea.removeClass('bradesco-player-frame');
	// 				frameClose.removeClass('active');
	// 				videoTitleBar.removeClass('inactive');
	// 				if(playerConfiguration.detail.data.playlist.position === 'right') {
	// 					$("#sambaads-embed").addClass('pull-left');
	// 				}
	// 				self.nativeTimerTrigger = function(){};
	// 			};

	// 		SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentStopFunction);

	// 		frameTrigger = $('.frame-trigger');
	// 		frameTrigger.off();	
	// 		frameTrigger.on('click', function(event){
	// 			event.preventDefault();
	// 			window.open(self.vastData.click_url);
	// 		});
			
	// 		frameClose.on('click', function(event){
	// 			event.preventDefault();
	// 			closeActive = false;
	// 			if(playerConfiguration.detail.data.playlist.position === 'right') {
	// 				$("#sambaads-embed").addClass('pull-left');
	// 			}
	// 			videosJsArea.removeClass('bradesco-player-frame');
	// 			videosJsArea.removeClass('active-native-frame');
	// 			bradescoFrame.removeClass('active-native-frame');
	// 			frameClose.removeClass('active');
	// 			$(".vjs-control-bar").css({"display":"flex"});
	// 			$(".sambaads-playlist").show();
				
	// 			window.setTimeout(function(){
	// 				videoTitleBar.removeClass('inactive');
	// 			},2500);
	// 		});
	// 	};

	self.autolineFrame = function(type) {
		var self = this;

			// if(!self.vastData.advertiser)
			// 	return;

			self.setCurrentNative($('#autoline-frame'));

			var videosJsArea = $('#video_js_player'),
				autolineFrame = $('#autoline-frame'),
				frameClose = autolineFrame.find('.frame-close'),
				videoTitleBar = $('#video-title-bar'),
				closeActive = true,
				impression_trigger = false;

			self.nativeTimerTrigger = function(event) {
				if(closeActive) {
					var currentTime = parseInt(event.detail.data.position);

					if(currentTime >= 2) {
						videosJsArea.addClass('native-frame');
						videosJsArea.addClass('autoline-player-frame-'+type);
					//}
					//if(currentTime == 10) {
						if(!impression_trigger){
							impression_trigger = true;
							$(".vjs-control-bar").css({"display":"none"});
							$(".sambaads-playlist").hide();
							$("#sambaads-embed").removeClass('pull-left');
							self.trackImpression(self.vastData.impression_url);
						}
						videosJsArea.addClass('active-native-frame');
						autolineFrame.addClass('active-native-frame');
						autolineFrame.addClass('autoline-frame-' + type);
						videoTitleBar.addClass('inactive');
					}
					if(currentTime >= 10) {
						frameClose.addClass('active');
					}
				}
			};

			var currentStopFunction = function(event) {
				    $(".vjs-control-bar").css({"display":"flex"});
					videosJsArea.removeClass('active-native-frame');
					autolineFrame.removeClass('active-native-frame');
					videosJsArea.removeClass('native-frame');
					$(".sambaads-playlist").show();
					videosJsArea.removeClass('autoline-player-frame-'+type);
					frameClose.removeClass('active');
					videoTitleBar.removeClass('inactive');
					if(playerConfiguration.detail.data.playlist.position === 'right') {
						$("#sambaads-embed").addClass('pull-left');
					}
					self.nativeTimerTrigger = function(){};
				};

			SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentStopFunction);

			frameTrigger = $('.frame-trigger');
			frameTrigger.off();	
			frameTrigger.on('click', function(event){
				event.preventDefault();
				window.open(self.vastData.custom_ad.click_url);
			});
			
			frameClose.on('click', function(event){
				event.preventDefault();
				closeActive = false;
				if(playerConfiguration.detail.data.playlist.position === 'right') {
					$("#sambaads-embed").addClass('pull-left');
				}
				videosJsArea.removeClass('autoline-player-frame-'+type);
				videosJsArea.removeClass('active-native-frame');
				autolineFrame.removeClass('active-native-frame');
				frameClose.removeClass('active');
				$(".vjs-control-bar").css({"display":"flex"});
				$(".sambaads-playlist").show();
				
				window.setTimeout(function(){
					videoTitleBar.removeClass('inactive');
				},2500);
			});
		};	

	self.oiAd = function() {
			var self = this;
			var showClose = true;
			var tagUrl = '';
		
			var oiPlaylistFrame = function() {
				var $currentPlaylistAd = $('#empiricus-playlist'),
					$playlistAdArea = $('#playlist-ad-area'),
					$closeButton = $('#empiricus-playlist-close'),
					$productsTrigger = $('.playlist-product');

				var startPlaylistFrameAd = function() {
					var timestamp = new Date().getTime();
					var url = self.vastData.custom_ad.source;
					url = url.replace('[timestamp]',timestamp);

					var banner = '<iframe src="' + url + '" width="' + self.vastData.custom_ad.width + '" height="' + self.vastData.custom_ad.height + '" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>'
										
					if(banner){
						$('#playlist-products-area').html(banner);
					}

					self.nativeTimerTrigger = function(event) {
						if(showClose) {
							var currentTime = parseInt(event.detail.data.position);

							if(currentTime >= 4) {
									self.trackImpression(self.vastData.impression_url);
									$playlistAdArea.addClass('active');
									$currentPlaylistAd.addClass('active');
							}
							if(currentTime >= 14) {
									$closeButton.addClass('active');
							}
						}
					};

					$closeButton.on('click', function(event){
						event.preventDefault();
						event.stopPropagation();
						showClose = false;
						$playlistAdArea.removeClass('active');
						$currentPlaylistAd.removeClass('active');
						$closeButton.removeClass('active');
					});
				};

				$productsTrigger.off();
				//if(self.vastData.impression_url){
				startPlaylistFrameAd();
				//}

				var currentStopFunction = function(event) {
				    showClose = false;
					$playlistAdArea.removeClass('active');
					$currentPlaylistAd.removeClass('active');
					$closeButton.removeClass('active');

					self.nativeTimerTrigger = function(){};
				};

				SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentStopFunction);
			};

			if(playerConfiguration.detail.data.playlist.position === 'right') {
				oiPlaylistFrame();
			} 
		};
	
	self.genericLoad = function(){
		var tags = self.video.dfp_tags + ",native";

		var navegg_tags = "nvg_gender="+ playerConfiguration.detail.data.navegg_perfil.gender
 		+ "&nvg_age=" + playerConfiguration.detail.data.navegg_perfil.age
 		+ "&nvg_educat=" + playerConfiguration.detail.data.navegg_perfil.education
 		+ "&nvg_marita=" + playerConfiguration.detail.data.navegg_perfil.marital
 		+ "&nvg_income=" + playerConfiguration.detail.data.navegg_perfil.income
 		+ "&nvg_intere=" + playerConfiguration.detail.data.navegg_perfil.interest.replace(/-/g,",")
 		+ "&nvg_produc=" + playerConfiguration.detail.data.navegg_perfil.product.replace(/-/g,",")
 		+ "&nvg_career=" + playerConfiguration.detail.data.navegg_perfil.career
 		+ "&nvg_brand="  + playerConfiguration.detail.data.navegg_perfil.brand.replace(/-/g,",")
 		+ "&nvg_connec=" + playerConfiguration.detail.data.navegg_perfil.connection.replace(/-/g,",")
 		+ "&nvg_everyb=" + playerConfiguration.detail.data.navegg_perfil.everybuyer.replace(/-/g,",")
 		+ "&nvg_custom=" + playerConfiguration.detail.data.navegg_perfil.custom.replace(/-/g,",");

		var custom_params = encodeURIComponent(navegg_tags + "&duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_VideoID=" + self.video.hashed_code + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags);

	 	var tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
				 		 "sz=640x360" +
				 		 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
				 		 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
				 		 "&cust_params=" + custom_params +
				 		 "&cmsid=" + self.video.dfp_partner_id +
				 		 "&vid=" + self.video.hashed_code +
				 		 "&correlator=" + new Date().getTime();

			self.loadVastTag(tagUrl, function(vastData, data){
				if(vastData.custom_ad != undefined && vastData.custom_ad.advertiser == "oi"){
				  	self.oiAd();
				} else if(vastData.custom_ad != undefined && vastData.custom_ad.advertiser == "Bradesco"){
				  	self.oiAd();
				} else if(vastData.custom_ad != undefined && vastData.custom_ad.advertiser == "autoline") {
					 self.autolineFrame(vastData.custom_ad.ad_type);
				} 
			});
	};	

	var secondsToTime = function(currentSeconds) {
			var minutes = Math.floor(currentSeconds % 3600 / 60),
				seconds = Math.floor(currentSeconds % 3600 % 60);

			return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
		};

	var fullAdContent = '';

	var showFullAd = function(videoId) {
		var $playerContainer = $('.sambaads-player-container'),
			$fullAdArea = $('#full-ad-area'),
			isRunning = true,
			adStartSeconds = 5;

		$fullAdArea.html(fullAdContent);

		var $fullAdClose = $('.full-ad-close'),
			$timeLeft = $('#time-left');

		var fullAdStart = function() {
			$playerContainer.addClass('active-full-ad');
		};

		var fullAdStop = function() {
			$playerContainer.removeClass('active-full-ad');
			isRunning = false;
		};

		var fullAdBeforeStart = function() {
			$playerContainer.addClass('full-ad');
		};

		$('.full-ad-main-trigger').on('click', function(event){
			console.log('full-click!');
		});

		$fullAdClose.on('click', function(event){
			event.preventDefault();
			fullAdStop();
		});

		SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, function(){
			$playerContainer.removeClass('active-full-ad');
		});

		var currentVideoDuration = 0;
		fullAdBeforeStart();

		var nativeTimerTrigger = function(event) {
				if(isRunning) {
					var currentTime = parseInt(event.detail.data.position);

					if(currentTime === 0) {
						$timeLeft.html(secondsToTime(parseInt(event.detail.data.duration)));
					} if(currentTime >= adStartSeconds) {
						console.log(1);
						fullAdStart();
					} if(currentTime >= 14) {
						console.log(2);
						$fullAdClose.addClass('active');
					} if(currentTime >= adStartSeconds && currentVideoDuration === 0) {
						currentVideoDuration = parseInt(event.detail.data.duration) - adStartSeconds;

						var timerCount = 0,
							timerControl = function() {
								showAdTimeout = setTimeout(function(){

									var currentLeftTime = currentVideoDuration - timerCount,
										timeLeft = secondsToTime(currentLeftTime);

									$timeLeft.html(timeLeft);

									if(currentLeftTime === 0) {
										clearTimeout(showAdTimeout);
										fullAdStop();
									} else {
										timerCount++;
										timerControl();
									}
								}, 1000);
							};

						timerControl();
					}
				}
			};

		SambaAdsPlayerMessageBroker().addEventListener(Event.TIME, nativeTimerTrigger);
	};

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

		self.vastData = {
			impression_url: '',
			click_url: '',
			custom_ad: ''
		};

		var ownerId = e.detail.data.owner_id,
			videoId = e.detail.data.media_id;

		self.nativeTimerTrigger = function(event){};
		self.stopNativeFunction = function(event){};

		var currentAd = function(){};

		 	currentAd = function() {
		 		//glamboxFrame(videoId);
				 self.genericLoad();
				 //bradescoFrame();
				//relatedOffersAd(videoId);
		 	}

		currentAd();
	};

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

	self.loadVastTag = function(tagUrl, callback, dtype){

		dtype = dtype === '' ? dtype : "xml";

		//tagUrl = "http://local-player.sambaads.com/native/atract/teste.xml";
		
		var videoContent = document.getElementById('playlist-products-area');
		var adDisplayContainer = new google.ima.AdDisplayContainer( document.getElementById('playlist-ad-area'), videoContent);
		adsLoader = new google.ima.AdsLoader(adDisplayContainer);

		// Add event listeners
		adsLoader.addEventListener(
			google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
			onAdsManagerLoaded,
			false);
		adsLoader.addEventListener(
			google.ima.AdErrorEvent.Type.AD_ERROR,
			onAdError,
			false);

		function onAdError(adErrorEvent) {
			// Handle the error logging and destroy the AdsManager
			//console.log(adErrorEvent);
			//console.log(adErrorEvent.getError());
		 	//adsManager.destroy();
		}

		// An event listener to tell the SDK that our content video
		// is completed so the SDK can play any post-roll ads.
		var contentEndedListener = function() {adsLoader.contentComplete();};
		videoContent.onended = contentEndedListener;

		// Request video ads.
		var adsRequest = new google.ima.AdsRequest();
		adsRequest.adTagUrl = tagUrl;

		// Specify the linear and nonlinear slot sizes. This helps the SDK to
		// select the correct creative if multiple are returned.
		adsRequest.linearAdSlotWidth = 0;
		adsRequest.linearAdSlotHeight = 0;
		adsRequest.nonLinearAdSlotWidth = 0;
		adsRequest.nonLinearAdSlotHeight = 0;

		adsLoader.requestAds(adsRequest);

		function onAdsManagerLoaded(adsManagerLoadedEvent) {
			// Get the ads manager.
			self.adsManager = adsManagerLoadedEvent.getAdsManager(videoContent);  // See API reference for contentPlayback
			// Add listeners to the required events.
			self.adsManager.addEventListener(
				google.ima.AdErrorEvent.Type.AD_ERROR,
				onAdError);
			self.adsManager.addEventListener(
				google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
				onContentPauseRequested);
			self.adsManager.addEventListener(
				google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
				onContentResumeRequested);
			self.adsManager.addEventListener(
    			google.ima.AdEvent.Type.STARTED,
    			onAdEvent);
			self.adsManager.addEventListener(
    			google.ima.AdEvent.Type.COMPLETE,
    			onAdEventComplete);


			try {
				// Initialize the ads manager. Ad rules playlist will start at this time.
				self.adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
				// Call start to show ads. Single video and overlay ads will
				// start at this time; this call will be ignored for ad rules, as ad rules
				// ads start when the adsManager is initialized.
			} catch (adError) {
				console.log("ERROR");
				// An error may be thrown if there was a problem with the VAST response.
			}
		}

		function onAdEvent(adEvent) {
			//console.log("start");

		}

		function onAdEventComplete(adEvent) {
			adDisplayContainer.destroy();
		}

		function onContentPauseRequested(adEvent) {
			var ad = adEvent.getAd();
			
			//console.log(ad);

			self.vastData.custom_ad = JSON.parse(ad.getTraffickingParametersString());
			
			callback(self.vastData,ad);
			// This function is where you should setup UI for showing ads (e.g.
			// display ad timer countdown, disable seeking, etc.)
			videoContent.removeEventListener('ended', contentEndedListener);
			//videoContent.pause();
		}

		function onContentResumeRequested(adEvent) {
			
			// This function is where you should ensure that your UI is ready
			// to play content.
			videoContent.addEventListener('ended', contentEndedListener);
			//videoContent.play();
		}

		self.started = false;
		self.nativeTimerTrigger = function(event) {
				var currentTime = parseInt(event.detail.data.position);

				if(!self.started && currentTime >= 4) {
					self.started = true;
					if(self.adsManager)
						self.adsManager.start();
				}
		};

		// $.ajax({
	    //     type: "get",
	    //     url:  tagUrl,
	    //     dataType: dtype,
	    //     success: function(data) {
		// 		if(dtype == 'xml' && typeof data.getElementsByTagName("Impression")[0] !== 'undefined') {
		// 			var el = data.getElementsByTagName("Impression")[0].childNodes[0];
		// 			self.vastData.impression_url = el.nodeValue;
		// 		}

		// 		if(dtype == 'xml' && typeof data.getElementsByTagName("Impression")[0] !== 'undefined') {
		// 			if(typeof data.getElementsByTagName("ClickThrough")[0] !== 'undefined') {
		// 				el = data.getElementsByTagName("ClickThrough")[0].childNodes[0];
		// 				self.vastData.click_url = el.nodeValue;
		// 			}
		// 		}

    	// 		if(dtype == 'xml' && typeof data.getElementsByTagName("VASTAdTagURI")[0] !== 'undefined') {
		// 			el = data.getElementsByTagName("VASTAdTagURI")[0].childNodes[0];
		// 			self.loadVastTag(el.nodeValue,function(vastData, data){
		// 				self.vastData.custom_ad = JSON.parse(data);
		// 				if(typeof callback === 'function') {
		// 					callback(self.vastData, data);
		// 				}
		// 			},'');
		// 		} else {
		// 			if(typeof callback === 'function') {
		// 				callback(self.vastData, data);
		// 			}
		// 		}
	    //     },
	    //     error: function(xhr, status) {
	    //         console.log("error");
	    //     }
    	// });
	}

	self.stopNative = function(e){
		clearTimeout(showAdTimeout);

		displayOverlay.removeClass('active-native');

		if(typeof self.stopNativeFunction !== 'undefined' && typeof self.stopNativeFunction === 'function') {
			self.stopNativeFunction();
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
	SambaAdsPlayerMessageBroker().addEventListener(Event.TRACK_WATCHED, self.nativeTimer);

	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(event){
		playerConfiguration = event;
	});
};

new SambaAdsPlayerControllerNative();
