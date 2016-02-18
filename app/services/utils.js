/*global filters, URL, XMLHttpRequest, Image, document, btoa, atob, Blob*/
filters.factory('utils', ['$q', function ($q) {
    var utils = {};

    utils.dataURItoBlob = function (dataURI) {
        var byteString,
            mimeString,
            ia,
            i;

        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = unescape(dataURI.split(',')[1]);
        }

        mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        ia = new Uint8Array(byteString.length);
        for (i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {'type': mimeString});
    };

    utils.getImageAsDataURI = function (url) {
        return $q(function (resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                if ([
                    'image/jpg',
                    'image/jpeg',
                    'image/png',
                    'image/bmp'
                ].indexOf(this.response.type) === -1) {
                    return reject('Unsupported response type');
                }
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
