/*jslint browser: true, devel: true*/
/*global filters, navigator, window, URL*/

filters.directive('webcam', ['webcamService', '$q', function (webcamService, $q) {

    'use strict';

    return {
        restrict : 'A',
        scope: {
            model: '=ngModel'
        },
        link: function ($scope, $element) {

            $scope.model.init = function () {
                webcamService.get().then(function (url) {
                    $element[0].src = url;
                });
            };

            $scope.model.takePhoto = function () {
                return $q(function (resolve) {
                    var canvas = document.createElement('canvas'),
                        ctx;
                    canvas.width = $element[0].videoWidth;
                    canvas.height = $element[0].videoHeight;
                    ctx = canvas.getContext('2d');
                    ctx.drawImage($element[0], 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(function (blob) {
                        resolve(URL.createObjectURL(blob));
                    }, 'image/png');
                });
            };

            $scope.model.freeze = function (url) {
                $element[0].style.backgroundImage = ['url(', url, ')'].join('');
                $element[0].src = "";
            };

        }
    };
//$scope, $element, $attributes
}]);