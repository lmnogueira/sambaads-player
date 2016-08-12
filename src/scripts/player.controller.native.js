var SambaAdsPlayerControllerNative = {};

SambaAdsPlayerControllerNative = function (){
	var self = this,
		displayOverlay = $('#display-overlay');

	var videoType = {
		'60474': 'glam_box',
		'60475': 'glam_mag',
		'60476': 'glam_club'
	};

	var glamboxData = {
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
	};


	var glamboxRandon = {
			styles: [
				'type-1',
				'type-2'
			]
		};

	var glamboxNative = function(videoId) {
			var glamboxTrigger = $('#glambox-trigger');

			self.currentData = {
					id: videoType[videoId],
					typeData: glamboxData[videoType[videoId]],
					style: glamboxRandon.styles[Math.floor(Math.random() * glamboxRandon.styles.length)]
				};

			self.loadVastTag();

			var triggerContent = glamboxTrigger[0].innerHTML;
			triggerContent = triggerContent.replace('{{glamText}}', self.currentData.typeData.text);
			triggerContent = triggerContent.replace('{{highlightText}}', self.currentData.typeData.highlight_text);

			glamboxTrigger[0].innerHTML = triggerContent;

			glamboxTrigger.addClass(self.currentData.style);

			glamboxTrigger.on('click', function(event){
				event.preventDefault();
				console.log(self.currentData.typeData.click_url);
				window.open(self.currentData.typeData.click_url);
			});

		};

	self.startNative = function(e){

		setTimeout(function(){
			displayOverlay.addClass('active-native');
			self.trackImpression();
		}, 5000);

		self.video = e.detail.data;
		var ownerId = e.detail.data.owner_id,
			videoId = e.detail.data.media_id;

		if(ownerId === 38) {
			var glamboxNativeData = glamboxNative(videoId.toString());
			var hashCode = 'glambox';

			//add class current-native based on hashcode. Eq: $('*[data-hashcode="{{hashcode}}"]');
			$('*[data-hashcode="' + hashCode + '"]').addClass('current-native');
		}
	};

	self.trackImpression = function(){
		self.sendTrack(self.currentData.typeData.impression_url);
	};

	self.trackClick = function(){
		self.sendTrack();
	};

	self.sendTrack = function(url){
		$.get( url );
	};

	self.loadVastTag = function(){

		var tags = self.video.LR_TAGS + ",native," + self.currentData.id + "," + self.currentData.style;
		var custom_params = encodeURIComponent("duration=&CNT_Position=preroll&category=" + self.video.LR_VERTICALS + "&CNT_PlayerType=singleplayer&CNT_MetaTags=" + tags);

 		var tagUrl = "https://pubads.g.doubleclick.net/gampad/ads?" +
 		"sz=640x360" +
 		"&iu=" + "/387067271/Homologacao/TesteNative" + //self.client.ad_unit_id +
 		"&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=&description_url=" +
 		"&cust_params=" + custom_params +
 		"&cmsid=" + self.video.dfp_partner_id +
 		"&vid=" + self.video.hashed_code +
 		"&correlator=" + new Date().getTime();


 		console.log(tagUrl);

		$.ajax({
        type: "get",
        url:  tagUrl,
        dataType: "xml",
        success: function(data) {
            var el = data.getElementsByTagName("Impression")[0].childNodes[0];
            self.currentData.typeData.impression_url = el.nodeValue;

            el = data.getElementsByTagName("ClickThrough")[0].childNodes[0];
            self.currentData.typeData.click_url = el.nodeValue;
        },
        error: function(xhr, status) {
            console.log("error");
        }
    	});
	}

	self.stopNative = function(e){
		displayOverlay.removeClass('active-native');
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

	SambaAdsPlayerMessageBroker().addEventListener(Event.MOUSE_MOVE, self.hoverNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.MOUSE_LEAVE, self.leaveNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_START, self.startNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, self.stopNative);
};

new SambaAdsPlayerControllerNative();
