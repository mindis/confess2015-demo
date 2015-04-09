define([
    "./sessionService"
], function(sessionService) {

    function SessionController($timeout, sessionService) {
        var that = this;

        //Controller variables
        this.sessions = [];
        this.animationTimeout = null;

        //Controller functions
        this.updateSessions = function() {
            if (that.animationTimeout) {
                $timeout.cancel(this.animationTimeout);
            }

            var sessions = sessionService.currentSessions;
            if (that.sessions.length == 0 || _.isEqual(that.sessions, sessions)) {
                that.sessions = sessions;
            }
            else {
                that.sessions = [];
                that.animationTimeout = $timeout(function() {
                    that.sessions = sessions;
                    that.animationTimeout = null;
                }, 300);
            }            
        };

        //Init work
        sessionService.subscribe(this.updateSessions);
    }

    return angular.module("infoscreen.sessionController", [
            sessionService
        ])
        .controller("sessionController", ["$timeout", "sessionService", SessionController])
        .name;

});
