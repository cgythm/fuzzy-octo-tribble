(function () {
    var addClass, removeClass, online, offline, lon = [],
        lof = [],
        lc = [],
        luc = [],
        target_elm = null,
        status = null,
        cached = null;

    function test() {
        //the idea is that we aren't refering to the object
        //once we leave this scope.
        return 'classList' in document.createElement('a');
    }

    function run(obj) {
        var len = obj.length,
            i, cb;
        if (len >= 1) {
            for (i = 0; i < len; i++) {
                cb = obj[i];
                cb();
            }
        }
    }

    function ion(v) {
        return (v ? 'online' : 'offline')
    }

    function init() {
        target_elm = document.documentElement;
        if (status === null || typeof status != "boolean") {
            status = navigator.onLine;
            console.debug("init: navigator.onLine in use");
        }
        console.debug("offline.init() executing with " + ion(navigator.onLine));
        update(status);
    }

    function update(isOnline, fromCache) {
        //fromCache = (typeof fromCache != "boolean") ? false : fromCache;
        status = isOnline;

        if (isOnline !== null && typeof isOnline == "boolean") {
            if (isOnline) {
                //it's online
                if (target_elm !== null) {
                    addClass(target_elm, "online");
                    removeClass(target_elm, "offline");
                }
                run(lon);

                console.log("we are online");
            } else {
                //it's offline
                if (target_elm !== null) {
                    addClass(target_elm, "offline");
                    removeClass(target_elm, "online");
                }

                run(lof);

                console.log("we are offline");
            }
        }

        if (fromCache !== null && typeof fromCache == "boolean") {
            if (fromCache) {
                if (target_elm !== null) {
                    addClass(target_elm, "cached");
                    removeClass(target_elm, "not-cached");
                }
                run(lc);
            } else {
                if (target_elm !== null) {
                    addClass(target_elm, "not-cached");
                    removeClass(target_elm, "cached");
                }
                run(luc);
            }
        }
    }

    //checks if dom.classList is supported, otherwise fall back onto jQuery
    if (test()) {
        addClass = function (dom, classname) {
            dom.classList.add(classname);
        };

        removeClass = function (dom, classname) {
            dom.classList.remove(classname);
        };
    } else {
        //revert to using jquery
        if (window.jQuery) {
            addClass = function (dom, classname) {
                $(dom).addClass(classname);
            };

            removeClass = function (dom, classname) {
                $(dom).removeClass(classname);
            };
        } else {
            //do a throw stating jquery doesn't exist
            throw "jQuery is needed";
        }
    }

    document.addEventListener('DOMContentLoaded', function (e) {
        var ac;
        if ('applicationCache' in window) {
            ac = window.applicationCache;
            console.log("application cache is supported");
            window.applicationCache.addEventListener('error', function (e) {
                console.log("application cache error has been triggered");
                update(false, true);
            }, false);

            if('status' in window.applicationCache){
                console.log("cache status = " + ac.status);
            }
        }

        init();
    });

    if ('ononline' in window) {
        console.log("ononline is supported");
        window.addEventListener('online', function (e) {
            console.log("online has been triggered");
            update(true);
        }, false);
    }

    if ('onoffline' in window) {
        console.log("onoffline is supported");
        window.addEventListener('offline', function (e) {
            console.log("offline has been triggered");
            update(false);
        }, false);
    }

    if ((window.oxline === void 0 || window.oxline === null) && !('oxline' in window)) {
        window.oxline = {
            listen: function (on, cb) {
                switch (on) {
                case "online":
                    lon.push(cb);
                    break;
                case "offline":
                    lof.push(cb);
                    break;
                case "cached":
                    lc.push(cb);
                    break;
                case "uncached":
                    luc.push(cb);
                    break;
                }
            },
            online: function () {
                return status;
            }
        }
    }


}).call(this);
