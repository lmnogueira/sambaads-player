function WidgetController(params, data){
	var self = this;
	self.params = params;
	self.currentMediaId="";
	self.currentPlaylistIndex = 0;
	self.lastPlaylistIndex = 0;
	self.data = data;
	self.playlist = data.playlist;
	self.playerInfo = data.player_info;
	self.publisherInfo = data.publisher_info;
	self.iframeId = window.location.hash.split("#")[1];
}

WidgetController.prototype.getPlaylistItem = function(index) {
	return this.playlist[index];
};

WidgetController.prototype.getCurrentItem = function() {
	return this.getPlaylistItem(this.currentPlaylistIndex)
}


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
		console.log(this.getCurrentItem().tag_list);
		this.sendMessage("click", JSON.stringify({publisherId: this.publisherInfo.hash_code, tagList: String(this.getCurrentItem().tag_list), mediaId: this.getCurrentItem().media_id, description: this.getCurrentItem().description, title: this.getCurrentItem().title}));
	}
};

WidgetController.prototype.load = function(first_argument) {
	// self.updateLoadCount('', this.controller.playerInfo.category_name);
};


WidgetController.prototype.sendMessage = function(smbevent,data){
	// console.log("IFRAME SENT: " + this.iframeId + "::" + smbevent + "::" + data);
	window.parent.postMessage(this.iframeId + "::" + smbevent + "::" + data, "*");
};