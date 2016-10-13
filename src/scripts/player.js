//CLASS VIEWABILITY MONITOR PLUGIN
var ViewabilityMonitorPlugin = function (cw, currentIframe){
    this.visiblePlayTimeout = 2000;
    currentIframe.toClearTimeout = 0;

    this.isElementInViewport = function (el) {
        var percentage_of_exposition = 0.5;
        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        var windowHeight = (cw.innerHeight || document.documentElement.clientHeight);
        var windowWidth = (cw.innerWidth || document.documentElement.clientWidth);

        //validate 20% of top
        var widthDiff = rect.width * (1-percentage_of_exposition);
        var heightDiff = rect.height * (1-percentage_of_exposition);

        var checkWidth = rect.width - widthDiff;
        var checkHeight = rect.height - heightDiff;

        if(rect.top <= 0 && (checkHeight <= windowHeight) && (rect.bottom >= checkHeight) ){
            return true;
        } else if(rect.top >= 0 && (checkHeight <= windowHeight) && ((windowHeight - rect.top) >= checkHeight)){
            return true;
        } else {
            return false;
        }
    };

    this.fireIfElementVisible = function(el) {
      var self = this;
      return function () {
          if ( self.isElementInViewport(el) ){
            if(!currentIframe.visible){
                currentIframe.visible = true; //all visible on the window

                currentIframe.toClearTimeout = setTimeout(function(){
                    clearTimeout(currentIframe.toClearTimeout);
                    currentIframe.setVisible(true);

                },  self.visiblePlayTimeout);
            }
          } else {
            clearTimeout(currentIframe.toClearTimeout);
            if(currentIframe.visible){
                currentIframe.visible = false;
                currentIframe.setVisible(false);
            }
          }
      }
    };

    currentIframe.handler = this.fireIfElementVisible (document.getElementById(currentIframe.id));

    if (cw.addEventListener){
        cw.addEventListener("DOMContentLoaded", currentIframe.handler, false);
        cw.addEventListener("load", currentIframe.handler, false);
        cw.addEventListener("resize", currentIframe.handler, false);
        cw.addEventListener("scroll", currentIframe.handler, false);
    } else {
        cw.attachEvent("DOMContentLoaded", currentIframe.handler);
        cw.attachEvent("load", currentIframe.handler);
        cw.attachEvent("resize", currentIframe.handler);
        cw.attachEvent("scroll", currentIframe.handler);
    };
};

