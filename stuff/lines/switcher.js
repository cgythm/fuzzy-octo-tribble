$(function(){
    function dismissModal(elm){
        elm.removeClass("show");
    }
    function showModal(elm, message, delay){
        var $elm = $(elm);
        elm.addClass("show");
        elm.text(message);
        setTimeout(function(){
            dismissModal(elm);
        }, delay);
    }



    var $modal = $('.modal');
    $modal.click(function(){dismissModal($modal)});
    $('body').click(function(){dismissModal($modal)});
    setTimeout(function(){
        showModal($modal, "press keys 1 to 0 to switch", 1000 * 5);
    }, 9000);
});
