define([
    "./sessionController",
    "./clockController",
], function(sessionController, clockController) {

    function InfoscreenController() {}

    return angular.module("infoscreen.infoscreenController", [
            sessionController,
            clockController
        ])
        .controller("infoscreenController", [InfoscreenController])
        .name;

});
