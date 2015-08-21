function WidgetController(params, data){
	var self = this;
	// self.guid = encodeURIComponent(this.guid());
	self.params = params;
	self.currentMediaId="";
	self.currentPlaylistIndex = 0;
	self.lastPlaylistIndex = 0;
	self.data = data;
	self.playlist = data.playlist;
	self.playerInfo = data.player_info;
	self.publisherInfo = data.publisher_info;
}

WidgetController.prototype.getPlaylistItem = function(index) {
	return this.playlist[index];
};

WidgetController.prototype.getPlaylist = function() {
	return this.playlist;
};

WidgetController.prototype.play = function(element) {
	var index = element.id.split("-")[1];
	this.currentPlaylistIndex = index;
	var link_url = $(element).find("a")[0];
	if(this.params.target == "blank"){
		var win = window.open($(link_url).data("href"), '_blank');
		win.focus();
	}else{
		console.log("abrir modal");
	}
};

WidgetController.prototype.load = function(first_argument) {
	// self.updateLoadCount('', this.controller.playerInfo.category_name);
};