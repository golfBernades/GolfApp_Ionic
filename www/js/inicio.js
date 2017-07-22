angular.module('starter.inicio', ['ionic'])

    .controller('inicioController', function ($scope, $cordovaSQLite, $state,
                                              $ionicPlatform, $ionicPopup, $ionicLoading,
                                              $http, servicePantallas, serviceHttpRequest, utils) {

        $scope.data = {
            clave: "abcdefgh",
            styleClave: ''
        };

        $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-in";

        $scope.seleccionarJugadores = function () {
            if (sesionActual) {
                $state.go('seleccion_jugadores');
            } else {
                confirmSesion()
            }
        };

        $scope.verificarSesion = function () {
            if (sesionActual) {
                logOut();
            } else {
                logIn();
            }
        };

        function verificarClave(intento) {

            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir + 'partido_consulta_exists',
                {clave_consulta: $scope.data.clave}
            );

            $http(httpRequest)
                .then(function successCallback(response) {

                    $ionicLoading.hide();
                    if (response.data.ok) {

                        if (response.data.exists) {
                            insertClave($scope.data.clave)
                        } else {
                            utils.popup('Error de clave', 'No se pudo encontrar esa clave. Volver a intentar');
                        }
                    } else {
                        utils.popup('Error de clave', 'No se pudo encontrar esa clave. Intentar más tarde.');
                    }

                }, function errorCallback(response) {

                    if (response.status == -1) {
                        if (intento < 3) {
                            verificarClave(intento + 1);
                        } else {
                            $ionicLoading.hide();
                            utils.popup("Error de Conexión", "Volver a" +
                                " intentar más tarde");
                        }
                    } else {
                        $ionicLoading.hide();
                        utils.popup("Error de Parámetros", "Revisar los" +
                            " parámetros de la petición HTTP");
                    }
                });
        }

        function confirmSesion() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Iniciar Sesión',
                template: 'Para poder avanzar debes iniciar sesión',
                okText: 'Iniciar Sesión',
                cancelText: 'Cancelar'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    logIn()
                }
            });
        }

        function logIn() {
            $state.go('login');
        }

        function logOut() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Cerrar Sesión',
                template: 'Estas seguro de cerrar sesión?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    deleteUser();
                    sesionActual = false;
                    $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-in";
                }
            });
        }

        function deleteUser() {
            var query = 'DELETE FROM usuario';
            $cordovaSQLite.execute(db, query);
        }

        function isUser() {
            if (sesionActual) {
                $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-out";
            } else {
                $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-in";
            }
        }

        function insertClave(clave) {
            var query = "INSERT INTO clave (clave) VALUES (?)";
            $cordovaSQLite.execute(db, query, [clave])
                .then(function (res) {
                    $state.go('juego_consulta');
                }, function (err) {
                    console.log(JSON.stringify(err))
                });
        }

        $scope.consultaJuego = function () {
            console.log("--- DB: " + JSON.stringify(db));

            var query = "SELECT * FROM clave";
            $cordovaSQLite.execute(db, query)
                .then(function (res) {
                    if (res.rows.length > 0) {
                        $state.go('juego_consulta');
                    } else {
                        pedirClave();
                    }
                }, function (err) {
                    console.log(JSON.stringify(err))
                });
        };

        function pedirClave() {
            $ionicPopup.show({
                title: 'Ingresar Clave del Partido',
                templateUrl: 'templates/clave_consulta_popup.html',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar'
                    },
                    {
                        text: '<b>Verificar</b>',
                        type: 'button-positive',
                        onTap: function (e) {

                            if ($scope.data.clave) {
                                utils.showLoading();
                                verificarClave(0)
                            } else {
                                $scope.data.styleClave = 'background-color:red';
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        }

        $ionicPlatform.ready(function () {
            isUser()
        });

    });
