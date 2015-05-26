### Sporadic Color Shifting

Besides employing a really simple technique of using css transistions to change the background color,
I add some functional flair to it to this little exploration to make it a bit more interesting.

This little bit of code was my attempt in working with continuation style passing.

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
            //block when it isn't paused.
            //so depending on the conditions as to whether we are in a paused state
            //or not, unpause will execute the follwing code whenever it becomes unpaused
            unpause(function () {
                //self is our continuation
                //we invoke self whenever timeout calls us back.
                setTimeout(self, 1000);
            });

       }, pause_boss.isHidden, pause_boss.onChange)));