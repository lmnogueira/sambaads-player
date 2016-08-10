var SambaAdsPlayerControllerNative = {};

SambaAdsPlayerControllerNative = function (){
	var self = this;

	self.startNative = function(e){
		console.log("show");
		console.log(e);

		//add class current-native based on hashcode. Eq: $('*[data-hashcode="{{hashcode}}"]');

		var hashCode = 'ycontent';

		$('*[data-hashcode="' + hashCode + '"]').addClass('current-native');
	};

	self.stopNative = function(e){
		console.log("hide");
	};

	SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_START, self.startNative);
	SambaAdsPlayerMessageBroker().addEventListener(Event.NATIVE_STOP, self.stopNative);
};

new SambaAdsPlayerControllerNative();
