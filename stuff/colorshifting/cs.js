(function () {

    var pageVisibilityAPI = (function () {
        var vc, vcname, hidden, hname;

        //resolve the appropriate prefix to find pageVisibility api
        if (typeof document.hidden !== "undefined") {
            hname = "hidden";
            vcname = "visibilitychange";
        }else if (typeof document.mozHidden !== "undefined") {
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
            hidden = function () {return false;}
            vc = function (cb) {};
        } else {
            hidden = function(){
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
                paused = cbd;
            }
        };


        pageVisibilityAPI.visibilityChange(function (s, e) {
            if (!s && paused != null) {
                paused();
                paused = null;
            }
        });

        fk = function () {
            var args;

            args = combineargs(unpause, arguments);
            cb.apply(cb, args);
        }

        return fk;

    }

    function start() {
        var $change = $("article#cont"), cnt = null, rollcount = 0;


        setTimeout(next([1, 2, 3, 4], pauser(function (unpause, v, self) {
            rollcount += 1;
            $change.text(v + ", with roll = " + rollcount);

            /*if(cnt == null){
             cnt = function(){
             setTimeout(self, 1000);
             });
             }

             pause(cnt);*/
            console.log("ok " + rollcount + " with " + v);
            unpause(function () {
                setTimeout(self, 2000);
            });

        })));
    }

    $(document).ready(function () {

    });

    $(window).load(function () {
        start();
    });


}).call(this);