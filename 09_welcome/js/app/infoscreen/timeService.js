define([
    
], function() {

    function TimeService($rootScope, $interval, $location) {
        var that = this;

        //Service variables
        this.subscribers = [];
        this.dateDiff = 0;
        this.now = moment();
        
        //Service functions
        this.subscribe = function(subscriber) {
            that.subscribers.push(subscriber);
        };

        this.publish = function() {
            that.subscribers.forEach(function(subscriber) {
                subscriber();
            });
        };

        this.updateTime = function() {
            that.now = moment().add(that.dateDiff);
            that.publish();
        };

        this.updateDiff = function() {
            params = $location.search();
            if (params.date) {
                startDate = moment(params.date);
                if (startDate.isValid()) {
                    that.dateDiff = startDate.diff(moment());
                }            
            }
            that.updateTime();
        }

        //Init work
        this.updateDiff()
        this.updateTime();

        $rootScope.$on("$locationChangeSuccess", that.updateDiff);
        $interval(this.updateTime, 60 * 1000);
    }

    return angular.module("infoscreen.timeService", [])
        .service("timeService", ["$rootScope", "$interval", "$location", TimeService])
        .name;

});
