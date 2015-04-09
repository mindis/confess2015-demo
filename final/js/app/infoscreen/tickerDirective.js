define([
    "text!./ticker.html"
], function(tickerTemplate) {

    MESSAGE_ANIMATION = 500; //Time for the show/hide animation (match with CSS animation)
    MESSAGE_SHOW_TIME = 1000 * 10; //How long to show the message
    MESSAGE_WAIT_BEFORE_SCROLL = 1000 * 5; //How long to wait before and after the scroll
    MESSAGE_RELOAD = 1000 * 60; //How often to reload via Ajax

    function TickerController($element, $http, $timeout) {
        var that = this;
        var $divMessage = $element.find(".message");

        //Controller variables
        this.data = null;
        this.currentMessage = null; //counter for this.data.messages
        this.showMessage = false; //for ng-show (for animation)
        this.isScrolled = false; //whether the message was scrolled
        this.message = null; //The actual string of the message

        //Controller functions
        this.updateMessage = function() {
            //Hide message if non is available
            if (!that.data || that.data.messages.length == 0) {
                that.currentMessage = null;
                that.showMessage = false;
                $timeout(that.updateMessage, MESSAGE_SHOW_TIME);
                return;
            }

            //Calculate current message index
            if (that.currentMessage === null) {
                that.currentMessage = 0;
            }
            else {
                that.currentMessage++;
                if (that.currentMessage >= that.data.messages.length) {
                    that.currentMessage = 0;
                }
            }

            //Don't do anything if message hasn't changed and isn't scrolled
            var message = that.data.messages[that.currentMessage];
            if (message == that.message && !that.isScrolled) {
                $timeout(that.updateMessage, MESSAGE_SHOW_TIME);
                return;
            }

            //Switch message (with animation) and start scrolling necessary
            that.showMessage = false;
            $timeout(function() {
                that.message = message;
                that.showMessage = true;
                $divMessage.css("left", 0);
                $timeout(function() {
                    that.scrollMessage();
                }, MESSAGE_ANIMATION);
            }, MESSAGE_ANIMATION);
        };

        this.scrollMessage = function() {
            that.isScrolled = false;
            var availableWidth = $element.width();
            var messageWidth = $divMessage.innerWidth();

            if (messageWidth <= availableWidth) {
                $timeout(that.updateMessage, MESSAGE_SHOW_TIME);
                return;
            }

            $timeout(function() {
                var distance = availableWidth - messageWidth;
                $divMessage.animate({
                    left: distance
                }, {
                    easing: "linear",
                    duration: Math.abs(distance) * 14,
                    complete: function() {
                        that.isScrolled = true;
                        $timeout(that.updateMessage, MESSAGE_WAIT_BEFORE_SCROLL);
                    }
                });
            }, MESSAGE_WAIT_BEFORE_SCROLL);
        };

        this.loadMessages = function() {
            $http.get("ticker.json?ts=" + new Date().getTime(), {
                timeout: 10000,
                cache: false
            }).then(function(data) {
                var previousData = that.data;
                that.data = data.data;
                if (!previousData) {
                    that.updateMessage();
                }                
            }, function(err) {
                console.log("Error fetching ticker messages", err);
            }).finally(function() {
                $timeout(that.loadMessages, MESSAGE_RELOAD);
            });
        };

        //Init work
        this.loadMessages();
    }

    function tickerDirective() {
        return {
            restrict: "E",
            scope: {},
            template: tickerTemplate,
            controller: ["$element", "$http", "$timeout", TickerController],
            controllerAs: "tickerController",
            bindToController: true
        };
    }

    return angular.module("infoscreen.tickerDirective", [
            "ngSanitize"
        ])
        .directive("ticker", [tickerDirective])
        .name;

});
