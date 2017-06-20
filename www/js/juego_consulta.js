angular.module('starter.juego_consulta', ['ionic'])

    .controller('juegoConsultaController', function ($scope, $ionicPopup, $cordovaSQLite,
                                                     $state, $ionicLoading, $timeout,
                                                     $ionicPlatform, $q, $http,
                                                     serviceHttpRequest, utils) {


        var modulePromises = [];

        $scope.hoyos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        $scope.hoyos1a9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        $scope.hoyos10a18 = [10, 11, 12, 13, 14, 15, 16, 17, 18];


        $ionicPlatform.ready(function () {
            console.log('GolfApp>> juego.$ionicPlatform.ready');
            getMarcador();
            screen.orientation.addEventListener('change', function () {
                $state.reload();
            });
        });

        $scope.seleccionarInicio = function () {
            $state.go('inicio');
        };

        $scope.solicitarMarcador = function () {
            getMarcador();
        };

        function getMarcador() {
            utils.showLoading();
            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir + 'partido_tablero_get', {
                    clave_consulta: claveActual
                }
            );

            var getTableroPromise = $http(httpRequest)
                .then(function successCallback(response) {
                    if (response.data.ok) {
                        $scope.tablero = response.data.tablero;
                        setTimeout(function () {
                            fixRowsAndColumns();
                        }, 1000);
                    } else {
                        utils.popup('Error', response.data.error_message);
                    }
                    setTimeout(function () {
                        $ionicLoading.hide();
                    }, 1000);
                }, function errorCallback(response) {
                    if (response.status == -1) {
                        utils.popup('Error', 'Error de conexión');
                    } else {
                        utils.popup('Error', response.data.error_message);
                    }
                    $ionicLoading.hide();
                });

            modulePromises.push(getTableroPromise);
        }

        function fixRowsAndColumns() {
            $('#table_juego_consulta').fxdHdrCol({
                fixedCols: 1,
                width: '100%',
                height: '100%',
                colModal: [
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'}
                ]
            });
        }

    });
