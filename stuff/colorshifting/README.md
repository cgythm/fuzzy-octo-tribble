### Sporadic Color Shifting

Besides simple the background color changes, this little bit of code was my attempt in
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
