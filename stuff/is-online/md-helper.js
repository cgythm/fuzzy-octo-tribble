$(function () {
    var markDowns = $(".markdown");

    if ("marked" in window) {

        function createRequest(elm, requestURL) {
            var fn404, $elm = $(elm);

            fn404 = function (error) {
                $elm.html("<p>Error "+error.status+", " +error.statusText+": "+ requestURL + "</p>")
            }

            $.ajax(requestURL, {
                statusCode: {
                    404: fn404,
                    500: fn404,
                }
            }).done(function (data) {
                $elm.html(marked(data));
            });
        }

        markDowns.each(function (n, e) {
            var $elm = $(this),
                mdsrc = $elm.data("markdown");

            if (mdsrc !== void 0) {
                createRequest($elm, mdsrc);
                console.log("requesting " + mdsrc);
            }

        });
    } else {
        throw "marked.js not included? cant find window.marked";
    }

});