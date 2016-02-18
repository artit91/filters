/*global filters, swal, escape */
filters.controller('filtersController', [
    'utils',
    '$templateCache',
    '$stateParams',
    '$state',
    '$scope',
    '$timeout',
    function (utils, $templateCache, $stateParams, $state, $scope, $timeout) {
        var filterTemplate = $templateCache.get('filterTemplate.tpl.html');

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

        $scope.save = function () {
            utils.getImageData($scope.image).then(function (imageData) {
                var svg,
                    image = [
                        '<image y="0" x="0" ',
                        'xlink:href="',
                        imageData.url,
                        '" ',
                        'preserveAspectRatio="none" ',
                        'height="',
                        imageData.height,
                        '" ',
                        'width="',
                        imageData.width,
                        '" ',
                        'style="filter:url(#',
                        $scope.selected,
                        ')" />'
                    ].join('');

                svg = filterTemplate.replace(
                    '{{image}}',
                    image
                ).replace(
                    '{{width}}',
                    imageData.width
                ).replace(
                    '{{height}}',
                    imageData.height
                );

                utils.svgToPng(
                    svg,
                    imageData.width,
                    imageData.height
                ).then(function (dataURI) {
                    $state.go('save', {
                        'src': dataURI,
                        'original': $scope.image
                    });
                });
            });
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

        $scope.filterTemplate = filterTemplate;
    }
]);
