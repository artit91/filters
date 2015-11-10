
/*jslint browser: true, devel: true*/
/*global filters */

filters.controller('filtersController', ['$scope', function ($scope) {

    'use strict';

    $scope.selected = 'default';

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

    $scope.select = function (name) {
        $scope.selected = name;
    };

}]);