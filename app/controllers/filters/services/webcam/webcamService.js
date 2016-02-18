/*global filters, navigator, window*/
filters.factory('webcamService', ['$q', function ($q) {
    var webcam = {},
        webcamURL,
        webcamStream;

    webcam.get = function () {
        if (webcamURL) {
            return $q(function (resolve) {
                resolve(webcamURL);
            });
        }

        return $q(function (resolve) {
            navigator.webkitGetUserMedia({'video': true},
                function (stream) {
                    webcamStream = stream;
                    webcamURL = window.URL.createObjectURL(stream);
                    resolve(webcamURL);
                }, function (err) {
                    console.log(err);
                });
        });
    };

    webcam.destroy = function () {
        try {
            webcamStream.getTracks()[0].stop();
            webcamURL = null;
            webcamStream = null;
        } catch (ignore) {
            //ignore
        }
    };

    return webcam;
}]);
