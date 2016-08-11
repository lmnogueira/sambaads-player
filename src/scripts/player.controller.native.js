var SambaAdsPlayerControllerNative = {};

SambaAdsPlayerControllerNative = function (){
	var self = this,
		displayOverlay = $('#display-overlay');

	var glamboxNative = function(type) {
			var glamboxTrigger = $('#glambox-trigger');

			var glamboxData = {
					glam_box: {
						text: '<div class="simple-text"><span>Quer experimentar novos produtos todo mês e recebê-los na sua casa?</span></div>',
						action_url: 'https://www.glambox.com.br/Landing/show/quetalglambox?utm_source=YContent&utm_medium=Native&utm_content=Top5Unhas',
						highlight_text: '<span>Assine com</span><span class="large-text">R$60</span><span>de desconto</span>'
					},
					glam_mag: {
						text: '<div class="simple-text single-line"><span>Quer mais dicas de beleza?</span></div>',
						action_url: 'https://www.glambox.com.br/Revista/?utm_source=YContent&utm_medium=Native&utm_content=Top5Unhas',
						highlight_text: '<span class="single-text">Conheça o GLAM MAG</span>'
					},
					glam_club: {
						text: '<div class="simple-text"><span>Fique por dentro das últimas novidades de beleza!</span></div>',
						action_url: 'https://www.glambox.com.br/Landing/show/DescontoAssinaturaAgosto2016?utm_source=YContent&utm_medium=Native&utm_content=Top5Unhas',
						highlight_text: '<span>Faça parte desse clube esclusivo</span>'
					}
				};

			var glamboxRandon = {
					styles: [
						'type-1',
						'type-2'
					]
				};

			var currentData = {
					typeData: glamboxData[type],
					style: glamboxRandon.styles[Math.floor(Math.random() * glamboxRandon.styles.length)]
				};

			var triggerContent = glamboxTrigger[0].innerHTML;
			triggerContent = triggerContent.replace('{{glamText}}', currentData.typeData.text);
			triggerContent = triggerContent.replace('{{highlightText}}', currentData.typeData.highlight_text);

			glamboxTrigger[0].innerHTML = triggerContent;

			console.log(triggerContent);

			glamboxTrigger.addClass(currentData.style);

			glamboxTrigger.on('click', function(event){
				event.preventDefault();
				window.open(currentData.typeData.action_url);
			});
		};

	self.startNative = function(e){
		console.log("show");
		console.log(e);

		console.log(displayOverlay);

		setTimeout(function(){
			displayOverlay.addClass('active-native');
		}, 5000);

		//add class current-native based on hashcode. Eq: $('*[data-hashcode="{{hashcode}}"]');

		var videoType = [
				'glam_box',
				'glam_mag',
				'glam_club'
			];

		var glamboxNativeData = glamboxNative(videoType[Math.floor(Math.random() * videoType.length)]);

		var hashCode = 'ycontent';

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
