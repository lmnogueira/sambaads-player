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
	divMaster.style.width = "640px";
	divMaster.style.margin = "10% auto";
	divMaster.style.left = "0";
	divMaster.style.right = "0";

	var divChildren = document.createElement('div');
	divChildren.style.backgroundColor = "#fff";
	divChildren.style.padding = "13px";

	var divScript = document.createElement('div');
	divScript.style.height = "360px";

	var script = document.createElement('script');
	script.type= 'text/javascript';
	// script.src= '/javascripts/player.js?m=' + arguments.mediaId + '&p=' + arguments.publisherId + '&sk=blue&tm=light&h=360&debug=true';
	script.src= '/* @echo PLAYER_SCRIPT_URL */' + '?m=' + arguments.mediaId + '&p=' + arguments.publisherId + '&sk=blue&tm=light&h=360&debug=true';

	var divContext = document.createElement('div');

	var divTitle = document.createElement('div');
	divTitle.textContent = arguments.title;
	divTitle.style.fontSize = "16px";
	divTitle.style.color = "#000";
	divTitle.style.fontFamily = "helvetica,sans-serif";
	divTitle.style.fontWeight = "bold";
	divTitle.style.textAlign = "left";
	divTitle.style.margin = "10px 10px";

	var divDescription = document.createElement('div');
	divDescription.textContent = arguments.description;
	divDescription.style.fontSize = "16px";
	divDescription.style.color = "#000";
	divDescription.style.margin = "0 10px";
	divDescription.style.fontFamily = "helvetica,sans-serif";
	divDescription.style.textAlign = "justify";

	var divContextTagsAndShared = document.createElement('div');
	divContextTagsAndShared.className = 'cf-sambaads';

	var divTags = document.createElement('div');
	divTags.style.fontSize = "0.8em";
	divTags.style.fontWeight = "bold";
	divTags.style.margin = "10px 0 0px 10px";
	divTags.style.textAlign = "left";

	var tags = "Tags: " + arguments.tagList;
	divTags.textContent = tags.split(",").join(", ");
	divTags.style.fontSize = "0.8em";
  divTags.style.fontWeight = "bold";
  divTags.style.margin = "10px 0px 0px 10px";
  divTags.style.textAlign = "left";
  divTags.style.overflow = "hidden";

	var divShared = document.createElement("div");
	divShared.id = "titulo_compartilhar";
	divShared.style.float = "right";

	var linkClose = document.createElement('a');
	linkClose.href = "#";
	linkClose.style.color = "#999";
	linkClose.style.width = '36px';
  linkClose.style.height = '36px';
  linkClose.style.color = 'rgb(153, 153, 153)';
  linkClose.style.textDecoration = 'none';
  linkClose.style.background = 'url("/images/close_modal.png")';
  linkClose.style.display = 'block';
  linkClose.style.backgroundSize = '100% auto';
  linkClose.style.position = 'absolute';
  linkClose.style.right = '-18px';
  linkClose.style.top = '-18px';
  linkClose.className = "sambaads-close-modal";

  var css = '.cf-sambaads:before,.cf-sambaads:after {content: " ";display: table;}';
	var style = document.createElement('style');
	style.type = 'text/css';

	if (style.styleSheet){
	 	style.styleSheet.cssText = css;
	} else {
	  style.appendChild(document.createTextNode(css));
	}

	document.body.appendChild(style);

	modal.appendChild(divMaster);
	divMaster.appendChild(linkClose);
	divMaster.appendChild(divChildren);
	divScript.appendChild(script);
	divChildren.appendChild(divScript);
	divContext.appendChild(divTitle);
	divContext.appendChild(divDescription);
	divContextTagsAndShared.appendChild(divShared);
	divContextTagsAndShared.appendChild(divTags);
	divContext.appendChild(divContextTagsAndShared);
	divChildren.appendChild(divContext);

	// divMaster.style.top = (h - divMaster.clientHeight)/2 + "px";
	// divMaster.style.left = (w - divMaster.clientWidth)/2 + "px";

	this.createListeners(linkClose);
	modal.focus();
	this.setKeyDownElements(modal, this);
};

SambaadsModal.prototype.defineStylePage = function(div){
	var body = document.getElementsByTagName("body")[0];
	body.style.overflow = "hidden";

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
	body.style.overflow = "";
	body.removeChild(modal);
};


SambaadsModal.prototype.createListeners = function(element){
	var self = this;
	element.onclick = function(evt){
		evt.preventDefault();
		if(evt.target.className == "sambaads-modal-body" || evt.target.className == "sambaads-close-modal")
			self.close();
	};
};

SambaadsModal.prototype.open = function(arguments){
	var div = document.createElement('div');
	this.defineStylePage(div);
	this.createElementPlayer(arguments);
	stLight.options({'publisher': "f7e96c33-f1d5-4759-bbc3-d33cdab556ad", 'doNotHash': false, 'doNotCopy': false, 'hashAddressBar': false});

	var type_shares = ["facebook", "twitter", "googleplus", "linkedin", "pinterest"];

	type_shares.forEach(function(type){ 
		stWidget.addEntry({
			"service": type,
			"element": document.getElementById('titulo_compartilhar'),
			"url": encodeURIComponent('/* @echo FACEBOOK_SHARER_URL */' + "?mid=" + arguments.id + "&pid=" + arguments.publisherId),
			"title": arguments.title,
			"type":"large",
			"image":"",
			"summary": arguments.description
		});
	})
};

cw.sambaads.SambaadsModal = SambaadsModal;