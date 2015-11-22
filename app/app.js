/*jslint browser: true, devel: true*/
/*global angular, chrome, window, URL, swal*/

(function () {

    'use strict';

    window.filters = angular.module('filters', ['ui.router'], ['$provide', function ($provide) {
        $provide.decorator('$window', ['$delegate', function ($delegate) {
            $delegate.history = null;
            return $delegate;
        }]);
    }]).run(['$state', function ($state) {

        function showAlert() {
            swal({
                title: "Your clipboard does not contain an image.",
                type: "error",
                closeOnConfirm: false,
                animation: "pop"
            });
        }

        window.addEventListener('paste', function (event) {
            if (!$state.$current.locals.overridePaste) {
                var file;
                if (event.clipboardData.items[0]) {
                    file = event.clipboardData.items[0].getAsFile();
                    console.error(file);
                    if (file && ['jpg', 'jpeg', 'png', 'svg', 'bmp'].indexOf(file.type.replace('image/', '')) !== -1) {
                        $state.go('filters', {
                            src: URL.createObjectURL(file),
                            uri: true
                        });
                    } else {
                        showAlert();
                    }
                } else {
                    showAlert();
                }
            }
        }, true);
    }]);

}());