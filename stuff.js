(function(){
    function makeElm($more, data){
        var nn = $('<li>'), s = new Date(Date.now()) + "", b = s.indexOf('GMT'), d;
        if(data !== null && data !== void 0){
            d = data
        }else{
            if(b !== -1){
                d = s.substr(0, b);
            }else{
                d = s;
            }
        }
        nn.text(d);
        nn.insertBefore($more);
        return nn;
    }

    function makePerInvoke($more){
        return function($data){
            return makeElm($more, $data);
        };
    }
    $(document).ready(function(){
       var more = $('.more'), mk = makePerInvoke(more);
        for(var i = 0; i < 10; i++){
            mk();
        }
        more.click(function(e){
            mk();
            e.preventDefault;
        });

        $.getJSON("/projects.json", function(data){
            var i = data.length;
            if(i >= 1){
                for(var k = 0; k < i; k++){
                    mk(data[k]['title']);
                }
            }
        })

    });
}).call(this);