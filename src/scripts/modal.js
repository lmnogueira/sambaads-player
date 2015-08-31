function SambaadsModal(){};

SambaadsModal.prototype.setKeyDownElements = function(element, self){
	for(var i=0; i < element.childNodes.length; i++){
		if(element.childNodes.length >= 1){
			this.setKeyDownElements(element.childNodes[i], self);
		}
		element.addEventListener("keydown", function(evt) {
			evt = evt || window.event;
			if (evt.keyCode == 27) {
				self.close();
			}
		});
	}
};

SambaadsModal.prototype.createElementPlayer = function(arguments){
	var self = this;
	var modal = document.getElementsByClassName("sambaads-modal-body")[0];

	var divMaster = document.createElement('div');
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	divMaster.style.position = "absolute";
	divMaster.id = "sambaads-master";

	var divChildren = document.createElement('div');
	divChildren.style.backgroundColor = "#fff";
	divChildren.style.padding = "13px";

	var divScript = document.createElement('div');
	divScript.style.height = "360px";
	divScript.style.width = "640px";

	var script = document.createElement('script');
	script.type= 'text/javascript';
	script.src= '/javascripts/player.js?m=' + arguments.mediaId + '&p=' + arguments.publisherId + '&sk=blue&tm=light&tb=&tbbg=&w=640&h=360&debug=true';

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

	var divDescription = document.createElement('div');
	divDescription.textContent = arguments.description;
	divDescription.style.fontSize = "0.99em";
	divDescription.style.color = "#000";
	divDescription.style.margin = "0 10px";
	divDescription.style.fontFamily = "helvetica,sans-serif";
	divDescription.style.textAlign = "justify";

	var divTags = document.createElement('div');
	divTags.style.fontSize = "0.8em";
	divTags.style.fontWeight = "bold";
	divTags.style.margin = "10px 0 0px 10px";
	divTags.style.textAlign = "left";
	divTags.textContent = arguments.tagList;

	var linkClose = document.createElement('a');
	linkClose.href = "#";
	linkClose.textContent = "Fechar";
	linkClose.style.float = "right";
	linkClose.style.color = "#999";
	linkClose.style.textDecoration = "none";
	linkClose.className = "sambaads-close-modal";

	modal.appendChild(divMaster);
	divMaster.appendChild(divChildren);
	divScript.appendChild(script);
	divChildren.appendChild(divScript);
	divContext.appendChild(divTitle);
	divContext.appendChild(divDescription);
	divContext.appendChild(divTags);
	divTags.appendChild(linkClose);
	divChildren.appendChild(divContext);

	divMaster.style.top = (h - divMaster.clientHeight)/2 + "px";
	divMaster.style.left = (w - divMaster.clientWidth)/2 + "px";

	this.createListeners(linkClose);
	modal.focus();
	this.setKeyDownElements(modal, this);
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
	div.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
	div.style.textAlign = "center";
	div.style.overflow = "auto";
	div.tabIndex = "-1";
	this.createListeners(div);

	body.appendChild(div);
};


SambaadsModal.prototype.close = function(){
	var body = document.getElementsByTagName("body")[0];
	var modal = document.getElementsByClassName("sambaads-modal-body")[0];
	body.removeChild(modal);
};


SambaadsModal.prototype.createListeners = function(element){
	var self = this;
	element.onclick = function(evt){
		if(evt.target.className == "sambaads-modal-body" || evt.target.className == "sambaads-close-modal")
			self.close();
	};
};

SambaadsModal.prototype.open = function(arguments){
	var div = document.createElement('div');
	this.defineStylePage(div);
	this.createElementPlayer(arguments);
};

cw.sambaads.SambaadsModal = SambaadsModal;