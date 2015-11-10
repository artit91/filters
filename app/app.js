/*jslint browser: true*/
/*global angular, chrome*/

(function () {

    'use strict';

    window.filters = angular.module('filters', ['ui.router'], ['$provide', function ($provide) {
        $provide.decorator('$window', ['$delegate', function ($delegate) {
            $delegate.history = null;
            return $delegate;
        }]);
    }]);

}());