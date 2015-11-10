/*jslint devel: true */
/*global filters, navigator, window*/

filters.factory('webcamService', ["$q", function ($q) {

    'use strict';

    var webcam = {},
        webcamURL;

    webcam.get = function () {

        if (webcamURL) {
            return $q(function (resolve) {
                resolve(webcamURL);
            });
        }

        return $q(function (resolve) {
            navigator.webkitGetUserMedia({video: true},
                function (stream) {
                    webcamURL = window.URL.createObjectURL(stream);
                    resolve(webcamURL);
                }, function (err) {
                    console.log(err);
                });
        });

    };

    return webcam;
}]);