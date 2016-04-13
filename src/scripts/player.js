//CLASS VIEWABILITY MONITOR PLUGIN
var ViewabilityMonitorPlugin = function (cw, currentIframe){
    this.visiblePlayTimeout = 1000;
    currentIframe.toClearTimeout = 0;

    this.isElementInViewport = function (el) {
        var percentage_of_exposition = 0.8;
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

            if(scripts[scripts.length - 1].src.indexOf("player.sambaads.com") != 0)
                return scripts[scripts.length - 1];
        })();

        return currentScript;
    }

    //initialize with client window
    var currentScript = detectScript(),
        currentLocation = cw.location,
        currentIframe = {},
        videoContainer = '';

    if(!cw.sambaads){
        cw.sambaads = {};
        cw.sambaads.players = []

        cw.sambaads.getPlayer = function(iframeId){

            iframeId = iframeId || "sambaads_0";

            for (var i = 0; i < cw.sambaads.players.length; i++) {
                if(cw.sambaads.players[i].id == iframeId){
                    return cw.sambaads.players[i];
                }
            };
        };
    };

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

    var insertAfter = function (referenceNode, newNode) {
        videoContainer.insertBefore(newNode, referenceNode.nextSibling);
    };

    var validateCategory = function(category){
        var entretenimento = 'humor',
        new_category = entretenimento.indexOf(category) > -1 ? 'entretenimento' : category;
        return new_category;
    };

    var appendIframe = function(parameters){
        //console.log(JSON.stringify(parameters));
        var div = document.createElement('div');
        var iframe_id = "sambaads_" + cw.sambaads.players.length;
        var iframe_url = "";
        var width_height = "";

        parameters.m = parameters.m || parameters.mid || "";
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
            iframe_url = iframe_url +
                "m=" + parameters.m +
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
                "&rfr=" + parameters.rfr
        } else {
            iframe_url = iframe_url +
            "c=" + parameters.c +
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
            "&rfr=" + parameters.rfr
        }

        if(parameters.w){
            width_height = "width=\"" + parameters.w + "\" ";
        }

        if(parameters.h){
            width_height = width_height + "height=\"" + parameters.h + "\" ";
        }

        //generate iframe embed
        if(parameters.m || parameters.c || parameters.t){
            div.innerHTML = "<iframe id=\"" + iframe_id + "\" " + width_height + "src=\"" + iframe_url + "\" frameborder=\"0\" scrolling=\"no\"  webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>";
        } else {
            div.innerHTML = "<div id='sambaads_now_whatch_div' class='sambaads_now_whatch_div'><div style='margin-bottom: 10px;text-align: -webkit-left; text-align: left;'><h3 id='sambaads-now-whatch' class='sambaads-now-whatch' style='margin: .5em 5px; text-align: left; display: inline-block;'>Assista Agora</h3><span id='sambaads_now_whatch_title_" + iframe_id + "' class='sambaads_now_whatch_title' style='font-family: verdana, arial, sans-serif; color:#126cb0;font-size:1.1em; font-weight: bold;'></span></div><iframe id=\"" + iframe_id + "\" " + width_height + "src=\"" + iframe_url + "\" frameborder=\"0\" scrolling=\"no\"  webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe><div style='width: 640;height: 30px;'><p style='font-size: 11px; margin: 0px; color: #B0B0B0; text-align: right; font-family: Helvetica, Arial, sans-serif;'>powered by <a href='//www.sambaads.com.br/?utm_campaign=Recomendador&amp;utm_medium=Powered&amp;utm_source=PlayerRecomendador'><img src='//d366amxgkdfvcq.cloudfront.net/images/sambaads-logo.png' style='vertical-align:middle; width:100px !important; height: 24px !important'> </a></p></div></div>";
        }

        //Put iframe after de <script> tag
        insertAfter(currentScript, div.firstChild);

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
            doPlay:function(){

                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::play::");
                    this.contentWindow().postMessage( this.id + "::play::", this.iframe_target_host )
                }

            },
            setVisible:function(data){

                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::play::");
                    this.contentWindow().postMessage( this.id + "::visible::" + data, this.iframe_target_host )
                }

            },
            setMute:function(data){

                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::play::");
                    this.contentWindow().postMessage( this.id + "::mute::" + data, this.iframe_target_host )
                }

            },
            doPause:function(){
                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::pause::");
                    this.contentWindow().postMessage( this.id + "::pause::", this.iframe_target_host )
                }
            },
            seek:function(seek_position){
                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::pause::");
                    this.contentWindow().postMessage( this.id + "::seek::"+seek_position, this.iframe_target_host )
                }
            },
            debug:function(){
                if(this.contentWindow().postMessage){
                    //console.log("CORE SEND:" + this.id + "::pause::");
                    this.contentWindow().postMessage( this.id + "::debug::", this.iframe_target_host )
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
        if(event.origin.indexOf("cloudfront") >= 0 || event.origin.indexOf('/* @echo CDN_PLAYER_DOMAIN */') >= 0){

            var params = event.data.split("::");

            if (params[1] == "onSetupError" ){
                if(document.getElementById("sambaads_now_whatch_div") ){
                    document.getElementById("sambaads_0").remove();
                    document.getElementById("sambaads_now_whatch_div").remove();
                }
            }

            if(params[0] == currentIframe.id){
                //console.log("CORE RECEIVED:" + event.data)

                if (params[1] == "ready" ){
                    clearInterval(currentIframe.isReady);
                    currentIframe.isReady = true;
                    currentIframe.player_width = params[2].split(",")[1];
                    currentIframe.player_height = params[2].split(",")[2] - 4; //- 4 pixels ajust
                    initializePluginsAfeterReady();
                }

                if (params[1] == "onStateChange" ){
                    currentIframe.state = params[2];
                }

                if (params[1] == "loadExpandedCinema" ){
                    var player = cw.sambaads.getPlayer(params[0]);
                    cw.sambaads.expandedCinema.load(params[2], player.player_width, player.player_height, player.id);
                }

                if (params[1] == "removeExpandedCinema" ){
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
            cw.addEventListener("message", onMessageReceive, false)
        } else {
            attachEvent("onmessage", onMessageReceive)
        };

        iframeData.isReady = setInterval(function(){
            iframeData.sendMessage("ready","")
        },2000)
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

    documentReady("docReady", this);
    docReady(init,this);
})(this);
