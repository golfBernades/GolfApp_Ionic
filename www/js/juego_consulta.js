angular.module('starter.juego_consulta', ['ionic'])

    .controller('juegoConsultaController', function ($scope, $ionicPopup, $cordovaSQLite,
                                                     $state, $ionicLoading, $timeout,
                                                     $ionicPlatform, $q, $http,
                                                     serviceHttpRequest) {

            $scope.data = {
                claveConsulta: 'abcdefgh',
                styleClave: ''
            };

            $scope.hoyos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                16, 17, 18];

            var modulePromises = [];
            $scope.hoyos1a9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            $scope.hoyos10a18 = [10, 11, 12, 13, 14, 15, 16, 17, 18];

            $scope.guardarPantallaJuego = function (seleccion) {
                var pantalla = "UPDATE pantalla SET pantalla = ? WHERE id = 1";
                switch (seleccion) {
                    case 1:
                        $cordovaSQLite.execute(db, pantalla, [1]);
                        $state.go('inicio');
                        break;
                }
            };

            $ionicPlatform.ready(function () {
                console.log('GolfApp>> juego.$ionicPlatform.ready');

                showClaveConsultaPopup();

                screen.orientation.addEventListener('change', function () {
                    $state.reload();
                });
            });

            function popup(title, template) {
                var pop = $ionicPopup.alert({
                    title: title,
                    template: template
                });
            }

            function showLoading() {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>' +
                    '<p>Cargando</p>',
                    animation: 'fade-in'
                }).then(function () {
                    // console.log("The loading indicator is now displayed");
                });
            }

            function showClaveConsultaPopup() {
                $ionicPopup.show({
                    templateUrl: 'templates/clave_consulta_popup.html',
                    title: 'Clave del partido',
                    subTitle: 'Ingresa la clave para acceder al partido',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Cancelar',
                            type: 'button-assertive'
                        },
                        {
                            text: 'Aceptar',
                            type: 'button-balanced',
                            onTap: function (e) {
                                if ($scope.data.claveConsulta) {
                                    $scope.data.styleClave = '';
                                    $scope.solicitarMarcador();
                                } else {
                                    $scope.data.styleClave =
                                        'background-color: red;';
                                    e.preventDefault();
                                }
                            }
                        }
                    ]
                });
            }

            $scope.solicitarMarcador = function () {
                showLoading();

                var httpRequest = serviceHttpRequest.createPostHttpRequest(
                    dir + 'partido_tablero_get', {
                        clave_consulta: $scope.data.claveConsulta
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
                            popup('Error', response.data.error_message);
                        }
                        setTimeout(function () {
                            $ionicLoading.hide();
                        }, 1000);
                    }, function errorCallback(response) {
                        if (response.status == -1) {
                            popup('Error', 'Error de conexión');
                        } else {
                            popup('Error', response.data.error_message);
                        }
                        $ionicLoading.hide();
                    });

                modulePromises.push(getTableroPromise);
            };

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
        }
    )
;
