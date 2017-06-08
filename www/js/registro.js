/**
 * Created by Victor Hugo on 07/06/2017.
 */

angular.module('starter.registro', ['ionic'])

    .controller('registroController', function ($scope, $state, $ionicPopup,
                                                $http, $ionicLoading,
                                                $cordovaSQLite, $ionicPlatform,
                                                $q) {

        var modulePromises = [];
        var correoDisponible = false;
        var registroCorrecto = false;

        // $scope.registroData = {
        //     correo: '',
        //     password: '',
        //     passwordConf: ''
        // };

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
                popup('Error', 'Debes llenar todos los campos');
            } else {
                if (password != passwordConf) {
                    popup('Error', 'Las contraseñas no coinciden');
                } else {
                    datosCompletos = true;
                }
            }

            if (datosCompletos) {
                showLoading();
                consultarCorreo(1);

                $q.all(modulePromises).then(function () {
                    if (correoDisponible) {
                        insertarUsuario(1);
                        $q.all(modulePromises).then(function () {
                            if (registroCorrecto) {
                                popup('Ok', 'Me registré, ahora puedo usar GolfApp');
                            }
                        });
                    }
                });
            }
        };

        function createPostHttpRequest(url, data) {
            var httpRequest = {
                method: 'POST',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "="
                            + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: data,
                timeout: 3000
            };

            return httpRequest;
        }

        function consultarCorreo(intento) {
            var httpRequest = createPostHttpRequest(
                'http://192.168.0.11:8000/usuario_exists',
                {email: $scope.registroData.correo}
            );

            var correoRequest = $http(httpRequest)
                .then(function successCallback(response) {
                    if (response.data.existe) {
                        $ionicLoading.hide();
                        popup('Error', 'El email ya está siendo utilizado');
                        correoDisponible = false;
                    } else {
                        correoDisponible = true;
                    }
                }, function errorCallback(response) {
                    if (response.status == 400) {
                        popup('Error response', response.data.error_message);
                        correoDisponible = false;
                    } else {
                        if (intento < 3) {
                            consultarCorreo(intento + 1);
                        } else {
                            $ionicLoading.hide();
                            popup('Error response', 'status: '
                                + response.status);
                            correoDisponible = false;
                        }
                    }
                });

            modulePromises.push(correoRequest);
        }

        function insertarUsuario(intento) {
            var httpRequest = createPostHttpRequest(
                'http://192.168.0.11:8000/usuario_insert',
                {
                    email: $scope.registroData.correo,
                    password: $scope.registroData.password
                }
            );

            var insertarRequest = $http(httpRequest)
                .then(function successCallback(response) {
                    $ionicLoading.hide();
                    if (response.data.insertado) {
                        popup('Registro', 'La cuenta fue creada correctamente');
                        popup('Registro', 'usuario_id: '
                            + response.data.usuario_id);
                        registroCorrecto = true;
                    } else {
                        popup('Error de registro', response.data.error_message);
                        registroCorrecto = false;
                    }
                }, function errorCallback(response) {
                    if (response.status == 400) {
                        popup('Error response', response.data.error_message);
                        registroCorrecto = false;
                    } else {
                        if (intento < 3) {
                            insertarUsuario(intento + 1);
                        } else {
                            $ionicLoading.hide();
                            popup('Error response', 'status: '
                                + response.status);
                            registroCorrecto = false;
                        }
                    }
                });

            modulePromises.push(insertarRequest);
        }

        function guardarUsuarioPhone() {
            var query = "INSERT INTO usuario (id, email, password) VALUES (?,?,?)";
            $cordovaSQLite.execute(db, query, [1, $scope.registro.correo, $scope.registro.password])
                .then(function (res) {
                    popup("Bienvenido a GolfApp", "Ahora ya eres un miembro de GolfApp, Crea partidos y disfruta de privilegios.")
                    $state.go('inicio')
                }, function (err) {
                    popup("Usuario error", " erroe")
                    console.error(err);
                });
        }

        function popup(title, template) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: template
            });
        };

        function showLoading() {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>' +
                '<p>Cargando</p>',
                animation: 'fade-in'
            }).then(function () {
                // console.log("The loading indicator is now displayed");
            });
        };


        $ionicPlatform.ready(function () {
            console.log('jugadoresController', 'Ready');
            ;
        });
    });
