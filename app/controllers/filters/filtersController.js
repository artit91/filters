/*global filters, swal, escape */
filters.controller('filtersController', [
    'utils',
    '$stateParams',
    '$state',
    '$scope',
    '$timeout',
    function (utils, $stateParams, $state, $scope, $timeout) {
        function contrast (cssArg) {
            return Math.round(
                cssArg < 1 ? (1 - cssArg) * -100 : (cssArg - 1) * 100
            );
        }

        function saturate (cssArg) {
            return Math.round(
                cssArg < 1 ? (1 - cssArg) * -100 : (cssArg - 1) * 100
            );
        }

        function sepia (cssArg) {
            return Math.round(cssArg * 100);
        }

        function brightness (cssArg) {
            return Math.round(
                cssArg < 1 ? (1 - cssArg) * -100 : (cssArg - 1) * 100
            );
        }

        function hueRotate (cssArg) {
            return Math.round(
                (((360 + cssArg) % 360) / 360) * 100
            );
        }

        $scope.selected = 'default';
        $scope.photoTaken = 0;
        $scope.noCamera = 0;
        $scope.webcam = {};
        $scope.image = '';
        $scope.filters = [
            {
                'name': 'default'
            },
            {
                'name': 'OpenMayfair',
                'contrast': contrast(1.1),
                'saturation': saturate(1.4)
            },
            {
                'name': 'OpenRise',
                'contrast': contrast(0.8),
                'saturation': saturate(1.4),
                'sepia': sepia(0.25),
                'brightness': brightness(1.1),
                'hue': hueRotate(-15)
            },
            {
                'name': 'OpenValencia',
                'contrast': contrast(0.9),
                'saturation': saturate(1.5),
                'sepia': sepia(0.15)
            },
            {
                'name': 'OpenHefe',
                'contrast': contrast(1.3),
                'saturation': saturate(1.3),
                'sepia': sepia(0.30),
                'brightness': brightness(0.95),
                'hue': hueRotate(-10)
            },
            {
                'name': 'OpenNashville',
                'contrast': contrast(0.9),
                'saturation': saturate(1.5),
                'sepia': sepia(0.40),
                'brightness': brightness(1.1),
                'hue': hueRotate(-15)
            }
        ];

        function init () {
            $scope.webcam.init();
            $scope.filters.forEach(function (filter) {
                filter.init();
            });
        }

        function setPhoto (url) {
            $scope.image = url;
            $scope.webcam.freeze(url);
            $scope.filters.forEach(function (filter) {
                filter.freeze(url);
                $scope.photoTaken = 1;
            });
        }

        $scope.select = function (name) {
            $scope.selected = name;
        };

        $scope.photo = function () {
            if (!$scope.photoTaken) {
                $scope.webcam.takePhoto().then(setPhoto);
            } else {
                init();
                $scope.photoTaken = 0;
            }
        };

        $timeout(function () {
            if (!$stateParams.src) {
                init();
                $scope.noCamera = 0;
            } else if ($stateParams.uri) {
                $scope.noCamera = 1;
                setPhoto('blob:' + escape(
                    decodeURIComponent($stateParams.src).replace('blob:', ''))
                );
            } else {
                utils.getImageAsDataURI(
                    decodeURIComponent($stateParams.src)
                ).then(function (url) {
                    $scope.noCamera = 1;
                    console.error(url);
                    setPhoto(url);
                }).catch(function () {
                    swal({
                        'title': 'Can\'t load this URL.',
                        'type': 'error',
                        'closeOnConfirm': false,
                        'animation': 'pop'
                    }, function () {
                        $state.go('selector');
                    });
                });
            }
        });
    }
]);
