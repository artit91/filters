/*global filters, URL, XMLHttpRequest*/
filters.factory('utils', ['$q', function ($q) {
    var utils = {};

    utils.getImageAsDataURI = function (url) {
        return $q(function (resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                resolve(URL.createObjectURL(this.response));
            };
            xhr.onerror = function (err) {
                reject(err);
            };
            xhr.send();
        });
    };

    return utils;
}]);
