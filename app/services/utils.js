/*jslint devel: true */
/*global filters, URL, XMLHttpRequest*/

filters.factory('utils', ['$q', function ($q) {

    'use strict';

    var utils = {};

    utils.getImageAsDataURI = function (url) {
        return $q(function (resolve) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                resolve(URL.createObjectURL(this.response));
            };
            xhr.send();
        });
    };

    return utils;
}]);