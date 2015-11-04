var SambaAdsPlayerControlerCollector = {};

SambaAdsPlayerControlerCollector = function (){
	var self = this;

	SambaAdsPlayerMessageBroker().addEventListener(Event.TRACKER, function(e){
		//console.log(e.detail);
		//self.sendGif(e.datail.data);
	});
};

SambaAdsPlayerControlerCollector.prototype.sendGif = function(options){
	var url = document.referrer || window.location.href
	var a = $('<a>', { href:url } )[0];

	options.satmref = a.hostname;
	options.satmfullref = url;


    $.get('/* @echo COLLECTOR_URL */', options).done(function(msg) {
		//alert("success load cont");
	}).error(function(){
		//alert("error load cont");
	});

};

new SambaAdsPlayerControlerCollector();

