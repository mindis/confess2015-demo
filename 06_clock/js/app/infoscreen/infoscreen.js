define([
    "./clockController"
], function(clockController) {

    return angular.module("infoscreen", [
            clockController
        ])
        .name;

});
