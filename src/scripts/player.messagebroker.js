var SambaAdsPlayerMessageBroker = function(){
	// do we have an existing instance?
    if (typeof SambaAdsPlayerMessageBroker.instance === 'object') {
        return SambaAdsPlayerMessageBroker.instance;
    }

    this.CustomEvent = function ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;

    SambaAdsPlayerMessageBroker.instance = this;

    this.getInstance = function(){
    	return this.instance;
    }

    this.send = function(event_id, data){
    	var evt = {
    		id: event_id,
    		data: data
    	}
        
        this.dispatchEvent(new CustomEvent(event_id, {detail:evt}));
    };

    return this;
};
