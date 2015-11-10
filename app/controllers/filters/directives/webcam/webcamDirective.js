/*jslint browser: true, devel: true*/
/*global filters, navigator, window*/

filters.directive('webcam', ['webcamService', function (webcamService) {

    'use strict';

    return {
        restrict : 'A',
        link: function ($scope, $element) {

            $scope.toString();

            webcamService.get().then(function (url) {
                $element[0].src = url;
            });
        }
    };
//$scope, $element, $attributes
}]);