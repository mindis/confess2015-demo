require([
    "./infoscreen/infoscreen"
], function(infoscreen) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, [infoscreen], {
            strictDi: true
        });
    });
});