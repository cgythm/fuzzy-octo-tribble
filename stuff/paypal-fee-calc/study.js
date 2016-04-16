(function(scope){



    //link list node
    function study(){
        this.next = null;
        this.prev = null;
        this.set = null;

        this.cb_pre = null;
        this.cb_active = null;
        this.cb_end = null;
    }

    study.prototype = {
        pre: function(e, last){
            if(this.cb_pre !== null){
                this.cb_pre(e, last);
            }
        },

        active: function(e){
            if(this.cb_active !== null){
                this.cb_active(e);
            }
        },

        end: function(e, n){
            if(this.cb_end !== null){
                this.cb_end(e, ne)
            }
        },

        on: function(name, cb){
            if(name == 'pre'){
                this.cb_pre = cb;
            }else if(name == 'active'){
                this.cb_active = cb;
            }else if(name == 'end'){
                this.cb_end = cb;
            }
        }


    };


    function studies(){
        this.head = null;
        this.tail = null;
    }

    studies.prototype = {

    };


    function lsProvider(){
        if('localStorage' in window){
            this.obj = {};
            this.ls = window['localStorage'];
        }
    }

    lsProvider.prototype = {
        read: function(key){
            var a;
            if(this.obj){
                if(this.obj.hasOwnProperty(key)){
                    return this.obj[key];
                }else{
                    //it doesn't eist, so we gotta look it up.
                    a = this.ls.getItem(key);
                    if(a !== null){
                        //it eist, parse its json
                        this.obj[key] = JSON.parse(a)
                        return this.obj[key];
                    }
                    return null
                }
            }
        },

        write: function(key, value){
            if(this.obj){
                if(this.obj.hasOwnProperty(key)){
                    this.obj[key] = value;
                    this.ls.setItem(key, JSON.stringify(this.obj[key]));
                }else{

                }
            }
        }
    };

    function fb(){

    };

    fb.prototype = {
        bind: function($elm, active_style){},
        listen: function(elm){

        }
    };

    function test_case(){
        var s = new fb();

        //i am trying to work on this pule of apis

        s.bind($(window), key('m'), swap($rootElm, 'hotdogs'));
        s.bind($(window), key('k'), swap($rootElm, 'cokes'));

        s.listen($(window)).key('m').swap($rootElm, 'cokes');


        var keys = ['a', 'b', 'c', 'd'];
        var listen, rt, i;
        for(i = 0; i < keys.length; i++){

        }
    }

    if(!scope.hasOwnProperty('study')){

    }else{

    }

}).call(this);
