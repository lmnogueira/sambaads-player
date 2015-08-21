function SambaadsModal(){};

SambaadsModal.prototype.createElementPlayer = function(arguments){
	var modal = document.getElementsByClassName("sambaads-modal-body")[0];
	
	var divMaster = document.createElement('div');
	// var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	divMaster.style.position = "relative";
	divMaster.style.top = (h - 360)/2 + "px";
	modal.appendChild(divMaster);

	var script = document.createElement('script');
	script.type= 'text/javascript';
	script.src= '/javascripts/player.js?m=' + arguments.mediaId + '&p=' + arguments.publisherId + '&sk=blue&tm=light&tb=&tbbg=&w=640&h=360&debug=true';
	divMaster.appendChild(script);

	var div = document.createElement('div');
	div.textContent = arguments.description;
  div.style.fontSize = "14px";
  div.style.color = "#fff";
  div.style.margin = "0 26%";
  div.style.fontFamily = "sans-serif";
  div.style.textAlign = "justify";
	divMaster.appendChild(div);
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