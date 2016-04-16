/*jslint nomen: true, debug: true,
  evil: false, vars: true */

(function () {

    var pModel, app = {};

    function chkok(value) {
        return value !== void 0;
    }


    //determines the paypal take based on the amount
    function paypalfeeRate(amount, rev) {
        return 0.029;
    }

    function ppfr1(amount, rev, rate) {
        rate = (rate == null) ? 1.029 : 1 + rate;
        if (rev) {
            return (amount - 0.3) / (rate);
        } else {
            return ((rate * amount) + 0.3);
        }
    }


    function t(fn, val) {
        var p = ppfr1(val),
            a = val + p;
        return [fn(a), p, val, a];
    }

    function floord(value, d) {
        var x = Math.pow(10, d);
        return Math.floor(x * value) / x;
    }

    window.paypalfee = paypalfeeRate;

    function difference(a, b) {
        var o = {},
            k, val1, val2;

        for (k in a) {
            if (a.hasOwnProperty(k) && b.hasOwnProperty(k)) {
                val1 = a[k];
                val2 = b[k];
                if (val1 != val2) {
                    o[k] = val1;
                }
            }
        }
        return o;
    }



    function updateCalc(change, base, direction) {
        var pfeesub, subtotal, o = {},
            tax;
        direction = direction != null ? direction : false;
        //if the total has changed, treat it as a reverse scheme, where we try to calculate the amount before fees
        //this is determined by checking if the change object (which has all the state changes since last time this was called) has total as being changed, and the amount or pfee hasn't changed

        if (direction) {
            //reverse
            console.log("reverse direction");
        } else {
            //normal
            console.log("normal direction");
        }

        //depending on 'direction, the model's logic changes.
        //when the direction flag is false, the total amount is computed
        //but when the flag is true, the amount before fees is computed.
        //the flag is set by the order of which view is clicked. if the amount before fees input element is focused,
        //the direction flag is set to false and if the taxrate has changed, the taxrate would contribute to the overall
        //total, but if the total input element was focused, any changes to the taxrate would contribute to the amount before
        //fees value.
        if (direction || (chkok(change.total) && !(chkok(change.amount) || chkok(change.pfee)))) {
            console.log("changed the total");

            if (chkok(change.taxrate) && !(chkok(change.total))) {
                //the only difference in the computation within this block
                //and the else block is that change.total is swapped with base.total
                //because in within this branch, the taxrate is the only thing that has changed
                subtotal = ppfr1(base.total, true);


                o.pfee = base.total - subtotal;
                //round it
                o.pfee = floord(o.pfee, 5);
                subtotal = base.total - o.pfee;
                subtotal = floord(subtotal, 5);
                o.tax = subtotal - ((change.taxrate > 0) ? (subtotal / (change.taxrate + 1)) : subtotal);
                o.amount = subtotal - o.tax;
                window.o = o;

                //o = {};
            } else {
                subtotal = ppfr1(change.total, true);
                o.pfee = change.total - subtotal;
                //round it
                o.pfee = floord(o.pfee, 5);
                subtotal = change.total - o.pfee;
                subtotal = floord(subtotal, 5);
                o.tax = subtotal - ((base.taxrate > 0) ? (subtotal / (base.taxrate + 1)) : subtotal);
                o.amount = subtotal - o.tax;
                window.o = o;
            }


        } else {
            if (base.amount == 0.0) {
                o.amount = o.tax = o.pfee = o.total = 0;
            } else {
                o.amount = base.amount;
                o.tax = floord(base.taxrate * o.amount, 5);
                subtotal = o.tax + o.amount;

                //o.pfee = floord(subtotal * paypalfeeRate(subtotal), 5);
                pfeesub = ppfr1(subtotal);
                o.pfee = floord(pfeesub, 5) - subtotal;

                o.total = floord(o.pfee + subtotal, 5);
            }
        }

        //clean up o


        //elminate keys that haven't changed in values by this update, and propagate those changes
        return difference(o, base);
    }

    app.PayPalCalcModel = Backbone.Model.extend({
        defaults: {
            amount: 0.0,
            taxrate: 0.0,
            tax: 0.0, //tax is calculated, it's derived, so we don't utilize set on it
            pfee: 0.0, //paypal fee is calculated, it's the result of the other data. we can't set it directly, it's derived.
            total: 0.0,
            direction: false
        },

        initialize: function () {

            var self = this;

            /*this.on('change', function(event){
             console.log('something has changed');
             });        */

            //it seem to parse the string to find
            //the specific hash and whenever set is
            //called with that hash string as a parameter,
            //this function gets invoked.

            function propagateUpdate(obj) {
                var k;
                for (k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        self.set(k, obj[k]);
                    }
                }
            }

            this.on('change:amount', function (event) {
                //console.log("amount has changed to " + this.get('amount'));
                propagateUpdate(updateCalc(event.changed, this.attributes, this.get("direction")));
            });

            this.on('change:taxrate', function (event) {
                //console.log("taxrate has changed to " + this.get('taxrate'));
                propagateUpdate(updateCalc(event.changed, this.attributes, this.get("direction")));
            });

            this.on('change:total', function (event) {
                //changing the total of the model will recalculate all the values necessary to achieve that total
                //console.log("total has changed " + this.get("total"));
                propagateUpdate(updateCalc(event.changed, this.attributes, this.get("direction")));
            });

            this.on('change:direction', function (event) {
                console.log("direction of computation is " + (event.changed.direction ? "reversed" : "normal"));
            });
        },

        validate: function (attr) {
            if (!(attr.taxrate != null && !isNaN(attr.taxrate) && (attr.taxrate >= 0 && attr.taxrate <= 1))) {
                return "taxrate must be a number between 0.0 and 1.0";
            }

            if (!(attr.amount != null && !isNaN(attr.amount) && (attr.amount >= 0))) {
                return "amount must be a number >= 0";
            }

            if (!(attr.total != null && !isNaN(attr.total) && (attr.total >= 0))) {
                return "total must be a number >= 0";
            }
        }

    });

    //this is basically like 'inheriting' an existing class
    //inheritance is by creating a new object that has the properties of the old
    //where if we can change the old by replacing the function that is bounded to that
    //variable
    /**
     * this is wrong, we don't have a massive view of our model.
     * each view corresponds to a specific element, and that view/element
     * pair observes a specific field within our model.
     * in our, we need views for each field. Each view can correspond to a class
     * and each view can be an instance of a specific class of views. We implement
     * the class,
     * PPCView = Backbone.View.extend({

    });*/


    //each view is linked to an element
    //this view is linked to the clear button element
    app.ClearView = Backbone.View.extend({
        initialize: function (opt) {
            this.opt = opt;
            this.direction = opt._direction;
        },

        events: {
            'click': function (e) {
                console.log('button has been clicked');
                this.model.clear().set(this.model.defaults);
                if (this.direction !== null) {
                    this.model.set("direction", this.direction);
                }
            }
        }
    });

    app.updateRate = 800;
    app.Field = Backbone.View.extend({
        initialize: function (opt) {
            var self = this;
            this.opt = opt;

            //backbone model has events that are triggered
            //when the model changes. this.opt._link points to a string
            //value of the event
            this.model.bind("change:" + this.opt._link, _.bind(this.onModelUpdate, this));

            //boolean value, if it reports true then
            //this value effects the behaviour in updateValue
            this.no_write = this.$el.hasClass('no-write');

            this.directionToggler = this.opt._direction != null;
            if (this.opt._direction != null) {
                this.directionToggler = true;
                this.direction = this.opt._direction
            } else {
                this.directionToggler = false;
            }


            this.fdb = _.debounce(function () {
                return;
            }, app.updateRate);

            this.focus_hold = null;
        },

        sansdec: function (val) {
            var a = Math.floor(val);
            return Math.abs(val - a);
        },

        sanitizedGet: function (val) {
            return val;
        },

        sanitizedSet: function (val, old_val) {
            return val;
        },

        updateView: function (val, el, inc) {
            console.log("update view " + val);
            val = this.sanitizedGet(val, inc);
            el.attr("value", val);
            el.val(val);
        },

        onModelUpdate: function (ev) {
            var val = this.model.get(this.opt._link),
                el = this.$el;
            this.updateView(val, el);
        },

        updateValue: function (ev, value) {
            var sanval, el = this.$el,
                oldval = this.model.get(this.opt._link);
            if (this.no_write) {
                //
                if (el.val() != oldval) {
                    this.updateView(oldval, el);
                }
            } else {
                sanval = this.sanitizedSet(value, oldval);
                if (!isNaN(sanval)) {

                    this.model.set(this.opt._link, sanval);
                    this.$el.removeClass("error");

                    //if an appropriate value is entered, this could indicate the intent the user has as to what they
                    //are trying to do (input a total value, or input amount before fees) which has an effect on how
                    //to process the taxrate value (adjusting taxrate adjusts amount b4 fees, or the total)
                    //console.log("directToggler = " + (this.directionToggler ? "true" : "false") + " direction val = " + (this.direction != null ? (this.direction ? "reverse" : "forward") : "null"));
                    if (this.directionToggler) {
                        this.model.set("direction", this.direction);
                    }

                } else {
                    this.$el.addClass("error");
                }
            }
        },

        genChangeRollCB: function (elm) {
            var self = this,
                cb, c = this.changeRoller,
                x = $(elm);
            cb = function changeRoller() {
                var val;

               // console.log("tick");

                //don't do any updates if we were terminated
                if (c.start != false) {

                    //determine if the value should be updated
                    val = x.val();
                    if (val != c.previousValue) {
                        //invoke the update
                        self.updateValue(c.event, val, true);
                    }

                    c.previousValue = val;
                    this.focus_hold = val;

                    //check time since last update, incase we should terminate this process
                    if ((Date.now() - c.now) >= c.expire) {
                        //terminate this process
                        c.start = false;

                        //kill interval
                        clearInterval(c.intervalHn);
                        console.log("terminating");
                    }

                    c.lastUpdate = c.now;
                } else {
                    clearInterval(c.intervalHn);
                    console.log("terminating");
                }
            };

            return cb;
        },

        changeRoll: function (e, elm) {
            var c, self;
            //monkey punch this value, if it doesn't exist
            if (this.changeRoller === void 0) {
                self = this;
                this.changeRoller = {
                    start: false,
                    lastUpdate: Date.now(),
                    now: Date.now(),
                    rate: 80,
                    expire: 300,
                    event: null,
                    previousValue: null,
                    intervalHn: null,
                    timercb: null, //cant do this.genChangeRollCB(elm) because it refers to changeRoller
                };
                this.changeRoller.timercb = this.genChangeRollCB(elm);
            }

            c = this.changeRoller;


            if (c.start) {
                c.now = Date.now();
                c.event = e;
            } else {
                c.start = true;
                c.event = e;
                c.now = Date.now();
                c.intervalHn = setInterval(c.timercb, c.rate);
                //c.timercb();
               // console.log("Start");
            }
        },

        events: {
            focus: function (e) {
                var self = this;
                console.log("focusing");

                //the reason for storing the value of the input element when focus is entered
                //is so we can test later, (on blur) if the value has changed. If the value has
                //changed when we are exiting focus, we invoke a method to update the model.
                this.focus_hold = this.$el.val();


                setTimeout(function () {
                    //bug: when two focuses occur within the timeout duration, there can be this weird infinite like loop
                    //occurance where the select switches forever between two fields that is caused by selecting (thus focusing)
                    //on a field not selected
                    //fix is:
                    if (!self.blur) {
                        //when focus is triggered, i want the text of the input to be selected so it
                        //can easily be overwritten. this is done through trigger a select event through $().select()
                        //that occurs 50ms after focus enters
                        self.$el.get(0).select();
                    }

                }, 50);

                this.blur = false;

            },



            blur: function (e) {
                var x = this.$el,
                    vl = x.val();

                //if there is a pending update that was triggered by a change event and not yet
                //been applied, we should cancel that update.
                this.changeRoll.start = false;

                if (vl != this.focus_hold && vl != "") {
                    this.updateValue(e, vl);
                } else {
                    this.$el.val(this.focus_hold);
                }


                this.blur = true;
            },

            input: function (e) {
                //console.log("element has been inputted");
            },

            change: function (e) {
                this.changeRoll(e, this.$el);
            }

        }
    });

    app.DollarField = app.Field.extend({
        sanitizedGet: function (val, incremental) {
            if (incremental != null && incremental == true) {
                return val;
            } else {
                if (val == 0) {
                    val = "0.00";
                } else {
                    val = Math.round(Math.pow(10, 2) * val) / Math.pow(10, 2);
                    //console.log("drama "+ (this.sansdec(val * 10) == 0));
                    if (this.sansdec(val) == 0) {
                        val = val + ".00";
                    } else if (this.sansdec(val * 10) == 0) {
                        val = val + "0";
                    }
                }
            }
            return val;
        },

        sanitizedSet: function (val, oldval) {
            return parseFloat(val);
        }
    });



    app.PercentageField = app.Field.extend({
        sanitizedGet: function (val, incremental) {
            if (val == 0) {
                val = "0.00";
            } else {
                val = Math.round(Math.pow(10, 4) * val) / Math.pow(10, 2);
                if (this.sansdec(val) == 0) {
                    val = val + ".00";
                } else if (this.sansdec(val * Math.pow(10, 1)) == 0) {
                    val = val + "0";
                }
            }
            return val;
        },

        sanitizedSet: function (val, oldval) {
            return parseFloat(val) / 100;
        }

        /**
         * on keydown, debounce event for 250ms
         * then check if it is a number.
         * if it is a number, update the model
         * if it isn't a number, do not do anything
         *
         * upon exit/leave, if it isn't a number, reset the value
         */
    });

    app.model = {};
    pModel = new app.PayPalCalcModel();
    app.model.paypal = pModel;
    app.paypalModel = pModel;
    window.pModel = pModel;

    app.views = {};
    app.views.buttonClear = new app.ClearView({
        el: $("#btn"),
        model: app.paypalModel,
        _direction: false
    });
    app.views.amount = new app.DollarField({
        el: $("#beforefees"),
        model: app.paypalModel,
        _link: "amount",
        _direction: false
    });
    app.views.tax = new app.DollarField({
        el: $("#taxes"),
        model: app.paypalModel,
        _link: "tax",
        norw: true
    });
    app.views.pfee = new app.DollarField({
        el: $("#paypalfee"),
        model: app.paypalModel,
        _link: "pfee",
        norw: true
    });
    app.views.total = new app.DollarField({
        el: $("#total"),
        model: app.paypalModel,
        _link: "total",
        _direction: true
    });
    app.views.taxrate = new app.PercentageField({
        el: $("#taxrate"),
        model: app.paypalModel,
        _link: "taxrate"
    });

    window.app = app;
})();
