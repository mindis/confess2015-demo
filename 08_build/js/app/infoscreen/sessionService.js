define([
    "./timeService"
], function(timeService) {

    var RELOAD_INTERVAL = 1000 * 60 * 60;
    var PRE_SHOW_TIME = 1000 * 60 * 15;

    var ROOM_MAP = {
        R1: "Room 1",
        R2: "Room 2",
        R3: "Room 3",
        ALL: ""
    }

    function SessionService(timeService, $timeout, $http) {
        var that = this;

        //Service variables
        this.subscribers = [];
        this.data = null;
        this.pendingRequest = null;
        this.lastLoad = 0;
        this.currentSessions = [];
        
        //Service functions
        this.subscribe = function(subscriber) {
            that.subscribers.push(subscriber);
        };

        this.publish = function() {
            that.subscribers.forEach(function(subscriber) {
                subscriber();
            });
        };

        this.loadData = function() {
            if (that.pendingRequest) {
                return;
            }

            console.log("Loading fresh data");
            that.pendingRequest = $http.get("infoscreen.json?ts=" + new Date().getTime(), {
                timeout: 10000,
                cache: false
            }).then(function(data, status) {
                that.lastLoad = moment().valueOf();
                that.data = that.processData(data.data);
                $timeout(that.updateCurrentSessions, 0);
            }, function(data, status) {
                console.log("Failed to load data", data);
            }).finally(function() {
                that.pendingRequest = null;
            });
        };

        this.processData = function(data) {
            var speakers = {};
            data.speakers.forEach(function(speaker) {
                var name = speaker.firstName + " " + speaker.lastName;
                speakers[name] = speaker;
                speaker.image = "data:image/jpeg;base64," + speaker.image;
            });
            data.sessions.forEach(function(session) {
                session.date = moment(session.date);
                session.roomName = ROOM_MAP[session.room];
                session.speakerNames = session.speakers;
                session.speakers = [];
                session.speakerNames.forEach(function(name) {
                    var speaker = speakers[name];
                    if (speaker) {
                        session.speakers.push(speaker);
                    }
                    else {
                        console.log("ALERT - no speaker matched", session);
                    }
                });
                session.speakers.sort(function(lhs, rhs) {
                    return lhs.lastName < rhs.lastName ? -1 : 1;
                });
            });
            data.sessions.sort(function(lhs, rhs) {
                if (lhs.date.isSame(rhs.date)) {
                    return 0;
                }
                return lhs.date.isBefore(rhs.date) ? -1 : 1;
            });
            return data;
        };

        this.updateCurrentSessions = function() {
            if (!that.data || moment().valueOf() - that.lastLoad > RELOAD_INTERVAL) {
                that.loadData();
            }
            if (!that.data) {
                return;
            }

            var now = timeService.now.clone().add(PRE_SHOW_TIME);
            var lastSlot = null;
            var sessions = [];
            for (var i = 0, session; (session = that.data.sessions[i]); i++) {
                if (!now.isSame(session.date, "day")) {
                    continue;
                }

                if (session.date.isAfter(now)) {
                    break;
                }

                if (!lastSlot || !lastSlot.isSame(session.date)) {
                    lastSlot = session.date;
                    sessions = [];
                }

                if (lastSlot.isSame(session.date)) {
                    sessions.push(session);
                }
            }
            sessions.sort(function(lhs, rhs) {
                return lhs.room < rhs.room ? -1 : 1;
            });
            that.currentSessions = sessions;
            that.publish();
        };

        //Init work
        this.updateCurrentSessions();
        timeService.subscribe(this.updateCurrentSessions);
    }

    return angular.module("infoscreen.sessionService", [
            timeService
        ])
        .service("sessionService", ["timeService", "$timeout", "$http", SessionService])
        .name;

});
