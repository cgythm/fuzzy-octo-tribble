(function () {

    /**
     *
     * @param prefix
     * @param start
     * @param end
     * @returns {Array}
     */
    function makelist(prefix, start, end) {
        var len = end - start, l = [], i;

        for (i = 0; i <= len; i++) {
            l.push(prefix + (start + i));
        }

        return l;
    }

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


    /**
     * next chooses what's next.
     * @param list list of things to choose from
     * @param cb the callback that gets invoked when next has chosen something
     * @returns {Function}
     */
    function next(list, cb) {
        var pstate, nn;

        function choose() {
            var len = list.length, ran = Math.floor(Math.random() * len);
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

    /**
     *
     * @param cb
     * @param hidden
     * @param onChange
     * @returns {Function}
     */
    function pauseable(cb, hidden, onChange) {
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
            var h = !hidden();

            if (h) {
                //if we aren't paused, invoke the function
                cbd();
            } else {
                //if we are paused, do not invoke the function, rather
                //let its invocation happen when we get unpaused.
                continued = cbd;
                //console.log("we take a pause");
            }
        };


        if(onChange !== void 0 && onChange instanceof Function){
            onChange(function (s, e) {
                if (!s && continued != null) {
                    continued();
                    continued = null;
                }
            });
        }

        fk = function () {
            var args;

            args = combineargs(unpause, arguments);
            cb.apply(cb, args);
        }

        return fk;

    }

    /**
     * pauser
     * @param s the initial state
     * @returns {{set: Function, isHidden: Function, onChange: Function}}
     */
    function pauser (s){
        var state, whatState, change, listen, set, eq = [];
        state = s == void 0?false:(typeof s === 'boolean'?s:false);

        set = function(s){
            if(s !== state){
                state = s;
                change()
                return state;
            }
        };

        whatState = function(){
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
            isHidden: whatState,
            onChange: listen
        };
    }


    /**
     * toggle widget
     * @param $elm jQuery resolved element
     * @param s1 callback function executed on first state
     * @param s2 callback functon executed on second state
     * @param bounce the time in milliseconds that limit transistion
     */
    function toggle($elm, s1, s2, bounce) {
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
        var $console = $("span#console"),
            $toggle = $("a#toggle"),
            cnt = null,
            rollcount = 0,
            $bg = $('body'),
            previouscolor = null,
            colors = makelist('a-', 1, 30), //generates our list of strings with the prefix 'a-'
            pause_boss = pauser(),
            button_state; //pause_boss is what controls the pausing

        //pausing logic influenced by the pageVisiblity state change
        pageVisibilityAPI.visibilityChange(function(hidden, e){
            if(hidden){
                //our page is hidden. so to be nice, we should pause the animation.
                pause_boss.set(true);
            }else{
                if(button_state === false || button_state === null){
                    pause_boss.set(false);
                }
            }
        });

        //the pausing logic as influenced the button is fairly simple
        //pause if we are reporting that we will pause, and unpause
        //when we are reporting if we wil unpause.
        toggle($toggle, function ($e, s) {
            $e.text("stop");
            pause_boss.set(false);
            button_state = false;
        }, function ($e, s) {
            $e.text("start");
            pause_boss.set(true);
            button_state = true;
        });


        var so;
        setTimeout(next(colors, pauseable(function (unpause, v, self) {
            rollcount += 1;
            $bg.addClass(v)
            if (previouscolor) {
                $bg.removeClass(previouscolor);
            }
            previouscolor = v;

            //so = v + ", with roll = " + rollcount;
            $console.text(v + ", with roll = " + rollcount);
            //console.log(so+ " with pause state = " + (pause_boss.isHidden()?'paused':'unpaused'));


            //when we invoke unpause, we are asking unpause to execute
            //bock when it isn't paused.
            //so depending on the conditions as to whether we are in a paused state
            //or not, unpause will execute the follwing code whenever it becomes unpaused
            unpause(function () {
                //self is our continuation
                //we invoke self whenever timeout calls us back.
                setTimeout(self, 1000);
            });

        }, pause_boss.isHidden, pause_boss.onChange)));
    }

    $(document).ready(function () {

    });

    $(window).load(function () {
        start();
    });


}).call(this);