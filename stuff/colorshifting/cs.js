(function () {

    var pageVisibilityAPI = (function () {
        var vc, vcname, hidden, hname;

        //resolve the appropriate prefix to find pageVisibility api
        if (typeof document.hidden !== "undefined") {
            hname = "hidden";
            vcname = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
            hname = "mozHidden";
            vcname = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hname = "msHidden";
            vcname = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hname = "webkitHidden";
            vcname = "webkitvisibilitychange";
        } else {
            hname = null;
            vcname = null;
        }

        if (hname == null) {
            hidden = function () {
                return false;
            }
            vc = function (cb) {
            };
        } else {
            hidden = function () {
                return document[hname];
            };

            vc = function (callback) {
                document.addEventListener(vcname, function (e) {
                    callback(hidden(), e);
                }, false);
            };
        }

        return {
            hidden: hidden,
            visibilityChange: vc,
        }
    }).call(this);


    function next(list, cb) {
        var pstate, nn;

        function choose() {
            var len = list.length, ran = Math.floor(Math.random() * len);
            // console.log("rolled " + ran + " [" + list[ran] + "]");
            return list[ran];
        }

        nn = function () {
            var nroll = 0, max = 2;
            nroll = choose();
            if (pstate == nroll) {
                //reroll
                while (pstate == nroll) {
                    nroll = choose();
                    if (max < 0) {
                        break;
                    }
                }
            }

            pstate = nroll;
            return cb(nroll, nn);
        };
        return nn;
    }


    function pauser(cb) {
        var fk, unpause, paused = null, continued;

        function combineargs(args, rest) {
            var nb, i, rl = rest.length;
            if (args instanceof Array) {
                nb = args;
            } else {
                nb = []
                nb.push(args);
            }
            for (i = 0; i < rl; i++) {
                nb.push(rest[i]);
            }
            return nb;
        }

        unpause = function (cbd) {
            //
            var h = !pageVisibilityAPI.hidden();

            if (h) {
                //if we aren't paused, invoke the function
                cbd();
            } else {
                //if we are paused, do not invoke the function, rather
                //let its invocation happen when we get unpaused.
                continued = cbd;
                console.log("we take a pause");
            }
        };


        pageVisibilityAPI.visibilityChange(function (s, e) {
            if (!s && continued != null) {
                continued();
                continued = null;
            }
        });

        fk = function () {
            var args;

            args = combineargs(unpause, arguments);
            cb.apply(cb, args);
        }

        return fk;

    }

    var pauseState = function (s){
        var state, hidden, change, listen, set, eq = [];
        state = s == void 0?false:(typeof s === 'boolean'?s:false);

        set = function(s){
            if(s !== state){
                state = s;
                change()
                return state;
            }
        };

        hidden = function(){
            return state;
        };

        listen = function(cb){
            eq.push(cb);
        };

        change = function(){
            var i, l = eq.length, b;
            for(i = 0; i < l; i++){
                b = eq[i];
                if(b instanceof Function){
                    b.call(b, state);
                }
            }
        }

        return {
            set: set,
            isHidden: hidden,
            onChange: listen
        };
    }

    window.ps = pauseState;

    function button($elm, s1, s2, bounce) {
        var fn, state = false, last = Date.now(), now;

        bounce = (bounce == void 0) ? 250 : bounce;

        s1.call($elm, $elm, state);
        state = !state;
        fn = function (e) {
            now = Date.now();
            if ((last + bounce) <= now) {
                if (state) {
                    s2.call($elm, $elm, state);
                } else {
                    s1.call($elm, $elm, state);
                }
                state = !state;
                last = now;
            }
            e.stopPropagation();
            e.preventDefault();
        };

        $elm.click(fn);
    }

    function start() {
        var $console = $("span#console"), $toggle = $("a#toggle"), cnt = null, rollcount = 0, $bg = $('body'), previouscolor = null;

        button($toggle, function ($e, s) {
            $e.text("stop");
        }, function ($e, s) {
            $e.text("start");
        });

        function makelist(prefix, start, end) {
            var len = end - start, l = [], i;

            for (i = 0; i <= len; i++) {
                l.push(prefix + (start + i));
            }

            return l;
        }

        window.colors = makelist('a-', 1, 30);

        setTimeout(next(colors, pauser(function (unpause, v, self) {
            rollcount += 1;
            $bg.addClass(v)
            if (previouscolor) {
                $bg.removeClass(previouscolor);
            }
            previouscolor = v;

            $console.text(v + ", with roll = " + rollcount);

            /*if(cnt == null){
             cnt = function(){
             setTimeout(self, 1000);
             });
             }

             pause(cnt);*/
            unpause(function () {
                setTimeout(self, 1000);
            });

        })));
    }

    $(document).ready(function () {

    });

    $(window).load(function () {
        start();
    });


}).call(this);