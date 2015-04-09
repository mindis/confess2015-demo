define([
    "./sessionService"
], function(sessionService) {

    function SessionController(sessionService) {
        var that = this;

        //Controller variables
        this.sessions = [];

        //Controller functions
        this.updateSessions = function() {
            that.sessions = sessionService.currentSessions;
        };

        //Init work
        sessionService.subscribe(this.updateSessions);
    }

    return angular.module("infoscreen.sessionController", [
            sessionService
        ])
        .controller("sessionController", ["sessionService", SessionController])
        .name;

});