//CLASS EXPANDED CINEMA PLUGIN
var ExpandedCinema = function (cw, currentIframe){

    this.sendEvent = function(iframeId, event){
        var player = cw.sambaads.getPlayer(iframeId);
        player.contentWindow().postMessage( player.id + "::expandedCinema::" + event, player.iframe_target_host )
    };

    this.scrollOffset = function() {
        var scrOfX = 0,
            scrOfY = 0;

        if( typeof( window.pageYOffset ) == 'number' ) {
            scrOfY = window.pageYOffset;
            scrOfX = window.pageXOffset;
        } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
            scrOfY = document.body.scrollTop;
            scrOfX = document.body.scrollLeft;
        } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
            scrOfY = document.documentElement.scrollTop;
            scrOfX = document.documentElement.scrollLeft;
        }

        cw.sambaads.expandedCinema.scrOfX = scrOfX;
        cw.sambaads.expandedCinema.scrOfY = scrOfY;
    };

    this.detectContainerPositions = function(iframeId){
        try{
            var el = document.getElementById(iframeId);
            el.style["z-index"] = "20000";
            var viewportOffset = el.getBoundingClientRect();
            var top = viewportOffset.top;
            var left = viewportOffset.left;

            return top + "," + left;
        }
        catch(e){}
    };

    this.load = function(_swfUrl, width, height, iframeId){
            try {

                this.scrollOffset();

                var dcp = this.detectContainerPositions(iframeId);

                var top = dcp.split(",")[0];
                var left = dcp.split(",")[1];

                var wrapper= document.createElement('div');
                wrapper.id = "sambaadsExpandedCinema." + iframeId;
                wrapper.style["position"] = "absolute";
                wrapper.style["margin-left"] = "0px";
                wrapper.style["box-sizing"] = "border-box";
                wrapper.style["margin-top"] = "0px";
                wrapper.style["text-align"] = "left";
                wrapper.style["z-index"] = "10000";
                wrapper.style["cursor"] = "pointer";

                wrapper.innerHTML="<a id='btnClose." + iframeId + "' href='#' style='width: 30px;position: absolute;margin-left: 98%;margin-top: -1.5%; display:none;'><img id='btnCloseImg." + iframeId + "' src='//d3655zppehxyvi.cloudfront.net/lib/close.png' style='width: 30px; display:none;'></a><object id='sambaads_expanded_cinema_swf." + iframeId + "' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' name='sambaads_expanded_cinema_swf." + iframeId + "'><param name='movie' value='" + _swfUrl + "?playerWidth="+width+"&amp;playerHeight="+height+"&amp;playerTop="+top+"&amp;playerLeft="+left+"&amp;iframeId="+iframeId+"'><param name='wmode' value='transparent'><param name='allowfullscreen' value='true'><param name='align' value='middle'><param name='allowscriptaccess' value='always'><embed src='" + _swfUrl + "?playerWidth="+width+"&amp;playerHeight="+height+"&amp;playerTop="+top+"&amp;playerLeft="+left+"&amp;iframeId="+iframeId+"' wmode='transparent' quality='high' id='sambaads_expanded_cinema_swf_embed." + iframeId + "' name='sambaads_expanded_cinema_swf_embed." + iframeId + "' align='middle' allowscriptaccess='always' allowfullscreen='true' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer'></object>";

                document.body.appendChild(wrapper);

                document.getElementById("btnClose." + iframeId).onclick = function(evt) {
                    window.sambaads.expandedCinema.close(iframeId);
                    return false;
                };

                setTimeout(function(){
                    var btnClose = document.getElementById('btnClose.' + iframeId);
                    var btnCloseImg = document.getElementById('btnCloseImg.' + iframeId);

                    btnClose.style["display"] = "block";
                    btnCloseImg.style["display"] = "block";
                }, 5000);

            } catch(e) {
                //console.log(e);
            }
    };

    this.close = function(iframeId){
        try {
            //console.log(iframeId);
            var wrapper= document.getElementById('sambaadsExpandedCinema.' + iframeId);
            wrapper.parentNode.removeChild(wrapper);
        } catch(e) {}
    };
};

