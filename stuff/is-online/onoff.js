(function(){

    function viewing(view){
        if(view === "about"){

        }else if(view === "onoff"){

        }else if(view === "back"){

        }
    }

    function lochash(str){
        if(str.charAt(0) === '#' && str.length >= 2){
            str = str.substr(1);
        }else{
            str = "";
        }
        console.log("hash got " + str);
        return str;
    }

    function togglegrouper(trans){
        var toggle, pState = null;

        toggle = function(state){
            if(pState !== state){
                trans(state, pState);
                pState = state;
                return true;
            }
            return false;
        };

        return function makebutton(state, cb){
            var exec = function(){
                if(toggle(state)){
                    cb();
                }
            };

            return exec;
        };
    };

    function viewTo(viewname){
        return function(){
            viewing(viewname);
        };
    }

    function toggler(tg, $elm, cb){
        var exec = tg($elm, cb);
        $elm.click(function(e){
            exec();
            e.preventDefault();
            e.stopPropagation();
        });
        return exec;
    }


    $(document).ready(function(){
        var $lback, $lonoff, $labout,
            initHash = lochash(location.hash),
            togglegroup = togglegrouper(function transition(to, from){
                to = $(to);
                from = $(from);
                to.removeClass("inactive").addClass("active");
                from.removeClass("active").addClass("inactive");
            });

        $lback = toggler(togglegroup, $("a#lback"), viewTo("back"));
        $lonoff = toggler(togglegroup, $("a#lonoff"), viewTo("onoff"));
        $labout = toggler(togglegroup, $("a#labout"), viewTo("about"));

        //setting inital state
        if(initHash === "about"){
            $labout();
        }else if(initHash === "onoff" || initHash === ""){
            $lonoff();
        }
    });

    $(window).load(function(){

    });

    /**
     * todo: use the togglegroup to create a way to toggle between views
     * toggle group is a function that does a swap operation where it swaps
     * state and invokes a transform function based on a pair of current
     * and previous states
     *
     * a viewing transform would take those two states (data) and the
     * current one being switched to would be the active view where-as
     * the previous one would be an inactive view.
     */

}).call(this);
