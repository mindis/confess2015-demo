define([
    "./sessionController",
    "./welcomeController",
    "./clockController",
    "./tickerDirective"
], function(sessionController, welcomeController, clockController, tickerDirective) {

    function InfoscreenController() {}

    return angular.module("infoscreen.infoscreenController", [
            sessionController,
            welcomeController,
            clockController,
            tickerDirective
        ])
        .controller("infoscreenController", [InfoscreenController])
        .name;

});
