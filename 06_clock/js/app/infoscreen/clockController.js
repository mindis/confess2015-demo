define([], function() {

    function ClockController($interval) {
        var that = this;

        //Controller variables
        this.hours = "";
        this.minutes = "";
        this.seconds = "";
        this.showColon = false;

        //Controller functions
        this.updateTime = function() {
            var now = moment();
            that.hours = now.format("HH");
            that.minutes = now.format("mm");
            that.seconds = now.format("ss");
            that.showColon = !that.showColon;
        };

        //Init work
        this.updateTime();
        $interval(this.updateTime, 1000);
    }

    return angular.module("infoscreen.clockController", [])
        .controller("clockController", ["$interval", ClockController])
        .name;

});
