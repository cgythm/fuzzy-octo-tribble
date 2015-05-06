var strproces = (function(){
    function inputprocessor(str){
        if(str.length >= 1 && str.charAt(0) === "#"){
            return str.split("-");
        }
        return null;
    }

    //format: intro-arg1-arg2-arg3
    inputprocessor("#options-1234-seg-543d");
}).call(this);

var historyAPI = (function(){

}).call(this);

(function(){
    var app = (function(){
        return {
            init: function(){

            },
            start: function(){

            },

            run: function(){

            }
        }
    }).call(this);


    $(document).ready(function(){app.start()});
    $(load).ready(function(){app.init()});

}).call(this);
