(function(){
    var cachedState = {}

    //todo: should do typechecking and handle it properly?!
    if("amicached" in this){
        cacheState = this.iamcached;
    }else{
        this['amicached'] = cachedState;
    }

    cachedState.cached = true;

}).call(this);
