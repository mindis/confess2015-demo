define([
    "./infoscreenController",
    "text!./infoscreen.html"
], function(infoscreenController, infoscreenTemplate) {

    return angular.module("infoscreen", [
            infoscreenController,
            "ui.router"
        ])
        .config(["$urlRouterProvider", "$stateProvider", function($urlRouterProvider, $stateProvider) {
            //Default Route
            $urlRouterProvider.otherwise("/");

            //Routes
            $stateProvider.state("infoscreen", {
                url: "/",
                template: infoscreenTemplate,
                controller: "infoscreenController",
                controllerAs: "infoscreenController"
            });
        }])
        .name;

});
