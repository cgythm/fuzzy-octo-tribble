### Sporadic Color Shifting

Besides simple technique of using css transistions to change the background color,
I tried to add some functional flair to it.

This little bit of code was my attempt working with continuation style passing.

        setTimeout(next(colors, pauser(function (unpause, v, self) {
            rollcount += 1;
            $bg.addClass(v)
            if(previouscolor){
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
