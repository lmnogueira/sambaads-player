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

SambaadsModal.createStyleTag = function(styleString) {
    var styleTag = document.createElement('style');
    styleTag.type = 'text/css';

    if (styleTag.styleSheet){
        styleTag.styleSheet.cssText = styleString;
    } else {
      styleTag.appendChild(document.createTextNode(styleString));
    }

    document.body.appendChild(styleTag);
}

SambaadsModal.prototype.createElementPlayer = function(arguments){
    var self = this,
        modal = document.getElementsByClassName("sambaads-modal-body")[0],
        divMaster = document.createElement('div'),
        w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    divMaster.id = "sambaads-master";
    divMaster.className = "sambaads-master";

    var divChildren = document.createElement('div');
    divChildren.style.backgroundColor = "#fff";
    divChildren.style.padding = "13px";

    var divScript = document.createElement('div');
    divScript.id = "sambaads-modal-script";
    divScript.className = "sambaads-modal-script";

    var script = document.createElement('script');
    script.type= 'text/javascript';
    // script.src= '/javascripts/player.js?m=' + arguments.mediaId + '&p=' + arguments.publisherId + '&sk=blue&tm=light&h=360&debug=true';
    script.src= '/* @echo PLAYER_SCRIPT_URL */' + '?m=' + arguments.mediaId + '&p=' + arguments.publisherId + '&sk=blue&tm=light&h=100%';

    var divContext = document.createElement('div');

    var divTitle = document.createElement('div');
    divTitle.textContent = arguments.title;
    divTitle.style.fontSize = "1em";
    divTitle.style.color = "#000";
    divTitle.style.fontWeight = "bold";
    divTitle.style.textAlign = "left";
    divTitle.style.margin = "10px 10px 4px";

    var ownerName = document.createElement('div');
    ownerName.style.fontSize = '.8em';
    ownerName.style.textAlign = 'left';
    ownerName.style.margin = '0 10px 20px 10px';
    ownerName.textContent = arguments.ownerName;

    var divDescription = document.createElement('div');
    divDescription.textContent = arguments.description;
    divDescription.style.fontSize = ".8em";
    divDescription.style.color = "#000";
    divDescription.style.margin = "0 10px 15px 10px";
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

    var spanFacebook = document.createElement("span");
    spanFacebook.id = "sambaads-facebook";
    divShared.appendChild(spanFacebook);

    var spanTwitter = document.createElement("span");
    spanTwitter.id = "sambaads-twitter";
    spanTwitter.setAttribute('st_via', 'sambaads');
    divShared.appendChild(spanTwitter);

    var spanGoogle = document.createElement("span");
    spanGoogle.id = "sambaads-googleplus";
    divShared.appendChild(spanGoogle);


    var linkClose = document.createElement('a');
    linkClose.href = "#";
    linkClose.className = "sambaads-close-modal";

    var cssStyles =
        '.cf-sambaads:before, \
        .cf-sambaads:after { \
            content: " "; \
            display: table; \
        } \
        .sambaads-master { \
            max-width: 640px; \
            position: absolute; \
            margin: 10% auto; \
            left: 0px; \
            right: 0px; \
        } \
        .sambaads-modal-script { \
            height: 360px; \
        } \
        .sambaads-close-modal { \
            color: rgb(153, 153, 153); \
            width: 36px; \
            height: 36px; \
            text-decoration: none; \
            display: block; \
            position: absolute; \
            top: -18px; \
            right: -18px; \
            background: url("//' + '/* @echo NGINX_WIDGET_DOMAIN */' + '/images/close_modal.png") \
        } \
        @media screen and (max-width: 45em) { \
            .sambaads-master { \
                max-width: 100% !important; \
            } \
            .sambaads-modal-script { \
                height: 190px; \
            } \
            .sambaads-close-modal { \
                top: -20px; \
                right: -3px; \
            } \
        }';

    SambaadsModal.createStyleTag(cssStyles);

    modal.appendChild(divMaster);
    divMaster.appendChild(linkClose);
    divMaster.appendChild(divChildren);
    divScript.appendChild(script);
    divChildren.appendChild(divScript);
    divContext.appendChild(divTitle);
    divContext.appendChild(ownerName);
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
    div.style.fontFamily = "Helvetica, sans-serif";
    div.style.fontSize = "16px";
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
        evt.stopPropagation();
        if(evt.target.className == "sambaads-modal-body" || evt.target.className == "sambaads-close-modal")
            self.close();
    };
};

SambaadsModal.prototype.open = function(arguments){
    var div = document.createElement('div');
    this.defineStylePage(div);
    this.createElementPlayer(arguments);
    stLight.options({'publisher': "f7e96c33-f1d5-4759-bbc3-d33cdab556ad", 'doNotHash': false, 'doNotCopy': false, 'hashAddressBar': false, 'shorten': false});

    var type_shares = ["facebook", "twitter", "googleplus"];

    type_shares.forEach(function(type){
        stWidget.addEntry({
            "service": type,
            "element": document.getElementById('sambaads-' + type),
            "url": encodeURIComponent('/* @echo FACEBOOK_SHARER_URL */' + "?mid=" + arguments.mediaId + "&pid=" + arguments.publisherId),
            "title": arguments.title,
            "type":"large",
            "image": arguments.image,
            "summary": arguments.description
        });
    })
};

cw.sambaads.SambaadsModal = SambaadsModal;
