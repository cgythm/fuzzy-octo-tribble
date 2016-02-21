(function ($) {
    function defered_m() {

    }


    function Observable{

    }


    var os = new Observable();
    var crap_state = false;

    $('crap').click(function(e){
        //everything within here is what we are doing to create this
        //thing that we can present (via our observable).

        /*
        * from the Conal Elliott composing animation article, which he discusses reactive functional programing:
        * 1. the difficulty in making computer graphics accessible is that one gets bogged down in the details of
        * how to present that what that graphic/feature/shape is. how is imperative, describing how to make something
        * and those details gets in the way of what it is. the work in graphics programing, traditionally, had
        * them spend much of their effort in bridging what the graphic is and how to present it on a computer.
        *
        * this is also true for the idea of 'crap'. we want to hide the 'how' of it, which is within this function so
        * that we interface with the 'what' of it.
        * */
        crap_state = !crap_state;
        os.broadcast([$(this).data('name'), $(this).data('targets'), crap_state]);
    });


    function widget_addcart(){
        //it doesn't add to the cart. it does everything up until
        //it adds to the cart. it present something to some other function that
        //can then add it to the cart. this widget takes care of the low level of details
        //to crea what this thing should be. a cart could listen to the widget for what it is,
        //an 'add to cart' event.
    }
})(jQuery);
