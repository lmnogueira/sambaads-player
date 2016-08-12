var SambaAdsPlayerControllerNative = {};

SambaAdsPlayerControllerNative = function (){
	var self = this,
		displayOverlay = $('#display-overlay');

	var glamboxNative = function(videoId) {
			var glamboxTrigger = $('#glambox-trigger');

			var videoType = {
					'60474': 'glam_box',
					'60475': 'glam_mag',
					'60476': 'glam_club'
				};

			var glamboxData = {
					glam_box: {
						text: '<div class="simple-text"><span>Quer experimentar novos produtos todo mês e recebê-los na sua casa?</span></div>',
						action_url: 'https://www.glambox.com.br/Landing/show/DescontoAssinaturaAgosto2016?utm_source=YContent&utm_medium=Native&utm_content=BatomLiquido',
						highlight_text: '<span>Assine com</span><span class="large-text">R$60</span><span>de desconto</span>'
					},
					glam_mag: {
						text: '<div class="simple-text single-line"><span>Quer mais dicas de beleza?</span></div>',
						action_url: 'https://www.glambox.com.br/Revista/?utm_source=YContent&utm_medium=Native&utm_content=Top5Sombra',
						highlight_text: '<span class="single-text">Conheça o GLAM MAG</span>'
					},
					glam_club: {
						text: '<div class="simple-text"><span>Fique por dentro das últimas novidades de beleza!</span></div>',
						action_url: 'https://www.glambox.com.br/Landing/show/quetalglambox?utm_source=YContent&utm_medium=Native&utm_content=TrancasBoxeador',
						highlight_text: '<span>Faça parte desse clube exclusivo</span>'
					}
				};

			var glamboxRandon = {
					styles: [
						'type-1',
						'type-2'
					]
				};

			var currentData = {
					typeData: glamboxData[videoType[videoId]],
					style: glamboxRandon.styles[Math.floor(Math.random() * glamboxRandon.styles.length)]
				};

			var triggerContent = glamboxTrigger[0].innerHTML;
			triggerContent = triggerContent.replace('{{glamText}}', currentData.typeData.text);
			triggerContent = triggerContent.replace('{{highlightText}}', currentData.typeData.highlight_text);

			glamboxTrigger[0].innerHTML = triggerContent;

			glamboxTrigger.addClass(currentData.style);

			glamboxTrigger.on('click', function(event){
				event.preventDefault();
				window.open(currentData.typeData.action_url);
			});
		};

	self.startNative = function(e){
		console.log("show");
		console.log(e);

		setTimeout(function(){
			displayOverlay.addClass('active-native');
		}, 5000);

		console.log(e.detail.data.media_id);

		var videoId = '60474';

		var glamboxNativeData = glamboxNative(videoId);

		var hashCode = 'glambox';

		//add class current-native based on hashcode. Eq: $('*[data-hashcode="{{hashcode}}"]');
		$('*[data-hashcode="' + hashCode + '"]').addClass('current-native');
	};

	self.stopNative = function(e){
		console.log("hide");
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

	SambaAdsPlayerMessageBroker().addEventListener(Event.MOUSE_MOVE, self.hoverNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.MOUSE_LEAVE, self.leaveNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_START, self.startNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, self.stopNative);
};

new SambaAdsPlayerControllerNative();
