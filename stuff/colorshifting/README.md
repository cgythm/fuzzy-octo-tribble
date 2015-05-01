### Sporadic Color Shifting

Besides simple technique of using css transistions to change the background color,
I tried to add some functional flair to it.

This little bit of code was my attempt working with continuation style passing.

        setTimeout(next(colors, pauseable(function (unpause, v, self) {
            rollcount += 1;
            $bg.addClass(v)
            if (previouscolor) {
                $bg.removeClass(previouscolor);
            }
            previouscolor = v;

            $console.text(v + ", with roll = " + rollcount);


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