(function(cw){

    var detectScript = function(){
        var currentScript = document.currentScript || (function() {
            var scripts = document.getElementsByTagName('script');
            //console.log(scripts);
            if(scripts[scripts.length - 1].src.indexOf("player.sambaads.com") >= 0) {
                return scripts[scripts.length - 1];
            } else {
                for(var i = 0; i<=scripts.length-1; i++){
                     if((cw.sambaads.processedScripts.indexOf(scripts[i].src) < 0) && ((scripts[i].src.indexOf("player.sambaads.com") >= 0) || (scripts[i].src.indexOf("/javascripts/player.js") >= 0))){
                        cw.sambaads.processedScripts.push(scripts[i].src);
                        return scripts[i];
                     }
                }
            }
        })();

        return currentScript;
    }

    //initialize with client window
    var currentLocation = cw.location,
        currentIframe = {},
        videoContainer = '';

    if(!cw.sambaads){
        cw.sambaads = {};
        cw.sambaads.processedScripts = [];
        cw.sambaads.players = []

        cw.sambaads.onStateChange = function(onStateChangeFunction){
            cw.sambaads._onStateChange = onStateChangeFunction;
        };

        cw.sambaads.getPlayer = function(iframeId){

            iframeId = iframeId || "sambaads_0";

            for (var i = 0; i < cw.sambaads.players.length; i++) {
                if(cw.sambaads.players[i].id == iframeId){
                    return cw.sambaads.players[i];
                }
            };
        };

        cw.sambaads.play = function(mediaId){

            mediaId = mediaId || "sambaads_0";

            for (var i = 0; i < cw.sambaads.players.length; i++) {
                if(parseInt(cw.sambaads.players[i].mid) === parseInt(mediaId)){
                    cw.sambaads.players[i].doPlay(true);
                }
            };
        };

        cw.sambaads.pause = function(mediaId){

            mediaId = mediaId || "sambaads_0";

            for (var i = 0; i < cw.sambaads.players.length; i++) {
                if(parseInt(cw.sambaads.players[i].mid) === parseInt(mediaId)){
                    cw.sambaads.players[i].doPause(true);
                }
            };
        };

        cw.sambaads.appendPlayer = function(elementId, customParams){
            customParams.w = customParams.w ? customParams.w : "100%";
            customParams.h = customParams.h ? customParams.h : "100%";
            customParams.request_domain = '/* @echo CDN_PLAYER_DOMAIN */';
            appendIframe(customParams, document.getElementById(elementId));
        };
    };

    var currentScript = detectScript()

    //parse querystring paramenters from url
    var parseQueryString = function( url ) {

        var queryString = url.split("?")[1],
            params = {}, queries, temp, i, l;

        // Split into key/value pairs
        try{
            queries = queryString.split("&");

            // Convert the array of strings into an object
            for ( i = 0, l = queries.length; i < l; i++ ) {
                temp = queries[i].split('=');
                params[temp[0]] = temp[1];
            }
        } catch (e){
            //console.log(e);
        }

        return params;
    };

    var serialize = function(obj) {
        var str = [];
        for(var p in obj){
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + obj[p]);
            }
        }
        return str.join("&");
    }

    var initializePluginsAfeterReady = function(){
        //initializing the Monitor viewability
        new ViewabilityMonitorPlugin(cw, currentIframe);

        //initializing Expanded Cinema Plugin
        cw.sambaads.expandedCinema = new ExpandedCinema(cw, currentIframe);
    }

    var insert = function (referenceNode, newNode) {

        if (referenceNode.tagName != "SCRIPT"){
            referenceNode.appendChild(newNode);
        } else {
            videoContainer.insertBefore(newNode, referenceNode.nextSibling);
        }
    };

    var validateCategory = function(category){
        var entretenimento = 'humor',
        new_category = entretenimento === category ? 'entretenimento' : category;

        return new_category;
    };

    var appendIframe = function(parameters, targetElement){
        //console.log(JSON.stringify(parameters));
        var div = document.createElement('div');
        var iframe_id = "sambaads_" + cw.sambaads.players.length;
        var iframe_url = "";
        var width_height = "";

        parameters.m = parameters.m || parameters.mid || "";
        parameters.plid = parameters.plid || "";
        parameters.ads = parameters.ads || true;
        parameters.p = parameters.p || parameters.pid || "";
        parameters.c = validateCategory(parameters.c) || validateCategory(parameters.cid) || "";
        parameters.t = parameters.t || parameters.tags || "";
        parameters.sk = parameters.sk || "";
        parameters.tm = parameters.tm || "";
        parameters.plp = parameters.plp || "";
        parameters.plw = parameters.plw || "";
        parameters.plh = parameters.plh || "";
        parameters.ct = parameters.ct || "";
        parameters.tb = parameters.tb || "";
        parameters.tbbg = parameters.tbbg || "";
        parameters.tbfs = parameters.tbfs || "";
        parameters.org = parameters.org || "";
        parameters.rfr = encodeURIComponent(window.location.href.replace(/%/g, ""));
        //parameters.rfr = encodeURIComponent("http://vimh.co/2015/03/entendendo-marketing-de-uma-forma-inesquecivel")


        //se não conseguir obter ao menos o publisher ID não deve renderizar o iframe
        if(!parameters.p)
            return;

        iframe_url = "//" + parameters.request_domain + "/iframe/" + parameters.p + "?";

        if (parameters.m){
            iframe_url = iframe_url + "m=" + parameters.m
        } else if (parameters.plid){
            iframe_url = iframe_url + "plid=" + parameters.plid
        } else {
            iframe_url = iframe_url + "c=" + parameters.c
        }

        iframe_url = iframe_url +
                "&t=" + parameters.t +
                "&sk=" + parameters.sk +
                "&tm=" + parameters.tm +
                "&plp=" + parameters.plp +
                "&plw=" + parameters.plw +
                "&plh=" + parameters.plh +
                "&ct=" + parameters.ct +
                "&tb=" + encodeURIComponent(parameters.tb) +
                "&tbbg=" + parameters.tbbg +
                "&tbfs=" + parameters.tbfs +
                "&org=" + parameters.org +
                "&w=" + encodeURIComponent(parameters.w) +
                "&h=" + encodeURIComponent(parameters.h) +
                "&rfr=" + parameters.rfr

        if(parameters.ads=="false"){
            iframe_url = iframe_url + "&ads=" + parameters.ads
        }

        if(parameters.w){
            width_height = "width=\"" + parameters.w + "\" ";
        }

        if(parameters.h){
            width_height = width_height + "height=\"" + parameters.h + "\" ";
        }

        //generate iframe embed
        if(parameters.plid || parameters.m || parameters.c || parameters.t){
            div.innerHTML = "<iframe id=\"" + iframe_id + "\" " + width_height + "src=\"" + iframe_url + "\" frameborder=\"0\" scrolling=\"no\"  webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>";
        } else {
            div.innerHTML = "<div id='sambaads_now_whatch_div' class='sambaads_now_whatch_div'><div style='margin-bottom: 10px;text-align: -webkit-left; text-align: left;'><h3 id='sambaads-now-whatch' class='sambaads-now-whatch' style='margin: .5em 5px; text-align: left; display: inline-block;'>Assista Agora</h3><span id='sambaads_now_whatch_title_" + iframe_id + "' class='sambaads_now_whatch_title' style='font-family: verdana, arial, sans-serif; color:#126cb0;font-size:1.1em; font-weight: bold;'></span></div><iframe id=\"" + iframe_id + "\" " + width_height + "src=\"" + iframe_url + "\" frameborder=\"0\" scrolling=\"no\"  webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe><div style='width: 640;height: 30px;'><p style='font-size: 11px; margin: 0px; color: #B0B0B0; text-align: right; font-family: Helvetica, Arial, sans-serif;'>powered by <a href='//www.ycontent.com.br/?utm_campaign=Recomendador&amp;utm_medium=Powered&amp;utm_source=PlayerRecomendador'><img src='data:image/png;base64,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' style='vertical-align:middle; width:80px !important; height: 12px !important; margin-top: 2px;'> </a></p></div></div>";
        }

        if (parameters.p == '29e21db92767b2e54997e8dfab1b5f28' && parameters.t != 'pets'){
            insert((targetElement || currentScript), div.firstChild);
        } else if (parameters.p != '29e21db92767b2e54997e8dfab1b5f28'){
            insert((targetElement || currentScript), div.firstChild);
        }

        var iframe_data = {
            id : iframe_id,
            pid : parameters.p || parameters.pid || "",
            mid : parameters.m || parameters.mid || "",
            cid : parameters.c || parameters.cid || "",
            plw : parameters.plw || 0,
            plh : parameters.plh || 0,
            dimension : parameters.d || parameters.dimension,
            width: parameters.w,
            height: parameters.h,
            iframe_target_host: cw.location.protocol + "//" + parameters.request_domain,
            toClearTimeout: 0,
            isReady: false,
            contentWindow: function(){
                if(document.getElementById(this.id)) {
                    return document.getElementById(this.id).contentWindow;
                }
                return false;
            },
            sendMessage: function(smbevent,data){
                if(this.contentWindow().postMessage){
                    this.contentWindow().postMessage( this.id + "::" + smbevent + "::" + data, this.iframe_target_host )
                }
            },
            doPlay:function(force){
                force = force || false;

                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::play::");
                    this.contentWindow().postMessage( this.id + "::onPlay::" + force, this.iframe_target_host )
                }

            },
            setVisible:function(data){

                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::play::");
                    this.contentWindow().postMessage( this.id + "::onVisible::" + data, this.iframe_target_host )
                }

            },
            setMute:function(data){

                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::play::");
                    this.contentWindow().postMessage( this.id + "::onMute::" + data, this.iframe_target_host )
                }

            },
            doPause:function(force){
                force = force || false;
                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::pause::");
                    this.contentWindow().postMessage( this.id + "::onPause::" + force, this.iframe_target_host )
                }
            },
            seek:function(seek_position){
                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::pause::");
                    this.contentWindow().postMessage( this.id + "::onSeek::"+seek_position, this.iframe_target_host )
                }
            },
            debug:function(){
                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::pause::");
                    this.contentWindow().postMessage( this.id + "::onDebug::", this.iframe_target_host )
                }
            }
        };

        //get the iframeId controled by this script
        currentIframe = iframe_data;

        //store all player embeded on the same page
        cw.sambaads.players.push(iframe_data);

        return iframe_data;
    };

    var init = function(){
        //parser = new DOMParser()
        //console.log("Initializing SambaAds JS Player!");


        //initialize parameters
        var parameters = parseQueryString(currentScript.src);

        if (parameters.p === undefined) return;

        //fix # whene user use by incorrect form.
        if (parameters.sk !== undefined) {

            if(parameters.sk.indexOf('#') >= 0){
               parameters.sk = "blue";
            }

            if(!isNaN(parameters.sk)){
                parameters.sk = "blue";
            }
        }


        videoContainer = currentScript.parentNode;

        // Check script is dynamic append in DOM
        if(typeof dynamicScript != 'undefined') {
            parameters = parseQueryString(dynamicScript);
            videoContainer = document.getElementById(videoContainerId);
        }

        parameters.w = parameters.w ? parameters.w : "100%";
        parameters.h = parameters.h ? parameters.h : "100%";
        parameters.request_domain = '/* @echo CDN_PLAYER_DOMAIN */';

        //append the iframe player
        var iframe_data = appendIframe(parameters);

        //initializing the crossdomain message support
        crossMessageInitialization(iframe_data);

        var playersLength = cw.sambaads.players.length,
            playersList = cw.sambaads.players,
            playListItem = '',
            playerEl = '';

        if(playersLength != 0) {
            //adding listener to iframe elements
            for (var i = 0; i < playersLength; i++) {

                playListItem = playersList[i],
                playerEl = document.getElementById(playListItem.id);

                if(!playListItem.onMouseOver) {
                    playListItem.onMouseOver = function(event){
                        if(typeof playListItem.state != "undefined") {
                            if(playListItem.state == "PLAYING" || playListItem.state == "PAUSED") {
                                playListItem.sendMessage("mouseover","");
                                playerEl.removeEventListener("mouseover", playListItem.onMouseOver);
                            }
                        }
                    };

                    if (playerEl.addEventListener) {
                        playerEl.addEventListener("mouseover", playersList[i].onMouseOver, false);
                    } else {
                        playerEl.attachEvent("mouseover", playersList[i].onMouseOver);
                    }
                }
            };
        }
    };

    var onMessageReceive = function(event){
        if(event.origin.indexOf("azureedge") >= 0 || event.origin.indexOf('/* @echo CDN_PLAYER_DOMAIN */') >= 0){

            var params = event.data.split("::");

            if (params[1] == "onSetupError" ){
                if(document.getElementById("sambaads_now_whatch_div") ){
                    document.getElementById("sambaads_0").remove();
                    document.getElementById("sambaads_now_whatch_div").remove();
                }
            }

            if(params[0] == currentIframe.id){
                //console.log("CORE RECEIVED:" + event.data)

                if (params[1] == "onReady" ){
                    clearInterval(currentIframe.isReady);
                    currentIframe.isReady = true;
                    currentIframe.player_width = params[2].split(",")[1];
                    currentIframe.player_height = params[2].split(",")[2] - 4; //- 4 pixels ajust
                    initializePluginsAfeterReady();
                }

                if (params[1] == "onStateChange" ){
                    currentIframe.state = params[2];

                    if( typeof cw.sambaads._onStateChange === 'function'){

                        var evt = {
                            iframeId : currentIframe.id,
                            mediaId : currentIframe.mid,
                            state : currentIframe.state
                        }
                        cw.sambaads._onStateChange(evt);
                    }
                }

                if (params[1] == "onLoadExpandedCinema" ){
                    var player = cw.sambaads.getPlayer(params[0]);
                    cw.sambaads.expandedCinema.load(params[2], player.player_width, player.player_height, player.id);
                }

                if (params[1] == "onRemoveExpandedCinema" ){
                    var player = cw.sambaads.getPlayer(params[0]);
                    cw.sambaads.expandedCinema.close(player.id);
                }

                if (params[1] == "onNowWatchTitle" ) {
                    //console.log(params[2])
                    if(document.getElementById("sambaads_now_whatch_title_" + params[0])){
                        document.getElementById("sambaads_now_whatch_title_" + params[0]).innerHTML = params[2];
                    }
                }
            }
        }
    };

    var crossMessageInitialization = function(iframeData){
        if (cw.addEventListener){
            cw.addEventListener("message", onMessageReceive, false);
        } else {
            attachEvent("onmessage", onMessageReceive);
        };

        iframeData.isReady = setInterval(function(){
            iframeData.sendMessage("onReady","");
        },1000)
    };

    function documentReady(funcName, baseObj) {
        "use strict";
        // The public function name defaults to window.docReady
        // but you can modify the last line of this function to pass in a different object or method name
        // if you want to put them in a different namespace and those will be used instead of
        // window.docReady(...)
        funcName = funcName || "docReady";
        baseObj = baseObj || window;
        var readyList = [];
        var readyFired = false;
        var readyEventHandlersInstalled = false;

        // call this when the document is ready
        // this function protects itself against being called more than once
        function ready() {
            if (!readyFired) {
                // this must be set to true before we start calling callbacks
                readyFired = true;
                for (var i = 0; i < readyList.length; i++) {
                    // if a callback here happens to add new ready handlers,
                    // the docReady() function will see that it already fired
                    // and will schedule the callback to run right after
                    // this event loop finishes so all handlers will still execute
                    // in order and no new ones will be added to the readyList
                    // while we are processing the list
                    readyList[i].fn.call(window, readyList[i].ctx);
                }
                // allow any closures held by these functions to free
                readyList = [];
            }
        }

        function readyStateChange() {
            if ( document.readyState === "complete" ) {
                ready();
            }
        }

        // This is the one public interface
        // docReady(fn, context);
        // the context argument is optional - if present, it will be passed
        // as an argument to the callback
        baseObj[funcName] = function(callback, context) {
            // if ready has already fired, then just schedule the callback
            // to fire asynchronously, but right away
            if (readyFired) {
                setTimeout(function() {callback(context);}, 1);
                return;
            } else {
                // add the function and context to the list
                readyList.push({fn: callback, ctx: context});
            }
            // if document already ready to go, schedule the ready function to run
            // IE only safe when readyState is "complete", others safe when readyState is "interactive"
            if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
                setTimeout(ready, 1);
            } else if (!readyEventHandlersInstalled) {
                // otherwise if we don't have event handlers installed, install them
                if (document.addEventListener) {
                    // first choice is DOMContentLoaded event
                    document.addEventListener("DOMContentLoaded", ready, false);
                    // backup is window load event
                    window.addEventListener("load", ready, false);
                } else {
                    // must be IE
                    document.attachEvent("onreadystatechange", readyStateChange);
                    window.attachEvent("onload", ready);
                }
                readyEventHandlersInstalled = true;
            }
        }
    }

    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // if(!iOS){
    //     documentReady("docReady", this);
    //     docReady(init,this);
    // } else {
        init();
    //}
})(this);
