(function(){

    function information(name, fnp){

        return function(){
            var ret;
            ret = fnp.apply(this, arguments);
            if(ret !== null){
                console.log(name + ": switched to " + ret);
            }
        }
    }

    var o = {
        /**
         *
         * @param style_a
         * @param style_b
         * @param rate
         * @param name
         * @returns {*}
         */
        styleToggler: function(style_a, style_b, rate, name){
            var fnp, indx, first = true;
            rate = rate || 150;

            if(style_b != null && style_b.length <= 0){
                fnp = function(e){
                    var elm = $(this), active;
                    if(elm.hasClass(style_a)){
                        elm.removeClass(style_a);
                        active = "none";
                    }else{
                        elm.addClass(style_a);
                        active = style_a;
                    }
                    return active;
                };
            }else{
                if(style_b instanceof Array){

                    //find the index of style_a in the array
                    indx = style_b.indexOf(style_a);

                    //if index cannot be found, it means it doesn't exist in the array,
                    //so we append it, hopefully to the top
                    if(indx == -1){
                        style_b.unshift(style_a);
                        indx = 0;
                    }

                    //now define a special function that iterates around the styles
                    fnp = function(e){
                        var prev, next, elm = $(this), active;
                        if(first){
                            first = false;
                            prev = style_b[indx];
                            elm.addClass(prev);
                            active = prev;
                        }else{
                            prev = style_b[indx];
                            indx = (indx+1)%style_b.length;
                            next = style_b[indx];
                            elm.removeClass(prev).addClass(next);
                            active = next;
                        }
                        return active;
                    };

                }else{
                    fnp = function(e){
                        var elm = $(this), active;
                        if(elm.hasClass(style_a)){
                            elm.removeClass(style_a).addClass(style_b);
                            active = style_b;
                        }else{
                            elm.removeClass(style_b).addClass(style_a);
                            active = style_a;
                        }
                        return active;
                    };
                }
            }

            if(name != null){
                fnp = information(name, fnp);
            }

            return _.debounce(_.throttle(fnp, rate), rate);
        },
        elmBinder: function(element, fnp){
            if('bind' in Function){
                return fnp.bind(element);
            }else{
                //using our own bind method
                return function(){
                    return fnp.apply(element, arguments);
                };
            }
        }
    };

    if(window != null && !('ab' in window)){
        window.ab = o;
    }else{
        return o;
    }
}).call(this);
