
/*jslint browser: true, devel: true*/
/*global filters */

filters.controller('filtersController', ['utils', '$stateParams', '$scope', '$timeout', function (utils, $stateParams, $scope, $timeout) {

    'use strict';

    $scope.selected = 'default';

    $scope.webcam = {};

    $scope.image = '';

    $scope.filters = [
        {
            name: 'default'
        },
        {
            name: 'OpenMayfair'
        },
        {
            name: 'OpenRise'
        },
        {
            name: 'OpenValencia'
        },
        {
            name: 'OpenHefe'
        },
        {
            name: 'OpenNashville'
        }
    ];

    function init() {
        $scope.webcam.init();
        $scope.filters.forEach(function (filter) {
            filter.init();
        });
    }

    function setPhoto(url) {
        $scope.image = url;
        $scope.webcam.freeze(url);
        $scope.filters.forEach(function (filter) {
            filter.freeze(url);
        });
    }

    $scope.select = function (name) {
        $scope.selected = name;
    };

    $scope.photo = function () {
        $scope.webcam.takePhoto().then(setPhoto);
    };

    $timeout(function () {

        if (!$stateParams.src) {
            init();
        } else {
            utils.getImageAsDataURI(decodeURIComponent($stateParams.src)).then(function (url) {
                setPhoto(url);
            });
        }

    });

}]);