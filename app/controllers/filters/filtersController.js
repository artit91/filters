
/*global filters, swal, escape */
filters.controller('filtersController', [
    'utils',
    '$stateParams',
    '$state',
    '$scope',
    '$timeout',
    function (utils, $stateParams, $state, $scope, $timeout) {
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
                'name': 'OpenMayfair'
            },
            {
                'name': 'OpenRise'
            },
            {
                'name': 'OpenValencia'
            },
            {
                'name': 'OpenHefe'
            },
            {
                'name': 'OpenNashville'
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
