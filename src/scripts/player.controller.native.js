var SambaAdsPlayerControllerNative = {};

SambaAdsPlayerControllerNative = function (){
	var self = this,
		displayOverlay = $('#display-overlay'),
		JWPlayer = window.jwplayer('jw_sambaads_player'),
		playerConfiguration = null,
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

			var tags = self.video.dfp_tags + ",native," + self.currentData.id + "," + self.currentData.style,
				custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags);

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
				tags = self.video.dfp_tags + ",native," + videoType[videoId] + ",new_style",
				custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
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
				frameClose = glamboxFrame.find('.frame-close'),
				videoTitleBar = $('#video-title-bar'),
				closeActive = true,
				impression_trigger = false;

			self.nativeTimerTrigger = function(event) {
				if(closeActive) {
					var currentTime = parseInt(event.detail.data.position);

					if(currentTime >= 1) {
						JWplayerArea.addClass('native-frame');
						JWplayerArea.addClass('glambox-player-frame');
					}
					if(currentTime == 10) {
						if(!impression_trigger){
							impression_trigger = true;
							self.trackImpression(currentVastData.impression_url);
						}
						JWplayerArea.addClass('active-native-frame');
						glamboxFrame.addClass('active-native-frame');
						videoTitleBar.addClass('inactive');
					}
					if(currentTime >= 14) {
						frameClose.addClass('active');
					}
				}
			};

			var currentStopFunction = function(event) {
					JWplayerArea.removeClass('active-native-frame');
					glamboxFrame.removeClass('active-native-frame');
					JWplayerArea.removeClass('native-frame');
					JWplayerArea.removeClass('glambox-player-frame');
					frameClose.removeClass('active');
					videoTitleBar.removeClass('inactive');
					self.nativeTimerTrigger = function(){};
				};

			SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentStopFunction);

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

			var tags = self.video.dfp_tags + ",native," + self.currentData.id + "," + self.currentData.style,
				custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags);

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

	var toroRadarFrame = function(videoId) {
			self.setCurrentNative($('#toro-frame'));

			var JWplayerArea = $('#jw_sambaads_player'),
				toroRadarAdFrame = $('#toro-frame'),
				frameClose = toroRadarAdFrame.find('.frame-close'),
				videoTitleBar = $('#video-title-bar'),
				closeActive = true;

			self.nativeTimerTrigger = function(event) {
				if(closeActive) {
					var currentTime = parseInt(event.detail.data.position);

					if(currentTime >= 1) {
						JWplayerArea.addClass('native-frame');
						JWplayerArea.addClass('toro-player-frame');
					}
					if(currentTime == 10) {
						self.trackImpression(currentVastData.impression_url);
						JWplayerArea.addClass('active-native-frame');
						toroRadarAdFrame.addClass('active-native-frame');
						videoTitleBar.addClass('inactive');
					}
					if(currentTime >= 14) {
						frameClose.addClass('active');
					}
				}
			};

			self.stopNativeFunction = function(event) {
				JWplayerArea.removeClass('active-native-frame');
				toroRadarAdFrame.removeClass('active-native-frame');
				JWplayerArea.removeClass('native-frame');
				JWplayerArea.removeClass('toro-player-frame');
				frameClose.removeClass('active');
				videoTitleBar.removeClass('inactive');
				self.nativeTimerTrigger = function(){};
			};

			var frameType = [
					'start-investing',
					'today-scenario',
					'ebook'
				],
				bgType = [
					'toro-black',
					'toro-blue',
					'toro-green'
				],
				frameTrigger = $('.frame-trigger');

				self.currentData = {
					id: videoId
				};

			var currentFrameType = frameType[Math.floor(Math.random() * frameType.length)],
				currentBgType = bgType[Math.floor(Math.random() * frameType.length)];

			frameTrigger.addClass(currentFrameType);
			JWplayerArea.addClass(currentBgType);

			var tags = self.video.dfp_tags + ",native,toro_frame_" + currentFrameType + "toro_bg_type" + currentBgType + ",",
				custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
				tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
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

				frameTrigger.on('click', function(event){
					event.preventDefault();
					window.open(vastData.click_url);
				});
			});

			frameClose.on('click', function(event){
				event.preventDefault();
				closeActive = false;
				JWplayerArea.removeClass('active-native-frame');
				toroRadarAdFrame.removeClass('active-native-frame');
				frameClose.removeClass('active');

				window.setTimeout(function(){
					videoTitleBar.removeClass('inactive');
				},2500);
			});
		};

	var empiricusAd = function(videoId) {
			var vastSuccessAction = function(vastData, data){}
				showClose = true,
				tagUrl = '';

			var setVastUrl = function(adType) {
				var tags = self.video.dfp_tags + ",native,empiricus_" + adType + ",",
					custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
					tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
							 "sz=640x360" +
							 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
							 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
							 "&cust_params=" + custom_params +
							 "&cmsid=" + self.video.dfp_partner_id +
							 "&vid=" + self.video.hashed_code +
							 "&correlator=" + new Date().getTime();

					return tagUrl;
				};

			var adsType = {
					empiricusPlaylistFrame: function(videoId) {
						var $currentPlaylistAd = $('#empiricus-playlist'),
							$playlistAdArea = $('#playlist-ad-area'),
							$closeButton = $('#empiricus-playlist-close'),
							$productsTrigger = $('.playlist-product');

						tagUrl = setVastUrl('playlist_frame');

						var startPlaylistFrameAd = function(vastData) {
								productsHtml = '';

								var jsonPlaylistMockup = {
										products: [
											{
												title: 'A febre do Ouro',
												clickThrough: 'http://www.ycontent.com.br',
												image: 'http://local-player.sambaads.com/native/empiricus/image/book-a-febre-do-ouro.png'
											},
											{
												title: 'Relatório: A megaprivatização da Petrobras?',
												clickThrough: 'http://www.ycontent.com.br',
												image: 'http://local-player.sambaads.com/native/empiricus/image/relatorio-petrobras.png'
											}
										],
										footerContent: '<img src="http://local-player.sambaads.com/native/empiricus/image/logo-empiricus.png" alt="Empiricus Logo">'
									};

								for(var x = 0; x < jsonPlaylistMockup.products.length; x++) {
									productsHtml += '<a href="' + jsonPlaylistMockup.products[x].clickThrough +
													'" target="_blank" class="playlist-product"><img src="' + jsonPlaylistMockup.products[x].image +
													'" alt="' + jsonPlaylistMockup.products[x].title +
													'" title="' + jsonPlaylistMockup.products[x].title + '"></a>';
								}

								$('#playlist-products-area').html(productsHtml);
								$('#playlist-footer').html(jsonPlaylistMockup.footerContent);

								self.nativeTimerTrigger = function(event) {
									if(showClose) {
										var currentTime = parseInt(event.detail.data.position);

										if(currentTime >= 4) {
											self.trackImpression(vastData.impression_url);
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

						var vastSuccessAction = function(vastData, data) {
							$productsTrigger.off();
							startPlaylistFrameAd(vastData);
						};

						self.loadVastTag(tagUrl, vastSuccessAction);
					},
					empiricusLead: function(videoId) {
						var $currentTrigger = $('#empiricus-trigger'),
							$closeButton = $('#empiricus-lead-close'),
							$insideClose = $('.inside-close');
							$leadArea = $('#empriricus-lead-area'),
							$sendLead = $('#send-lead'),
							$leadSuccess = $('#lead-success'),
							leadAreaContent = $('.lead-area-content');

						var startLeadAd = function() {
								self.nativeTimerTrigger = function(event) {
									if(showClose) {
										var currentTime = parseInt(event.detail.data.position);

										//if(currentTime === 10) {
										if(currentTime >= 4) {
											self.trackImpression(currentVastData.impression_url);
											$currentTrigger.addClass('active');
										}
										if(currentTime >= 14) {
											$closeButton.addClass('active');
										}
									}
								};

								$currentTrigger.on('click', function(event){
									event.preventDefault();
									event.stopPropagation();
									JWPlayer.pause();
									showClose = false;
									$closeButton.removeClass('active');
									$currentTrigger.removeClass('active');
									$leadArea.addClass('active');
								});

								$insideClose.on('click', function(event){
									event.preventDefault();
									event.stopPropagation();
									$leadArea.removeClass('active');

									setTimeout(function(){
										JWPlayer.play();
									}, 200);
								});

								$closeButton.on('click', function(event){
									event.preventDefault();
									event.stopPropagation();
									showClose = false;

									$closeButton.removeClass('active');
									$currentTrigger.removeClass('active');
								});

								$sendLead.on('click', function(event){
									event.preventDefault();
									event.stopPropagation();
									leadAreaContent.removeClass('active');

									setTimeout(function () {
										$leadSuccess.addClass('active');
									}, 300);
								});
							};

						var vastSuccessAction = function(vastData, data) {
							$currentTrigger.off();
							currentVastData = vastData;
							startLeadAd();
						};

						tagUrl = setVastUrl('lead');

						self.setCurrentNative($currentTrigger);
						self.loadVastTag(tagUrl, vastSuccessAction);
					}
				};

			if(playerConfiguration.detail.data.playlist.position === 'right') {
				adsType.empiricusPlaylistFrame(videoId);
			} else {
				adsType.empiricusLead(videoId);
			}
		};

	var blackFriday = function(videoId) {
			var vastSuccessAction = function(vastData, data){}
				showClose = true,
				tagUrl = '',
				impression_trigger = false,
				currentFrameStop = function(){};

			var defaultHtmlContent = '<div id="black-friday-playlist" class="black-friday-playlist ad-playlist">' +
										'<button type="button" id="black-friday-playlist-close" class="black-friday-playlist-close ad-playlist-close ir inside-close" title="Fechar playlist Ad">Fechar</button>' +
										'<div class="black-friday-playlist-title ad-playlist-title"><img src="/native/black-friday/image/logo-black-friday.png"></div>' +
										'<div id="playlist-products-area" class="playlist-products-area cf"></div>' +
										'<div id="playlist-footer" class="playlist-footer"></div>' +
									'</div>';

			var setVastUrl = function(adType) {
				var tags = self.video.dfp_tags + ",native,black_friday_" + adType + ",",
					custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
					tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
							 "sz=640x360" +
							 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
							 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
							 "&cust_params=" + custom_params +
							 "&cmsid=" + self.video.dfp_partner_id +
							 "&vid=" + self.video.hashed_code +
							 "&correlator=" + new Date().getTime();

					return tagUrl;
				};

			var adsType = {
					playlistFrame: function(videoId) {
						var $closeButton = null,
							$currentPlaylistAd = null,


						tagUrl = setVastUrl('playlist_frame');

						var startPlaylistFrameAd = function(vastData) {
								var productsHtml = '',
									currentVideoDuration = 0;

									// 62904 - Smartphone - Bateria
									// 62903 - Smartphone - Fotos
									// 70261 - Beleza - Boca Glitter
									// 71472 - Beleza - Delineado Esfumado

								var videosCheck = {
										62904: 'tech',
										62903: 'tech',
										70261: 'boca_glitter',
										71472: 'delineado_esfumado'
									};

								var jsonPlaylistMockup = {
										type: {
											full: {
												tech: {
													products: [
														{
															title: 'Iphone 6',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/iphone.png'
														},
														{
															title: 'Samsung Galaxy',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/samsung.png'
														},
														{
															title: 'Motorola',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/samsung.png'
														}
													]
												},
												boca_glitter: {
													products: [
														{
															title: 'Batom Retro',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/battom-retro.png'
														},
														{
															title: 'Mac Sombra',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/mac-sombra.png'
														}
													]
												},
												delineado_esfumado: {
													products: [
														{
															title: 'Perfect Lapis',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/lapis.png'
														},
														{
															title: 'Cilios',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/cilios.png'
														}
													]
												}
											},
											playlist_only: {
												tech: {
													products: [
														{
															title: 'Iphone 6',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/iphone.png'
														},
														{
															title: 'Samsung Galaxy',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/samsung.png'
														}
													]
												},
												boca_glitter: {
													products: [
														{
															title: 'Batom Líquido',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/battom-retro.png'
														},
														{
															title: 'Mac Sombra',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/mac-sombra.png'
														}
													]
												},
												delineado_esfumado: {
													products: [
														{
															title: 'Perfect Lapis',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/lapis.png'
														},
														{
															title: 'Cilios',
															clickThrough: 'http://www.ycontent.com.br',
															image: '/native/black-friday/image/cilios.png'
														}
													]
												}
											}
										},
										footerContent: '<span class="footer-time">Essa oferta termina em: <span><span id="blackfriday-time-left" class="time-left"></span> minutos</span></span>'
									};

								var currentProducts = jsonPlaylistMockup.type[currentAdType][videosCheck[videoId]].products;
								//var currentProducts = jsonPlaylistMockup.type[videosCheck[videoId]].products;

								for(var x = 0; x < currentProducts.length; x++) {
									productsHtml += '<a href="' + currentProducts[x].clickThrough +
													'" id="' + x + '" target="_blank" class="playlist-product"><img src="' + currentProducts[x].image +
													'" alt="' + currentProducts[x].title +
													'" title="' + currentProducts[x].title + '" ></a>';
								}

								$('#playlist-products-area').html(productsHtml);
								$('#black-friday-playlist').addClass(currentAdType);
								$('#playlist-footer').html(jsonPlaylistMockup.footerContent);

								var $currentPlaylistAd = $('#black-friday-playlist'),
									$playlistAdArea = $('#playlist-ad-area'),
									$closeButton = $('#black-friday-playlist-close'),
									$productsTrigger = $('.playlist-product'),
									$timeLeft = $('#blackfriday-time-left');

								$productsTrigger.on('click', function(e){
									JWPlayer.pause();
									ga('send', 'event', 'Performance', 'click', 'hotmart', this.id);
								});

								var secondsToTime = function(currentSeconds) {
										var minutes = Math.floor(currentSeconds % 3600 / 60),
											seconds = Math.floor(currentSeconds % 3600 % 60);

										return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
									};

								var currentStopFunction = function(event) {
										showClose = false;
										$playlistAdArea.removeClass('active');
										$currentPlaylistAd.removeClass('active');
										$closeButton.removeClass('active');
									};

								SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentStopFunction);

								var nativeTimerTrigger = function(event) {
										if(showClose) {
											var currentTime = parseInt(event.detail.data.position);

											if(currentTime === 0) {
												if(!impression_trigger){
													impression_trigger = true;
													//ga('send', 'event', 'Performance', 'impression', 'hotmart');
												}

												$timeLeft.html(secondsToTime(parseInt(event.detail.data.duration)));
											} if(currentTime >= 4) {
												self.trackImpression(vastData.impression_url);

												$playlistAdArea.addClass('active');
												$currentPlaylistAd.addClass('active');

											} if(currentTime >= 14) {
												$closeButton.addClass('active');
											}

											if(currentTime >= 4 && currentVideoDuration === 0) {
												currentVideoDuration = parseInt(event.detail.data.duration) - 4;

												var timerCount = 0,
													timerControl = function() {
										                showAdTimeout = setTimeout(function(){

															var currentLeftTime = currentVideoDuration - timerCount,
																timeLeft = secondsToTime(currentLeftTime);

															$timeLeft.html(timeLeft);

										                    if(currentLeftTime === 0) {
										                        clearTimeout(showAdTimeout);
																currentStopFunction();
																currentFrameStop();
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

								$closeButton.on('click', function(event){
									event.preventDefault();
									event.stopPropagation();
									currentStopFunction();
									currentFrameStop();
								});
							};

						vastSuccessAction = function(vastData, data) {
							$playlistAdArea.html(defaultHtmlContent).promise().done(function(){
								$closeButton = $('.ad-playlist-close');
								$currentPlaylistAd = $('#related-offers-playlist');

								startPlaylistFrameAd(vastData);
							});
						};

						self.loadVastTag(tagUrl, vastSuccessAction);
					},
					blackFridayFrame: function(videoId) {
						self.setCurrentNative($('#blackfriday-frame'));

						var JWplayerArea = $('#jw_sambaads_player'),
							blackFridayFrame = $('#blackfriday-frame'),
							frameClose = blackFridayFrame.find('.frame-close'),
							videoTitleBar = $('#video-title-bar'),
							closeActive = true,
							impression_trigger = false;

						self.nativeTimerTrigger = function(event) {
							if(closeActive) {
								var currentTime = parseInt(event.detail.data.position);

								if(currentTime >= 1) {
									JWplayerArea.addClass('native-frame');
									JWplayerArea.addClass('blackfriday-player-frame');
								} if(currentTime == 4) {
									if(!impression_trigger){
										impression_trigger = true;
										//self.trackImpression(currentVastData.impression_url);
									}
									JWplayerArea.addClass('active-native-frame');
									blackFridayFrame.addClass('active-native-frame');
									videoTitleBar.addClass('inactive');
								} if(currentTime >= 14) {
									frameClose.addClass('active');
								}
							}
						};

						currentFrameStop = function(event) {
							JWplayerArea.removeClass('active-native-frame');
							blackFridayFrame.removeClass('active-native-frame');
							JWplayerArea.removeClass('native-frame');
							JWplayerArea.removeClass('blackfriday-player-frame');
							frameClose.removeClass('active');
							videoTitleBar.removeClass('inactive');
							self.nativeTimerTrigger = function(){};
						};

						SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentFrameStop);

						frameTrigger = $('.frame-trigger');

						frameTrigger.off();
						frameTrigger.on('click', function(event){
							event.preventDefault();
							window.open(vastData.click_url);
						});

						frameClose.on('click', function(event){
							event.preventDefault();
							closeActive = false;
							JWplayerArea.removeClass('active-native-frame');
							blackFridayFrame.removeClass('active-native-frame');
							frameClose.removeClass('active');

							window.setTimeout(function(){
								videoTitleBar.removeClass('inactive');
							}, 2500);
						});
					}
				};

			var $playlistAdArea = null,
				//currentAdType = ['full','playlist_only'][Math.round(Math.random())],
				currentAdType = 'full',
				startAd = function() {
					adsType.playlistFrame(videoId);
					if(currentAdType ==='full') {
						adsType.blackFridayFrame(videoId);
					}
				};

			if(playerConfiguration.detail.data.playlist.position === 'right') {
				$playlistAdArea = $('.playlist-ad-right');
				startAd();
			} else if (playerConfiguration.detail.data.playlist.position === 'bottom-horizontal') {
				$playlistAdArea = $('.playlist-ad-horizontal');
				startAd();
			}
		};

		var relatedOffersAd = function(videoId) {
				var vastSuccessAction = function(vastData, data){}
					showClose = true,
					tagUrl = '',
					impression_trigger = false,
					offerButtonTypes = [
						'color',
						'line'
					],
					currentButtonType = offerButtonTypes[Math.round(Math.random())];

				var defaultHtmlContent = '<div id="related-offers-playlist" class="related-offers-playlist ad-playlist">' +
											'<button type="button" id="related-offers-playlist-close" class="related-offers-playlist-close ad-playlist-close ir inside-close" title="Fechar playlist Ad">Fechar</button>' +
											'<div class="related-offers-playlist-title ad-playlist-title">Ofertas Incríveis para Você</div>' +
											'<div id="playlist-products-area" class="playlist-products-area"></div>' +
											'<div id="playlist-footer" class="playlist-footer"></div>' +
										'</div>';

				var setVastUrl = function(adType) {
					var tags = self.video.dfp_tags + ",native,related_offers_" + adType + "_" + currentButtonType + ",",
						custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags),
						tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
								 "sz=640x360" +
								 "&iu=" + encodeURIComponent(self.client.ad_unit_id) +
								 "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
								 "&cust_params=" + custom_params +
								 "&cmsid=" + self.video.dfp_partner_id +
								 "&vid=" + self.video.hashed_code +
								 "&correlator=" + new Date().getTime();

						return tagUrl;
					};

				var adsType = {
						playlistFrame: function(videoId) {
							var $closeButton = null,
								$currentPlaylistAd = null;

							tagUrl = setVastUrl('playlist_frame');

							var startPlaylistFrameAd = function(vastData) {
									var productsHtml = '',
										currentVideoDuration = 0;

									var jsonPlaylistMockup = {
											products: [
												{
													title: 'Curso Online de Maquiagem Profissional',
													clickThrough: 'https://go.hotmart.com/W4802199C',
													image: '/native/offers/image/offer-1-' + currentButtonType + '.png'
												},
												{
													title: 'Dieta de 21 dias - 100% garantido',
													clickThrough: 'https://go.hotmart.com/S4945421D?ap=1323',
													image: '/native/offers/image/offer-2-' + currentButtonType + '.png'
												}
											],
											footerContent: '<span class="footer-time">Essa oferta termina em: <span><span id="time-left-offers" class="time-left"></span> minutos</span></span>'
										};

									for(var x = 0; x < jsonPlaylistMockup.products.length; x++) {
										productsHtml += '<a href="' + jsonPlaylistMockup.products[x].clickThrough +
														'" id="' + x + '" target="_blank" class="playlist-product"><img src="' + jsonPlaylistMockup.products[x].image +
														'" alt="' + jsonPlaylistMockup.products[x].title +
														'" title="' + jsonPlaylistMockup.products[x].title + '" ></a>';
									}

									$('#playlist-products-area').html(productsHtml);
									$('#playlist-footer').html(jsonPlaylistMockup.footerContent);

									$('.playlist-product').on('click', function(e){
										JWPlayer.pause();
										ga('send', 'event', 'Performance', 'click', 'hotmart', this.id);
									});

									var secondsToTime = function(currentSeconds) {
											var minutes = Math.floor(currentSeconds % 3600 / 60),
												seconds = Math.floor(currentSeconds % 3600 % 60);

											return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
										};

									var currentStopFunction = function(event) {
											showClose = false;
											$playlistAdArea.removeClass('active');
											$currentPlaylistAd.removeClass('active');
											$closeButton.removeClass('active');
										};

									//self.stopNativeFunction = currentStopFunction();

									SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, currentStopFunction);

									$timeLeft = $('#time-left-offers');

									var nativeTimerTrigger = function(event) {
											if(showClose) {
												var currentTime = parseInt(event.detail.data.position);

												if(currentTime === 0) {
													if(!impression_trigger){
														impression_trigger = true;
														ga('send', 'event', 'Performance', 'impression', 'hotmart');
													}

													$timeLeft.html(secondsToTime(parseInt(event.detail.data.duration)));
												} if(currentTime >= 4) {
													//self.trackImpression(vastData.impression_url);

													$playlistAdArea.addClass('active');
													$currentPlaylistAd.addClass('active');

												} if(currentTime >= 14) {
													$closeButton.addClass('active');
												}

												if(currentTime >= 4 && currentVideoDuration === 0) {
													currentVideoDuration = parseInt(event.detail.data.duration) - 4;

													var timerCount = 0,
														timerControl = function() {
											                showAdTimeout = setTimeout(function(){

																var currentLeftTime = currentVideoDuration - timerCount,
																	timeLeft = secondsToTime(currentLeftTime);

																$timeLeft.html(timeLeft);

											                    if(currentLeftTime === 0) {
											                        clearTimeout(showAdTimeout);
																	currentStopFunction();
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

									$closeButton.on('click', function(event){
										event.preventDefault();
										event.stopPropagation();
										currentStopFunction();
									});
								};

							vastSuccessAction = function(vastData, data) {
								$playlistAdArea.html(defaultHtmlContent).promise().done(function(){
									$closeButton = $('.ad-playlist-close');
									$currentPlaylistAd = $('#related-offers-playlist');

									startPlaylistFrameAd(vastData);
								});
							};

							self.loadVastTag(tagUrl, vastSuccessAction);
						}
					};

				var $playlistAdArea = null;

				if(playerConfiguration.detail.data.playlist.position === 'right') {
					$playlistAdArea = $('.playlist-ad-right');
					adsType.playlistFrame(videoId);
				} else if (playerConfiguration.detail.data.playlist.position === 'bottom-horizontal') {
					$playlistAdArea = $('.playlist-ad-horizontal');
					adsType.playlistFrame(videoId);
				}
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
						fullAdStart();
					} if(currentTime >= 14) {
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
											self.video.category_name + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" +
											self.video.dfp_tags +
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

		can_publisher_play = "e7a0e7ece4bf9e68a0656c09ce1479a0,97faba17c7747183dc86c29e40f1adad,949fe90cced05c43bd73410701dc198d,092ac38067a00fa2a5c3335c61565cc1,15663c838a3846e8c06e25a69b89f276".indexOf(self.client.hash_code) >= 0;
		can_vertical_play = "FEMININO,FASHION,LIFESTYLE,GASTRONOMIA,SAUDE_E_FITNESS".indexOf(self.video.category_name) >= 0;


		// Check is InfoMoney hash_code ca04f15a06527c725b9915e91c860e8d
		//self.client.hash_code = 'ca04f15a06527c725b9915e91c860e8d';
		//if(self.client.hash_code === 'ca04f15a06527c725b9915e91c860e8d') {
			//toroRadarFrame(videoId);
		//} else

		var currentAd = function(){};

		if(can_publisher_play || can_vertical_play) {
			currentAd = function() {
				//glamboxFrame(videoId);
				relatedOffersAd(videoId);
			}
		}

		var empiricusCheck = false;

		if(empiricusCheck) {
			currentAd = empiricusAd;
		}

		var blackFridayCheck = videoId === 62904 || videoId === 62903 || videoId === 70261 || videoId === 71472;

		if(blackFridayCheck && self.client.hash_code === 'ab1f939133333fbc4ba49b1984248a47') {
			currentAd = blackFriday;
		}

		if(videoId === 62073 && self.client.hash_code === 'ab1f939133333fbc4ba49b1984248a47') {
			currentAd = showFullAd;
			fullAdContent = '<div class="full-ad-item full-empiricus active"><div class="full-ad-usable-area"><button type="button" class="full-ad-main-trigger">Trigger!</button><button type="button" class="full-ad-close full-empiricus-close"></button><div class="full-empiricus-products-list full-ad-products-list"><div class="full-empiricus-product"><a href="http:///www.ycontent.com.br" target="_blank"><img src="/native/empiricus-new/image/petrobras-report.png" alt="Relatório Petrobrás"></a></div><div class="full-empiricus-product"><a href="http:///www.ycontent.com.br" target="_blank"><img src="/native/empiricus-new/image/book-febre.png" alt="Livro Febre do Ouro"></a></div></div></div><div class="full-ad-bottom-area"><div class="empiricus-time-left">Essa oferta termina em: <span><span id="time-left">00:00</span> minutos</span></div></div></div>';
		}

		if(videoId === 74616 && self.client.hash_code === 'ab1f939133333fbc4ba49b1984248a47') {
			currentAd = showFullAd;
			fullAdContent = '<div class="full-ad-item full-sephora active"><div class="full-ad-usable-area"><div class="time-left">Essa oferta termina em: <span class="time-left-holder"><span id="time-left">00:00</span> minutos</span></div><button type="button" class="full-ad-main-trigger"></button><button type="button" class="full-ad-close full-sephora-close"></button><div class="full-sephora-products-list full-ad-products-list"><div class="full-ad-product"><a href="http:///www.ycontent.com.br" target="_blank"><img src="/native/sephora/image/offer-1.png" alt="Produto"></a></div><div class="full-ad-product"><a href="http:///www.ycontent.com.br" target="_blank"><img src="/native/sephora/image/offer-2.png" alt="Produto"></a></div><div class="full-ad-product"><a href="http:///www.ycontent.com.br" target="_blank"><img src="/native/sephora/image/offer-3.png" alt="Produto"></a></div></div></div><div class="full-ad-bottom-area"></div></div>';
		}

		//currentAd = toroRadarFrame;

		currentAd(videoId);
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
					if(typeof data.getElementsByTagName("ClickThrough")[0] !== 'undefined') {
						el = data.getElementsByTagName("ClickThrough")[0].childNodes[0];
						vastData.click_url = el.nodeValue;
					}
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
	SambaAdsPlayerMessageBroker().addEventListener(Event.TIME, self.nativeTimer);

	SambaAdsPlayerMessageBroker().addEventListener(Event.CONFIGURATION_READY, function(event){
		playerConfiguration = event;
	});
};

new SambaAdsPlayerControllerNative();
