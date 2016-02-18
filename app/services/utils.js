/*global filters, URL, XMLHttpRequest, Image, document, btoa*/
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

    utils.getImageData = function (image) {
        return $q(function (resolve) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                img = new Image();

            img.src = image;

            img.onload = function () {
                canvas.width = this.width;
                canvas.height = this.height;
                ctx.drawImage(img, 0, 0);
                resolve({
                    'url': canvas.toDataURL('image/png'),
                    'width': this.width,
                    'height': this.height
                });
            };
        });
    };

    utils.svgToPng = function (svg, width, height) {
        return $q(function (resolve) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                img = new Image();

            canvas.width = width;
            canvas.height = height;
            img.src = 'data:image/svg+xml;base64,' + btoa(svg);

            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
        });
    };

    return utils;
}]);
