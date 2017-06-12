/**
 * Created by Victor Hugo on 22/03/2017.
 */

angular.module('starter.campos-dispositivo', ['ionic'])

    .controller('camposDispController', function ($scope, $cordovaSQLite, $state,
                                                  $ionicPlatform, $ionicPopup, $rootScope,
                                                  $ionicLoading) {

        var campoSeleccionado = false;
        var par = [];
        var ventaja = [];
        var nombreCampoA = "";
        var emailUser="";
        var passwordUser="";

        $scope.campos = [];
        $scope.select = true;
        $scope.data = {
            clientSide: 'ng'
        };
        var alertPopupOpcionesCampo = null;

        function popuAlert(title, template) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: template
            });
        };

        function getCampos() {
            var par = [];
            var ventaja = [];

            var query = "SELECT id, nombre, seleccionado FROM campo";
            $cordovaSQLite.execute(db, query).then(function (res) {

                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        if (res.rows.item(i).seleccionado == 0) {
                            $scope.campos.push({
                                id: res.rows.item(i).id,
                                nombre: res.rows.item(i).nombre,
                                seleccionado: false
                            });
                        } else {
                            $scope.campos.push({
                                id: res.rows.item(i).id,
                                nombre: res.rows.item(i).nombre,
                                seleccionado: true
                            });
                            campoSeleccionado = true;
                        }
                    }
                }
            });
        }

        $scope.guardarPantallaSeleccionCampo = function (seleccion) {

            var pantalla = "UPDATE pantalla SET pantalla = ? WHERE id = 1";
            switch (seleccion) {

                case 2:
                    $cordovaSQLite.execute(db, pantalla, [2]);
                    $state.go('seleccion_jugadores');
                    break;

                case 4:

                    var selAllCampos = "SELECT id FROM campo";
                    var selOneCampo = "SELECT id FROM campo WHERE seleccionado = 1";
                    $cordovaSQLite.execute(db, selAllCampos).then(function (res) {
                        if (res.rows.length > 0) {

                            $cordovaSQLite.execute(db, selOneCampo).then(function (res) {
                                if (res.rows.length > 0) {
                                    $cordovaSQLite.execute(db, pantalla, [4]);
                                    $state.go('seleccion_apuestas');
                                } else {
                                    popuAlert('Campo no seleccionado!','Para avanzar debes seleccionar un campo.')
                                }
                            })

                        } else {
                            popuAlert('Campo no seleccionado!','Para avanzar debes crear y seleccionar un campo. ')
                        }
                    });
                    break;

                case 5:
                    $cordovaSQLite.execute(db, pantalla, [5]);
                    $rootScope.idCampoAct = null;
                    $state.go('nuevo_campo')
                    break;
            }

        };

        $scope.campoSeleccionado = function (campo) {

            var updateAll = "UPDATE campo SET seleccionado = 0";
            $cordovaSQLite.execute(db, updateAll);

            var actualizaCampoSel = "UPDATE campo SET seleccionado = 1 WHERE id = ?";
            $cordovaSQLite.execute(db, actualizaCampoSel, [campo.id]);

            campoSeleccionado = true;

        };

        $scope.deleteCampo = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Eliminar campo',
                template: 'Estas seguro de elimnar el campo '+$scope.nombreCampo+'?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    var query = "DELETE FROM campo WHERE id = (?)";
                    $cordovaSQLite.execute(db, query, [$rootScope.idCampoAct]).then(function (res) {
                        alertPopupOpcionesCampo.close()
                        $scope.campos.splice($scope.index, 1);
                    });
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.actualizarCampo = function () {
            alertPopupOpcionesCampo.close();
            $state.go('nuevo_campo')
        };

        function getCampo() {
            var queryCampo = "SELECT * FROM campo WHERE id = (?)";

            $cordovaSQLite.execute(db, queryCampo, [$scope.idCampoAct])
                .then(function (res) {
                    if (res.rows.length > 0) {

                        nombreCampoA = res.rows.item(0).nombre;

                        par.push(res.rows.item(0).par_hoyo_1);
                        par.push(res.rows.item(0).par_hoyo_2);
                        par.push(res.rows.item(0).par_hoyo_3);
                        par.push(res.rows.item(0).par_hoyo_4);
                        par.push(res.rows.item(0).par_hoyo_5);
                        par.push(res.rows.item(0).par_hoyo_6);
                        par.push(res.rows.item(0).par_hoyo_7);
                        par.push(res.rows.item(0).par_hoyo_8);
                        par.push(res.rows.item(0).par_hoyo_9);
                        par.push(res.rows.item(0).par_hoyo_10);
                        par.push(res.rows.item(0).par_hoyo_11);
                        par.push(res.rows.item(0).par_hoyo_12);
                        par.push(res.rows.item(0).par_hoyo_13);
                        par.push(res.rows.item(0).par_hoyo_14);
                        par.push(res.rows.item(0).par_hoyo_15);
                        par.push(res.rows.item(0).par_hoyo_16);
                        par.push(res.rows.item(0).par_hoyo_17);
                        par.push(res.rows.item(0).par_hoyo_18);

                        ventaja.push(res.rows.item(0).ventaja_hoyo_1);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_2);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_3);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_4);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_5);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_6);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_7);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_8);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_9);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_10);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_11);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_12);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_13);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_14);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_15);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_16);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_17);
                        ventaja.push(res.rows.item(0).ventaja_hoyo_18);

                    }else{
                        console.log("error")
                    }
                });
        }

        function getUser() {
            var queryUser = "SELECT * FROM user";
            $cordovaSQLite.execute(db, queryUser).then(function (res) {

                emailUser = res.rows.item(0).email;
                passwordUser = res.rows.item(0).password;

            });
        }

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

        function countCampoServer() {
            var httpRequest = createPostHttpRequest(
                dir+'campo_user_count',
                {}
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

        function insertCampoServer() {
            var httpRequest = createPostHttpRequest(
                dir+'campo_insert',
                {id:$rootScope.idCampoAct,nombre:nombreCampoA,
                    par_hoyo_1:par[0],par_hoyo_2:par[1],par_hoyo_3:par[2],par_hoyo_4:par[3],par_hoyo_5:par[4],par_hoyo_6:par[5],par_hoyo_7:par[6],par_hoyo_8:par[7],par_hoyo_9:par[8],par_hoyo_10:par[9],
                    par_hoyo_11:par[10],par_hoyo_12:par[11],par_hoyo_13:par[12],par_hoyo_14:par[13],par_hoyo_15:par[14],par_hoyo_16:par[15],par_hoyo_17:par[16],par_hoyo_18:par[17],
                    ventaja_hoyo_1:ventaja[0],ventaja_hoyo_2:ventaja[1],ventaja_hoyo_3:ventaja[2],ventaja_hoyo_4:ventaja[3],ventaja_hoyo_5:ventaja[4],ventaja_hoyo_6:ventaja[5],ventaja_hoyo_7:ventaja[6],ventaja_hoyo_8:ventaja[7],ventaja_hoyo_9:ventaja[8],ventaja_hoyo_10:ventaja[9],
                    ventaja_hoyo_11:ventaja[10],ventaja_hoyo_12:ventaja[11],ventaja_hoyo_13:ventaja[12],ventaja_hoyo_14:ventaja[13],ventaja_hoyo_15:ventaja[14],ventaja_hoyo_16:ventaja[15],ventaja_hoyo_17:ventaja[16],ventaja_hoyo_18:ventaja[17], email: emailUser, password: passwordUser}
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

        function subirCampo (intento) {
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

        }

        $rootScope.idCampoAct = null;

        $scope.popupOpcionesCampo= function(idCampo,nombreCampo,index) {

            $rootScope.idCampoAct = idCampo;
            $scope.nombreCampo = nombreCampo;
            $scope.index = index;
            alertPopupOpcionesCampo = $ionicPopup.alert({
                templateUrl: 'templates/edit_delete_campo.html',
                title: 'Campo: '+nombreCampo,
                scope: $scope,
                okText:'Cancelar',
                okType:'button-balanced'
            });
        };

        $ionicPlatform.ready(function () {
            getCampos();
        });




    });
