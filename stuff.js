(function () {

    function makeElm($more, data, url) {
        var nn = $('<li>'), s = new Date(Date.now()) + "", b = s.indexOf('GMT'), d, link;
        if (data !== null && data !== void 0) {

            //make a link if we are provided with a URL
            if (url !== null && url !== void 0) {
                link = $('<a class="proj">');
                link.attr('href', url);
                link.text(data);
                link.appendTo(nn);
            } else {
                d = data
                nn.text(d);
            }
        } else {
            if (b !== -1) {
                d = s.substr(0, b);
            } else {
                d = s;
            }
            nn.text(d);
        }
        nn.insertBefore($more);
        return nn;
    }

    function makePI($more) {
        return function (data, url) {
            return makeElm($more, data, url);
        };
    }

    $(document).ready(function () {
        var breadcrumbs, switch_to;

        switch_to = (function () {
            var from = null;
            return function (to) {
                if (from === null) {
                    to.addClass('active')
                } else if (from.get(0) == to.get(0)) {
                    return;
                }
                else {
                    from.removeClass('active');
                    to.addClass('active');
                }
                from = to;
            };
        }).call(this);

        breadcrumbs = (function (initcb) {
            //because this is executed and initiated here, we need to do this
            var state, hash, wlocation = window.location,
                initState, lookup = {}, retobj,
                hashChanger, old_hash;

            //helper functions
            function hashExtract(hash) {
                if (hash.length >= 1 && hash.charAt(0) === "#") {
                    return hash.substr(1);
                } else {
                    return null;
                }
            }

            function invoke(hash, e) {
                var o, cb, x;
                if (hash.length >= 1) {
                    //we have a valid hash, so let's just do our thing
                    if (lookup.hasOwnProperty(hash)) {
                        o = lookup[hash];
                        for (x = 0; x < o.length; x++) {
                            cb = o[x];
                            cb(e);
                        }
                    }
                }
            }

            //listen to a hash change event, plus history change event
            if ('onhashchange' in window.document.body) {
                retobj = {
                    to: function (xhash) {
                        //console.log("breadcrumbs:to(" + xhash + ")");
                        if (wlocation !== void 0) {
                            wlocation.hash = xhash;
                        }
                    },

                    on: function (xhash, fb) {
                        if (!lookup.hasOwnProperty(xhash)) {
                            lookup[xhash] = [fb];
                        } else {
                            lookup[xhash].push(fb);
                        }
                        return this;
                    },

                    force_set: function(hash){
                        wlocation.hash = hash;
                        hashChanger(hash);
                    },

                    wloc: wlocation

                };

                old_hash = null;
                hashChanger = function(newHash, e){
                    if(old_hash !== newHash){
                        invoke(newHash, e);
                        old_hash = newHash;
                        return true;
                    }
                    return false;
                }

                if (window.addEventListener) {
                    window.addEventListener('hashchange', function (e) {
                        var hash, o, x, cb;
                        //console.log(e.newURL + " is the new URL and " + e.oldURL + " is the old URL, new hash = " + wlocation.hash);
                        hash = hashExtract(wlocation.hash);

                        hashChanger(hash, e);

                        e.preventDefault();
                        e.stopPropagation();
                    });
                }

                //perform our init state, and our init state is dependent on whether hashchange event is supported.
                //this dependency is enforced through the conditional branch where if the hashchange event isn't support,
                //our code doesn't execute our init state
                if (wlocation !== void 0) {
                    hash = hashExtract(wlocation.hash);
                    initState = hash;
                    setTimeout(function(){
                        initcb(initState, retobj);
                    });
                }
            }


            return retobj

        }).call(this, function (initState, self) {
                //immediate mock
                var about, junk, about_firstclick, total_change;


                about = $('a.about');
                junk = $('a.junk');


                about.click(function (e) {
                    e.preventDefault();
                    self.to("about");
                    e.preventDefault();
                });

                junk.click(function (e) {
                    e.preventDefault();
                    self.to("junk");
                    e.preventDefault();
                });

                //console.log("Our initiate State is '" + initState + "'");

                self.on('junk', function (e) {
                    about.removeClass('active').addClass('inactive');
                    junk.removeClass('inactive').addClass('active');
                    switch_to($('article#junk'));
                    if(e != null){
                        e.preventDefault();
                    }
                });

                self.on('about', function (e) {
                    junk.removeClass('active').addClass('inactive');
                    about.removeClass('inactive').addClass('active');
                    switch_to($('article#about'));
                    if(e != null){
                        e.preventDefault();
                    }
                });

                if (initState === null) {
                    initState = "about";
                    self.to(initState);
                }else if(initState === "junk") {
                    //if the hash matches, it won't initiate a change
                    //when we ask it to change. so we need to force an invocation
                    self.force_set('junk');
                } else if (initState === "about") {
                    self.force_set("about");
                }

                window.hs = self;
            });


        var more = $('.more'), mk = makePI(more);
        $.getJSON("/projects.json", function (data) {
            var i, projects;

            if (data !== void 0 && data.projects !== void 0) {
                projects = data.projects;
                i = projects.length;
                if (i >= 1) {
                    for (var k = 0; k < i; k++) {
                        mk(projects[k]['title'], projects[k]['dir']);
                    }
                }
            }
        });

        //this function does async loading of the about content
        (function () {
            var about_pane = $('article#about');
            $.get('/stuff/about/about.html', function (data) {
                var content = [
                    '<div class="inner">',
                    data,
                    '</div>'
                ].join("");
                about_pane.append(content);
            });
        }).call(this);


    });
}).call(this);
