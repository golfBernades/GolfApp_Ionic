/**
 * Created by Victor Hugo on 23/03/2017.
 */

angular.module('starter.nuevo-campo', ['ionic'])

    .controller('nuevoCampoController', function ($scope, $ionicPopup, $state,
                                                  $cordovaSQLite, $timeout,
                                                  $ionicPlatform, $rootScope,
                                                  $ionicLoading, $http,
                                                  servicePantallas,
                                                  serviceHttpRequest, utils) {
        var campo = null;
        var isUpdateCampo = false;
        var par = [];
        var ventaja = [];
        var nombresCampos = [];
        var nomCampo;
        var cuenta;

        $scope.statusCampo = "";

        $scope.seleccionarCampo = function () {
            if ($rootScope.campos == 1) {
                $state.go('tabs.camp-dis')
            } else {
                $state.go('tabs.camp-cue')
            }
        };

        $scope.guardarCampo = function () {
            document.getElementById("nombreCampoNuevo").style.backgroundColor = "#FFFFFF";

            for (var i = 1; i < 19; i++) {
                document.getElementById("par" + i).style.backgroundColor = "#FFFFFF";
                document.getElementById("ven" + i).style.backgroundColor = "#FFFFFF";

                var parX = document.getElementById("par" + i).value;
                var venX = document.getElementById("ven" + i).value;

                if (parX == "") {
                    document.getElementById("par" + i).style.backgroundColor = "#F5A9A9";
                } else {
                    par.push(parX);
                }
                if (venX == "") {
                    document.getElementById("ven" + i).style.backgroundColor = "#F5A9A9";
                } else {
                    ventaja.push(venX);
                }
            }

            var nombreCampo = document.getElementById("nombreCampoNuevo").value;

            var control = true;
            var ok = true;

            if (nombreCampo == "") {
                document.getElementById("nombreCampoNuevo").style.backgroundColor = "#F5A9A9";
                ok = false;

                par = [];
                ventaja = [];
            }
            if (par.length != 18 || ventaja.length != 18) {
                ok = false;

                par = [];
                ventaja = [];
            }

            if (!ok) {

                utils.popup("Datos incompletos", "No puedes dejar datos" +
                    " vacíos.")

            } else {

                if ($rootScope.idCampoAct != null) {
                    if (nomCampo.toLowerCase() != nombreCampo.toLowerCase()) {
                        for (var j = 0; j < nombresCampos.length; j++) {
                            if (nombreCampo.toLowerCase() == nombresCampos[j].toLowerCase()) {
                                control = false;
                                break;
                            }
                        }
                    } else {
                        control = true;
                    }
                } else {
                    for (var j = 0; j < nombresCampos.length; j++) {
                        if (nombreCampo.toLowerCase() == nombresCampos[j].toLowerCase()) {
                            control = false;
                            break;
                        }
                    }
                }

                if (control) {
                    utils.showLoading();
                    if (isUpdateCampo) {
                        if (cuenta == 0) {
                            updateCampo(nombreCampo, 0);
                        } else {
                            updateCampoServer(0, nombreCampo)
                        }
                    } else {
                        insertCampo(nombreCampo);
                    }

                } else {
                    document.getElementById("nombreCampoNuevo").style.backgroundColor = "#F5A9A9";
                    utils.popup("Campo repetido", "Nombre de campo repetido." +
                        " Escribir otro nombre.");
                    par = [];
                    ventaja = [];
                }
            }

        };

        function insertCampo(nombreCampo) {
            var fecha = new Date();
            var idCampo = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();

            var query2 = "INSERT INTO campo (id, nombre, par_hoyo_1, " +
                "par_hoyo_2, par_hoyo_3,par_hoyo_4, par_hoyo_5, par_hoyo_6, " +
                "par_hoyo_7, par_hoyo_8, par_hoyo_9, par_hoyo_10," +
                " par_hoyo_11, par_hoyo_12, par_hoyo_13, par_hoyo_14, " +
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

            $cordovaSQLite.execute(db, query2, [idCampo, nombreCampo, par[0],
                par[1], par[2], par[3], par[4], par[5], par[6], par[7], par[8],
                par[9], par[10], par[11], par[12], par[13], par[14], par[15],
                par[16], par[17], ventaja[0], ventaja[1], ventaja[2],
                ventaja[3], ventaja[4], ventaja[5], ventaja[6], ventaja[7],
                ventaja[8], ventaja[9], ventaja[10], ventaja[11], ventaja[12],
                ventaja[13], ventaja[14], ventaja[15], ventaja[16],
                ventaja[17], 0, 0, id_user_app])
                .then(function (res) {
                    vaciarCampos();
                    $ionicLoading.hide();
                    utils.popup("Campo Guardado", "Campo Guardado Correctamente.");
                    $state.go('tabs.camp-dis');
                }, function (err) {
                    $ionicLoading.hide();
                    utils.popup("Campo No Guardado", "Campo NO Guardado. Volver a intentar más tarde.");
                });
        }

        function updateCampo(nombreCampo, cuenta) {
            var query = "UPDATE campo SET nombre = ?, par_hoyo_1 = ?, " +
                "par_hoyo_2 = ?, par_hoyo_3 = ?, par_hoyo_4 = ?, " +
                "par_hoyo_5 = ?, par_hoyo_6 = ?, par_hoyo_7 = ?, " +
                "par_hoyo_8 = ?, par_hoyo_9 = ?, par_hoyo_10 = ?, " +
                "par_hoyo_11 = ?, par_hoyo_12 = ?, par_hoyo_13 = ?, " +
                "par_hoyo_14 = ?, par_hoyo_15 = ?, par_hoyo_16 = ?, " +
                "par_hoyo_17 = ?, par_hoyo_18= ?, " + "ventaja_hoyo_1 = ?, " +
                "ventaja_hoyo_2 = ?, ventaja_hoyo_3 = ?, ventaja_hoyo_4 = ?, " +
                "ventaja_hoyo_5 = ?, ventaja_hoyo_6 = ?, ventaja_hoyo_7 = ?, " +
                "ventaja_hoyo_8 = ?, ventaja_hoyo_9 = ?, " +
                "ventaja_hoyo_10 = ?, ventaja_hoyo_11 = ?, " +
                "ventaja_hoyo_12 = ?, ventaja_hoyo_13 = ?, " +
                "ventaja_hoyo_14 = ?, ventaja_hoyo_15 = ?, " +
                "ventaja_hoyo_16 = ?, ventaja_hoyo_17 = ?, " +
                "ventaja_hoyo_18 = ?, cuenta = ?, seleccionado = ? " +
                "WHERE id = ?";

            $cordovaSQLite.execute(db, query, [nombreCampo, par[0], par[1],
                par[2], par[3], par[4], par[5], par[6], par[7], par[8], par[9],
                par[10], par[11], par[12], par[13], par[14], par[15], par[16],
                par[17], ventaja[0], ventaja[1], ventaja[2], ventaja[3],
                ventaja[4], ventaja[5], ventaja[6], ventaja[7], ventaja[8],
                ventaja[9], ventaja[10], ventaja[11], ventaja[12], ventaja[13],
                ventaja[14], ventaja[15], ventaja[16], ventaja[17], cuenta, 0,
                $rootScope.idCampoAct])
                .then(function (res) {
                    vaciarCampos();

                    $ionicLoading.hide();
                    utils.popup("Campo Actualizado", "Campo Actualizado Correctamente.");

                    if ($rootScope.campos == 1) {
                        $state.go('tabs.camp-dis')
                    } else {
                        $state.go('tabs.camp-cue')
                    }

                }, function (err) {
                    $ionicLoading.hide();
                    utils.popup("Campo No Actualizado", "Campo NO Actualizado. Volver a intentar más tarde.");
                });
        }

        function vaciarCampos() {
            par = [];
            ventaja = [];

            document.getElementById("nombreCampoNuevo").value = "";
            for (var i = 1; i < 19; i++) {
                document.getElementById("par" + i).value = "";
                document.getElementById("ven" + i).value = "";
            }
        }

        function getCampos() {
            var query = "SELECT nombre FROM campo";
            $cordovaSQLite.execute(db, query).then(function (res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        nombresCampos.push(res.rows.item(i).nombre);
                    }
                }
            });
        }

        function isUpadate() {
            if ($rootScope.idCampoAct != null) {
                utils.showLoading();

                isUpdateCampo = true;
                getCampo();

                $scope.statusCampo = "Actualizar Campo";
            } else {
                $scope.statusCampo = "Crear Campo";
            }
        }

        function getCampo() {
            var queryCampo = "SELECT * FROM campo WHERE id = (?)";

            $cordovaSQLite.execute(db, queryCampo, [$rootScope.idCampoAct])
                .then(function (res) {
                    if (res.rows.length > 0) {

                        nomCampo = res.rows.item(0).nombre;
                        cuenta = res.rows.item(0).cuenta;

                        document.getElementById("nombreCampoNuevo").value = res.rows.item(0).nombre;

                        document.getElementById("par1").value = res.rows.item(0).par_hoyo_1;
                        document.getElementById("par2").value = res.rows.item(0).par_hoyo_2;
                        document.getElementById("par3").value = res.rows.item(0).par_hoyo_3;
                        document.getElementById("par4").value = res.rows.item(0).par_hoyo_4;
                        document.getElementById("par5").value = res.rows.item(0).par_hoyo_5;
                        document.getElementById("par6").value = res.rows.item(0).par_hoyo_6;
                        document.getElementById("par7").value = res.rows.item(0).par_hoyo_7;
                        document.getElementById("par8").value = res.rows.item(0).par_hoyo_8;
                        document.getElementById("par9").value = res.rows.item(0).par_hoyo_9;
                        document.getElementById("par10").value = res.rows.item(0).par_hoyo_10;
                        document.getElementById("par11").value = res.rows.item(0).par_hoyo_11;
                        document.getElementById("par12").value = res.rows.item(0).par_hoyo_12;
                        document.getElementById("par13").value = res.rows.item(0).par_hoyo_13;
                        document.getElementById("par14").value = res.rows.item(0).par_hoyo_14;
                        document.getElementById("par15").value = res.rows.item(0).par_hoyo_15;
                        document.getElementById("par16").value = res.rows.item(0).par_hoyo_16;
                        document.getElementById("par17").value = res.rows.item(0).par_hoyo_17;
                        document.getElementById("par18").value = res.rows.item(0).par_hoyo_18;

                        document.getElementById("ven1").value = res.rows.item(0).ventaja_hoyo_1;
                        document.getElementById("ven2").value = res.rows.item(0).ventaja_hoyo_2;
                        document.getElementById("ven3").value = res.rows.item(0).ventaja_hoyo_3;
                        document.getElementById("ven4").value = res.rows.item(0).ventaja_hoyo_4;
                        document.getElementById("ven5").value = res.rows.item(0).ventaja_hoyo_5;
                        document.getElementById("ven6").value = res.rows.item(0).ventaja_hoyo_6;
                        document.getElementById("ven7").value = res.rows.item(0).ventaja_hoyo_7;
                        document.getElementById("ven8").value = res.rows.item(0).ventaja_hoyo_8;
                        document.getElementById("ven9").value = res.rows.item(0).ventaja_hoyo_9;
                        document.getElementById("ven10").value = res.rows.item(0).ventaja_hoyo_10;
                        document.getElementById("ven11").value = res.rows.item(0).ventaja_hoyo_11;
                        document.getElementById("ven12").value = res.rows.item(0).ventaja_hoyo_12;
                        document.getElementById("ven13").value = res.rows.item(0).ventaja_hoyo_13;
                        document.getElementById("ven14").value = res.rows.item(0).ventaja_hoyo_14;
                        document.getElementById("ven15").value = res.rows.item(0).ventaja_hoyo_15;
                        document.getElementById("ven16").value = res.rows.item(0).ventaja_hoyo_16;
                        document.getElementById("ven17").value = res.rows.item(0).ventaja_hoyo_17;
                        document.getElementById("ven18").value = res.rows.item(0).ventaja_hoyo_18;

                        $ionicLoading.hide();
                    } else {
                        $ionicLoading.hide();
                        utils.popup("Error de Campo", "Error al obtener el Campo. Volver a intentar más tarde.");
                    }
                });
        }

        function updateCampoServer(intento, nombreCampo) {
            var httpRequest = serviceHttpRequest.createPutHttpRequest(
                dir + 'campo_update',
                {
                    campo_id: $rootScope.idCampoAct,
                    nombre: nombreCampo,
                    par_hoyo_1: par[0],
                    par_hoyo_2: par[1],
                    par_hoyo_3: par[2],
                    par_hoyo_4: par[3],
                    par_hoyo_5: par[4],
                    par_hoyo_6: par[5],
                    par_hoyo_7: par[6],
                    par_hoyo_8: par[7],
                    par_hoyo_9: par[8],
                    par_hoyo_10: par[9],
                    par_hoyo_11: par[10],
                    par_hoyo_12: par[11],
                    par_hoyo_13: par[12],
                    par_hoyo_14: par[13],
                    par_hoyo_15: par[14],
                    par_hoyo_16: par[15],
                    par_hoyo_17: par[16],
                    par_hoyo_18: par[17],
                    ventaja_hoyo_1: ventaja[0],
                    ventaja_hoyo_2: ventaja[1],
                    ventaja_hoyo_3: ventaja[2],
                    ventaja_hoyo_4: ventaja[3],
                    ventaja_hoyo_5: ventaja[4],
                    ventaja_hoyo_6: ventaja[5],
                    ventaja_hoyo_7: ventaja[6],
                    ventaja_hoyo_8: ventaja[7],
                    ventaja_hoyo_9: ventaja[8],
                    ventaja_hoyo_10: ventaja[9],
                    ventaja_hoyo_11: ventaja[10],
                    ventaja_hoyo_12: ventaja[11],
                    ventaja_hoyo_13: ventaja[12],
                    ventaja_hoyo_14: ventaja[13],
                    ventaja_hoyo_15: ventaja[14],
                    ventaja_hoyo_16: ventaja[15],
                    ventaja_hoyo_17: ventaja[16],
                    ventaja_hoyo_18: ventaja[17],
                    email: user_app,
                    password: password_app
                }
            );

            $http(httpRequest)
                .then(function successCallback(response) {
                    if (response.data.ok) {
                        updateCampo(nombreCampo, 1);
                    } else {
                        $ionicLoading.hide();
                        utils.popup("Campo No Actualizado", "Campo NO Actualizado. Volver a intentar más tarde.");
                    }
                }, function errorCallback(response) {

                    if (response.status == -1) {
                        if (intento < 3) {
                            updateCampoServer(intento + 1, nombreCampo);
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

        $ionicPlatform.ready(function () {
            getCampos();
            isUpadate();
        });
    });
