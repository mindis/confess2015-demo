define([
    "./timeService"
], function(timeService) {

    function ClockController(timeService, $interval) {
        var that = this;

        //Controller variables
        this.hours = "";
        this.minutes = "";
        this.showColon = false;

        //Controller functions
        this.updateTime = function() {
            that.hours = timeService.now.format("HH");
            that.minutes = timeService.now.format("mm");
        };

        //Init work
        this.updateTime();
        timeService.subscribe(this.updateTime);
        $interval(function() {
            that.showColon = !that.showColon;
        }, 1000);
    }

    return angular.module("infoscreen.clockController", [timeService])
        .controller("clockController", ["timeService", "$interval", ClockController])
        .name;

});
