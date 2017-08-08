/**
 * Created by Victor Hugo on 07/06/2017.
 */

angular.module('starter.registro', ['ionic'])

    .controller('registroController', function ($scope, $state, $ionicPopup,
                                                $http, $ionicLoading,
                                                $cordovaSQLite, $ionicPlatform,
                                                $q, serviceHttpRequest, utils) {

        var modulePromises = [];
        var correoDisponible = false;
        var registroCorrecto = false;
        var usuarioID;

        $scope.registroData = {
            correo: 'porfirioads@gmail.com',
            password: 'holamundo',
            passwordConf: 'holamundo'
        };

        $scope.goInicio = function () {
            $state.go('inicio')
        };

        $scope.goRegistro = function () {
            $state.go('inicio')
        };

        $scope.goLogin = function () {
            $state.go('login')
        };

        $scope.registrarCuenta = function () {
            var datosCompletos = false;
            var correo = $scope.registroData.correo;
            var password = $scope.registroData.password;
            var passwordConf = $scope.registroData.passwordConf;

            if (correo == null || password == null || passwordConf == null) {
                utils.popup('Error', 'Debes llenar todos los campos');
            } else {
                if (password != passwordConf) {
                    utils.popup('Error', 'Las contraseñas no coinciden');
                } else {
                    datosCompletos = true;
                }
            }

            if (datosCompletos) {
                utils.showLoading();
                consultarCorreo(0);

                $q.all(modulePromises).then(function () {
                    if (correoDisponible) {
                        insertarUsuario(1);
                        $q.all(modulePromises).then(function () {
                            if (registroCorrecto) {

                                sesionActual= true;
                                guardarUsuarioPhone();
                                deleteAllDatosCuenta();

                                $ionicLoading.hide();
                                utils.popup('Bienvenido a GolfApp', 'Disfruta todos los privilegios como usuario del sistema.');
                                $state.go('inicio');
                            }
                        });
                    }
                });
            }
        };

        function consultarCorreo(intento) {
            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir+'usuario_exists',
                {email: $scope.registroData.correo}
            );

            var correoRequest = $http(httpRequest)
                .then(function successCallback(response) {
                    if (response.data.ok) {
                        if(response.data.existe){
                            $ionicLoading.hide();
                            utils.popup('Correo Existente', 'Correo Existente. Revisa tus datos o intenta con otro correo.');
                            correoDisponible = false;
                        }else{
                            correoDisponible = true;
                        }
                    } else {
                        correoDisponible = false;
                        utils.popup('Error de Correo', 'Error al Registrase. Intentar mas tarde.');
                    }
                }, function errorCallback(response) {
                    if(response.status == -1){
                        if (intento < 3) {
                            consultarCorreo(intento + 1);
                        } else {
                            correoDisponible = false;
                            $ionicLoading.hide();
                            utils.popup('Error de conexion', 'Error de Conexión. Volver a intentar más tarde.');
                        }
                    }else{
                        correoDisponible = false;
                        $ionicLoading.hide();
                        utils.popup('Error de Parámetros', 'Error de Parámetros incorrectos. Volver a intentar más tarde.');
                    }
                });

            modulePromises.push(correoRequest);
        }

        function insertarUsuario(intento) {
            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir+'usuario_insert',
                {
                    email: $scope.registroData.correo,
                    password: $scope.registroData.password
                }
            );

            var insertarRequest = $http(httpRequest)
                .then(function successCallback(response) {
                    if (response.data.ok) {
                        usuarioID = response.data.usuario_id;
                        registroCorrecto = true;
                    } else {
                        registroCorrecto = false;
                        $ionicLoading.hide();
                        utils.popup('Error de Registro', 'Error de Registro. Volver a intentar más tarde.');
                    }
                }, function errorCallback(response) {
                    if(response.status == -1){
                        if (intento < 3) {
                            insertarUsuario(intento + 1);
                        } else {
                            registroCorrecto = false;
                            $ionicLoading.hide();
                            utils.popup('Error de conexion', 'Error de Conexión. Volver a intentar más tarde.');
                        }
                    }else{
                        registroCorrecto = false;
                        $ionicLoading.hide();
                        utils.popup('Error de Parámetros', 'Error de Parámetros incorrectos. Volver a intentar más tarde.');
                    }
                });

            modulePromises.push(insertarRequest);
        }

        function guardarUsuarioPhone() {
            var query = "INSERT INTO usuario (id, email, password) VALUES (?,?,?)";
            $cordovaSQLite.execute(db, query, [usuarioID, $scope.registroData.correo, $scope.registroData.password]);
        }

        function deleteAllDatosCuenta() {
            var query = 'DELETE FROM campo WHERE cuenta = 1';
            $cordovaSQLite.execute(db, query);
        }

    });
