/**
 * Created by Victor Hugo on 07/06/2017.
 */

angular.module('starter.login', ['ionic'])

    .controller('loginController', function ($scope, $state, $ionicPopup,
                                             $ionicLoading, $http, $cordovaSQLite,
                                             serviceHttpRequest, utils) {

        var idUsuario;

        $scope.loginData = {
            correo: '',
            password: ''
        };

        $scope.goInicio = function () {
            $state.go('inicio')
        };

        $scope.goLogin = function () {

            var correo = $scope.loginData.correo;
            var password = $scope.loginData.password;

            if (correo == null && password == null) {
                utils.popup("Campos Incompletos", "Revisar los datos" +
                    " ingresados");
            } else {
                utils.showLoading();
                loginServer(0);
            }
        };

        $scope.goRegistro = function () {
            $state.go('registro')
        };

        function loginServer(intento) {

            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir + 'usuario_login',
                {
                    email: $scope.loginData.correo,
                    password: $scope.loginData.password
                }
            );

            $http(httpRequest)
                .then(function successCallback(response) {

                    sesionActual = response.data.ok;
                    if (response.data.ok) {
                        idUsuario = response.data.usuario_id;
                        guardarUsuarioPhone(response.data.usuario_id);
                        getCamposCuenta(0);
                    } else {
                        utils.popup('Error de datos', 'El correo o' +
                            ' contraseña son incorrectos');
                    }
                    $ionicLoading.hide();
                }, function errorCallback(response) {
                    sesionActual = false;
                    if (response.status == -1) {
                        if (intento < 3) {
                            loginServer(intento + 1);
                        } else {
                            $ionicLoading.hide();
                            utils.popup("Error de Conexión", "Volver a" +
                                " intentar más tarde");
                        }
                    } else {
                        $ionicLoading.hide();
                        // utils.popup("Error de Parámetros", "Revisar los" +
                        //     " parámetros de la petición HTTP");
                        // utils.popup("ERROR", JSON.stringify(response));
                    }
                });
        }

        function guardarUsuarioPhone(idUser) {
            var query = "INSERT INTO usuario (id, email, password) VALUES (?,?,?)";
            $cordovaSQLite.execute(db, query, [idUser, $scope.loginData.correo, $scope.loginData.password]);

            id_user_app = idUser;
            user_app = $scope.loginData.correo;
            password_app = $scope.loginData.password;
        }

        function getCamposCuenta(intento) {

            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir + 'campo_user_all',
                {usuario_id: idUsuario}
            );

            var query2 = "INSERT INTO campo (id, nombre, par_hoyo_1, " +
                "par_hoyo_2, par_hoyo_3,par_hoyo_4, par_hoyo_5, par_hoyo_6, " +
                "par_hoyo_7, par_hoyo_8, par_hoyo_9, par_hoyo_10, " +
                "par_hoyo_11, par_hoyo_12, par_hoyo_13, par_hoyo_14, " +
                "par_hoyo_15, par_hoyo_16, par_hoyo_17, par_hoyo_18," +
                "ventaja_hoyo_1, ventaja_hoyo_2, ventaja_hoyo_3, " +
                "ventaja_hoyo_4, ventaja_hoyo_5, ventaja_hoyo_6, " +
                "ventaja_hoyo_7, ventaja_hoyo_8, ventaja_hoyo_9, " +
                "ventaja_hoyo_10, ventaja_hoyo_11, ventaja_hoyo_12, " +
                "ventaja_hoyo_13, ventaja_hoyo_14, ventaja_hoyo_15, " +
                "ventaja_hoyo_16, ventaja_hoyo_17, ventaja_hoyo_18, " +
                "cuenta, seleccionado, usuario_id)" +
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," +
                "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

            $http(httpRequest)
                .then(function successCallback(response) {
                    if (response.data.ok) {

                        deleteAllDatosCuenta();

                        var campos = response.data.campos

                        for (var i = 0; i < campos.length; i++) {

                            $cordovaSQLite.execute(db, query2, [campos[i].id, campos[i].nombre, campos[i].par_hoyo_1, campos[i].par_hoyo_2, campos[i].par_hoyo_3, campos[i].par_hoyo_4, campos[i].par_hoyo_5, campos[i].par_hoyo_6, campos[i].par_hoyo_7, campos[i].par_hoyo_8, campos[i].par_hoyo_9, campos[i].par_hoyo_10, campos[i].par_hoyo_11, campos[i].par_hoyo_12, campos[i].par_hoyo_13, campos[i].par_hoyo_14, campos[i].par_hoyo_15, campos[i].par_hoyo_16, campos[i].par_hoyo_17, campos[i].par_hoyo_18,
                                campos[i].ventaja_hoyo_1, campos[i].ventaja_hoyo_2, campos[i].ventaja_hoyo_3, campos[i].ventaja_hoyo_4, campos[i].ventaja_hoyo_5, campos[i].ventaja_hoyo_6, campos[i].ventaja_hoyo_7, campos[i].ventaja_hoyo_8, campos[i].ventaja_hoyo_9, campos[i].ventaja_hoyo_10, campos[i].ventaja_hoyo_11, campos[i].ventaja_hoyo_12, campos[i].ventaja_hoyo_13, campos[i].ventaja_hoyo_14, campos[i].ventaja_hoyo_15, campos[i].ventaja_hoyo_16, campos[i].ventaja_hoyo_17, campos[i].ventaja_hoyo_18, 1, 0, idUsuario])
                                .then(function (res) {
                                    //popup("INSERT ID -> ", JSON.stringify(res))
                                }, function (err) {
                                    //popup("error", JSON.stringify(err))
                                });
                        }

                        $ionicLoading.hide();
                        utils.popup('Bienvenido a GreenBet',
                            'Ahora puedes crear y compartir partidos');

                        $state.go('inicio');
                    } else {
                        $ionicLoading.hide();
                        utils.popup('Error de Campos',
                            'Error al obtener los campos de la cuenta.');
                    }
                }, function errorCallback(response) {

                    if (response.status == -1) {
                        if (intento < 3) {
                            getCamposCuenta(intento + 1);
                        } else {
                            $ionicLoading.hide();
                            utils.popup("Error de Conexión", "Volver a" +
                                " intentar más tarde");
                        }
                    } else {
                        $ionicLoading.hide();
                        // utils.popup("Error de Parámetros", "Revisar los" +
                        //     " parámetros de la petición HTTP");
                    }
                });
        }

        function deleteAllDatosCuenta() {
            var query = 'DELETE FROM campo WHERE cuenta = 1';
            $cordovaSQLite.execute(db, query);
        }

    });
