function SambaadsLayout(params){
	this.info = params;
	this.publisherInfo = params.publisher_info;
	this.mediaSelect = params.playlist[0];
}

SambaadsLayout.prototype.runExtraDependence = function() {
	$(".titulo_assista_tambem").dotdotdot({ watch: 'false' });
  $(".titulo-principal").dotdotdot({ watch: 'false' });
}

SambaadsLayout.prototype.chunk = function(arr, len){
  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
}

SambaadsLayout.prototype.create = function() {
	var self = this;

	$.get("/widget/recommendation/" + this.publisherInfo.hash_code, { 
		c: this.mediaSelect.category_name, 
		t: this.mediaSelect.tag_list 
	}).success(function(data){
		var responseMedias = data;
		var responsePlaylist = responseMedias.playlist;
		var indexMediaDup;
		
		responsePlaylist.forEach(function(element, index){
			if(element.media_id == self.mediaSelect.media_id)
				indexMediaDup = index;
		});

		responsePlaylist.splice(indexMediaDup, 1);
		responsePlaylist.sort(function() { return 0.5 - Math.random() })

		var elementsPlaylistGroup = self.chunk(responsePlaylist, 3);

		// for(var i = 0; i < elementsPlaylistGroup.length; i++){
		for(var i = 0; i < 2; i++){
			self.createTemplate(elementsPlaylistGroup[i]);
			if(i < 1){
				var hrDivisor = document.createElement("hr");
				hrDivisor.className = "divisor_videos";
				$("#sambaads-content").append(hrDivisor);
			}
		}

		self.runExtraDependence();
	});
}

SambaadsLayout.prototype.createTemplate = function(elements) {
	var divMaster = document.createElement("div");
	divMaster.className = "row";

	for(var i = 0; i < elements.length; i++){
		divMaster.appendChild(this.elementTemplate(elements[i]));
	}

	$("#sambaads-content").append(divMaster);
};

SambaadsLayout.prototype.elementTemplate = function(element) {
	var divMedia = document.createElement("div");
	divMedia.className = "col-xs-12 col-sm-4 col-md-4 col-lg-4 sambaads-media";

	var linkImg = document.createElement("a");
	linkImg.href = "/widget/" + this.publisherInfo.hash_code + "/" + element.media_id;

	var divThumb = document.createElement("div");
	divThumb.className = 'video-thumb';

	var img = document.createElement("img");
	img.src = element.image;
	img.alt = element.title;
	img.className = "img-responsive";

	linkImg.appendChild(img);
	divThumb.appendChild(linkImg);
	divMedia.appendChild(divThumb);

	var divProduct = document.createElement("div");
	divProduct.id = "produtor_assista_tambem";
	divProduct.textContent = element.owner_name;
	divMedia.appendChild(divProduct);

	var divTitle = document.createElement("div");
	divTitle.className = "titulo_assista_tambem";
	divTitle.textContent = element.title;
	divTitle.setAttribute('title', element.title);
	divMedia.appendChild(divTitle);
	return divMedia;
};