define([
    "./sessionController",
    "./welcomeController",
    "./clockController"
], function(sessionController, welcomeController, clockController) {

    function InfoscreenController() {}

    return angular.module("infoscreen.infoscreenController", [
            sessionController,
            welcomeController,
            clockController
        ])
        .controller("infoscreenController", [InfoscreenController])
        .name;

});
