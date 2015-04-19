### Sporadic Color Shifting

Besides what it does, which is just simply change the background color, this little bit of code was my attempt at
working with continuation style passing.

    function start() {
        var $change = $("article#cont"), cnt = null, rollcount = 0;


        setTimeout(next([1, 2, 3, 4], pauser(function (unpause, v, self) {
            rollcount += 1;
            $change.text(v + ", with roll = " + rollcount);
            
            //the continuation
            unpause(function () {
                setTimeout(self, 2000);
            });

        })));
    }
