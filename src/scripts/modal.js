function SambaadsModal(){};

SambaadsModal.prototype.createElementPlayer = function(arguments){
	var modal = document.getElementsByClassName("sambaads-modal-body")[0];
	
	var divMaster = document.createElement('div');
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	divMaster.style.position = "absolute";
	divMaster.id = "div-master";
	modal.appendChild(divMaster);

	var divChildren = document.createElement('div');
	divChildren.style.backgroundColor = "#fff";
	divChildren.style.padding = "13px";
	divMaster.appendChild(divChildren);

	var divScript = document.createElement('div');
	divScript.style.height = "360px";
	divScript.style.width = "640px";

	var script = document.createElement('script');
	script.type= 'text/javascript';
	script.src= '/javascripts/player.js?m=' + arguments.mediaId + '&p=' + arguments.publisherId + '&sk=blue&tm=light&tb=&tbbg=&w=640&h=360&debug=true';
	divScript.appendChild(script);

	divChildren.appendChild(divScript);

	var divContext = document.createElement('div');
	divContext.style.width = "640px";

	var divTitle = document.createElement('div');
	divTitle.textContent = arguments.title;
	divTitle.style.fontSize = "1.5em";
	divTitle.style.color = "#000";
	divTitle.style.fontFamily = "helvetica,sans-serif";
	divTitle.style.fontWeight = "bold";
	divTitle.style.textAlign = "left";
	divTitle.style.margin = "10px 10px";
	divContext.appendChild(divTitle);

	var divDescription = document.createElement('div');
	divDescription.textContent = arguments.description;
  divDescription.style.fontSize = "0.99em";
  divDescription.style.color = "#000";
  divDescription.style.margin = "0 10px";
  divDescription.style.fontFamily = "helvetica,sans-serif";
  divDescription.style.textAlign = "justify";
	divContext.appendChild(divDescription);

	var divTags = document.createElement('div');
	divTags.style.fontSize = "0.8em";
	divTags.style.fontWeight = "bold";
	divTags.style.margin = "10px 0 0px 10px";
	divTags.style.textAlign = "left";
	divTags.textContent = arguments.tagList;
	divContext.appendChild(divTags);

	divChildren.appendChild(divContext);

	divMaster.style.top = (h - divMaster.clientHeight)/2 + "px";
	divMaster.style.left = (w - divMaster.clientWidth)/2 + "px";
};

SambaadsModal.prototype.defineStylePage = function(div){
	var body = document.getElementsByTagName("body")[0];

	div.className = "sambaads-modal-body";
	div.style.position = "fixed";
	div.style.top = "0";
	div.style.right = "0";
	div.style.bottom = "0";
	div.style.left = "0";
	div.style.zIndex = "99999999";
	div.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
	div.style.textAlign = "center";
	div.style.overflow = "auto";

	body.appendChild(div);
};

SambaadsModal.prototype.open = function(arguments){
	var div = document.createElement('div');
	this.createListeners(div);
	this.defineStylePage(div);
	this.createElementPlayer(arguments);
};

SambaadsModal.prototype.close = function(){
	var body = document.getElementsByTagName("body")[0];
	var modal = document.getElementsByClassName("sambaads-modal-body")[0];
	body.removeChild(modal);
};


SambaadsModal.prototype.createListeners = function(element){
	var self = this;
	element.onclick = function(){
		self.close();
	}
};

cw.sambaads.SambaadsModal = SambaadsModal;