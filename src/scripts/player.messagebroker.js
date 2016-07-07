var SambaAdsPlayerMessageBroker = function(){
	// do we have an existing instance?
    if (typeof SambaAdsPlayerMessageBroker.instance === 'object') {
        return SambaAdsPlayerMessageBroker.instance;
    }

    SambaAdsPlayerMessageBroker.instance = this;

    this.getInstance = function(){
    	return this.instance;
    }

    this.send = function(event_id, data){
    	var evt = {
    		id: event_id,
    		data: data
    	}
        console.log(event_id);
        this.dispatchEvent(new CustomEvent(event_id, {detail:evt}));
    };

    return this;
};
