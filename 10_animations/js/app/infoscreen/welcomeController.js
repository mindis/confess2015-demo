define([
    "./sessionService"
], function(sessionService) {

    WELCOME_TOGGLE = 1000 * 30;

    function WelcomeController($rootScope, $interval, $location, sessionService) {
        var that = this;

        //Controller variables
        this.welcomeMode = false;
        this.welcomeStart = 0;
        this.welcomeInterval = null;
        this.isVisible = false;

        //Controller functions
        this.updateVisibility = function() {
            if (sessionService.currentSessions.length == 0) {
                that.isVisible = true;
            }
            else if (that.welcomeMode) {
                var now = new Date().getTime();
                var diff = now - that.welcomeStart;
                that.isVisible = (diff % (WELCOME_TOGGLE * 2)) < WELCOME_TOGGLE;
            }
            else {
                that.isVisible = false;
            }
        }

        this.updateWelcomeMode = function() {
            params = $location.search();
            that.welcomeMode = (params.welcome && params.welcome == "true");

            if (that.welcomeMode && !that.welcomeInterval) {
                that.welcomeInterval = $interval(that.updateVisibility, 1000);
                that.welcomeStart = new Date().getTime();
            }
            else if (that.welcomeInterval) {
                $interval.cancel(that.updateVisibility);
                that.welcomeInterval = null;
            }
            that.updateVisibility();
        }

        //Init work
        that.updateWelcomeMode();

        sessionService.subscribe(this.updateVisibility);
        $rootScope.$on("$locationChangeSuccess", this.updateWelcomeMode);
    }

    return angular.module("infoscreen.WelcomeController", [])
        .controller("welcomeController", ["$rootScope", "$interval", "$location", "sessionService", WelcomeController])
        .name;

});
