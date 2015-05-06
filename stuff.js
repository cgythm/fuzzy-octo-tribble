(function () {
    function makeElm($more, data, url) {
        var nn = $('<li>'), s = new Date(Date.now()) + "", b = s.indexOf('GMT'), d, link;
        console.log('url ' + url);
        if (data !== null && data !== void 0) {

            //make a link if we are provided with a URL
            if (url !== null && url !== void 0) {
                link = $('<a>');
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

    function makePerInvoke($more) {
        return function (data, url) {
            return makeElm($more, data, url);
        };
    }

    $(document).ready(function () {

        var breadcrumbs = (function(){
            //because this is executed and initiated here, we need to do this
        }).call(this);

        var more = $('.more'), mk = makePerInvoke(more);

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
        })

    });
}).call(this);