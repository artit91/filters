/*global filters, swal, escape, Image, document, Caman */
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
                'name': 'default',
                'caman': {}
            },
            {
                'name': 'OpenMayfair',
                'caman': {
                    'contrast': contrast(1.1),
                    'saturation': saturate(1.4)
                }
            },
            {
                'name': 'OpenRise',
                'caman': {
                    'contrast': contrast(0.8),
                    'saturation': saturate(1.4),
                    'sepia': sepia(0.25),
                    'brightness': brightness(1.1),
                    'hue': hueRotate(-15)
                }
            },
            {
                'name': 'OpenValencia',
                'caman': {
                    'contrast': contrast(0.9),
                    'saturation': saturate(1.5),
                    'sepia': sepia(0.15)
                }
            },
            {
                'name': 'OpenHefe',
                'caman': {
                    'contrast': contrast(1.3),
                    'saturation': saturate(1.3),
                    'sepia': sepia(0.30),
                    'brightness': brightness(0.95),
                    'hue': hueRotate(-10)
                }
            },
            {
                'name': 'OpenNashville',
                'caman': {
                    'contrast': contrast(0.9),
                    'saturation': saturate(1.5),
                    'sepia': sepia(0.40),
                    'brightness': brightness(1.1),
                    'hue': hueRotate(-15)
                }
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

        function caman () {
            Caman('#canvas', function () {
                var filter,
                    i,
                    that = this;

                for (i = 0; i < $scope.filters.length; i += 1) {
                    if ($scope.filters[i].name === $scope.selected) {
                        filter = $scope.filters[i];
                        break;
                    }
                }

                Object.keys(filter.caman).forEach(function (key) {
                    that[key](filter.caman[key]);
                });

                that.render(function () {
                    $state.go('save', {
                        'src': that.toBase64(),
                        'original': $scope.image
                    });
                });
            });
        }

        $scope.save = function () {
            var image = document.getElementById('canvas');

            if (!image) {
                image = new Image();
                document.body.appendChild(image);
                image.id = 'canvas';
                image.onload = caman;
            }
            if (image.src === $scope.image) {
                caman();
            } else {
                image.src = $scope.image;
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
