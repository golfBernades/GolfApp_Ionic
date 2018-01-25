/**
 * Created by Victor Hugo on 22/03/2017.
 */

angular.module('starter.campos-dispositivo', ['ionic'])

    .controller('camposDispController', function ($scope, $cordovaSQLite, $state,
                                                  $ionicPlatform, $ionicPopup, $rootScope,
                                                  $ionicLoading, $http, $q, servicePantallas,
                                                  serviceHttpRequest, utils) {

        var nombreCampoA = "";
        var countCamposUser;

        var par = [];
        var ventaja = [];
        var modulePromises = [];

        var alertPopupOpcionesCampo = null;

        var campoSeleccionado = false;
        var responseCountCampos = false;
        var responseGetCampo = false;

        $scope.campos = [];
        $scope.select = true;
        $scope.data = {
            clientSide: 'ng'
        };

        $rootScope.idCampoAct = null;
        $rootScope.campos = 1;

        $scope.seleccionarJugadores = function () {
            $state.go('seleccion_jugadores');
        };

        $scope.seleccionarApuestas = function () {
            var selAllCampos = "SELECT id FROM campo";
            var selOneCampo = "SELECT id FROM campo WHERE seleccionado = 2 OR seleccionado = 1";
            $cordovaSQLite.execute(db, selAllCampos).then(function (res) {
                if (res.rows.length > 0) {

                    $cordovaSQLite.execute(db, selOneCampo).then(function (res) {
                        if (res.rows.length > 0) {
                            $state.go('seleccion_apuestas');
                        } else {
                            utils.popup('Selección de campo',
                                'Debes seleccionar un campo para poder avanzar');
                        }
                    })

                } else {
                    utils.popup('Selección de campo',
                        'Debes crear y seleccionar un campo para poder avanzar');
                }
            });
        };

        $scope.seleccionNuevoCampo = function () {
            $rootScope.idCampoAct = null;
            $state.go('nuevo_campo');
        };

        $scope.campoSeleccionado = function (campo) {

            var updateAll = "UPDATE campo SET seleccionado = 0";
            $cordovaSQLite.execute(db, updateAll);

            var actualizaCampoSel = "UPDATE campo SET seleccionado = 1 WHERE id = ?";
            $cordovaSQLite.execute(db, actualizaCampoSel, [campo.id]);

            campoSeleccionado = true;

        };

        $scope.deleteCampo = function() {
            var query = "SELECT * FROM campo WHERE id = (?)";
            $cordovaSQLite.execute(db, query,[$rootScope.idCampoAct]).then(function (res) {
                alertPopupOpcionesCampo.close();
                alertPopupOpcionesCampo = null;
                deleteCampoDispositivo();

            });

        };

        $scope.actualizarCampo = function () {
            alertPopupOpcionesCampo.close();
            $state.go('nuevo_campo')
        };

        $scope.subirCampo = function(){
            alertPopupOpcionesCampo.close();
            utils.showLoading();
            countCampoServer(0);
            $q.all(modulePromises).then(function () {
                modulePromises = [];
                if(responseCountCampos){
                    getCampo();
                    $q.all(modulePromises).then(function () {
                        if(responseGetCampo){
                            insertCampoServer(0)
                        }
                    })
                }
            })
        };

        $scope.popupOpcionesCampo= function(idCampo,nombreCampo,index) {
            $rootScope.idCampoAct = idCampo;
            $scope.nombreCampo = nombreCampo;
            $scope.index = index;

            var query = "SELECT * FROM campo WHERE id = (?) AND cuenta = 0";

            $cordovaSQLite.execute(db, query,[idCampo]).then(function (res) {
                alertOpcionesCampo(nombreCampo,"edit_delete_upload_campo.html");
            });
        };

        function deleteCampoDispositivo() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Eliminar Campo',
                template: 'Estas seguro de eliminar el campo '
                + $scope.nombreCampo +'?',
                okText: 'Eliminar',
                okType: 'button-positive',
                cancelText: 'Cancelar',
                cancelType: 'button-assertive'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    utils.showLoading();
                    var query = 'DELETE FROM campo WHERE id = (?)';
                    $cordovaSQLite.execute(db, query, [$rootScope.idCampoAct])
                        .then(function (res) {
                            $scope.campos.splice($scope.index, 1);
                            $ionicLoading.hide();
                            utils.popup("Campo Eliminado", "El campo se eliminó" +
                                " correctamente");
                        }, function (err) {
                            $ionicLoading.hide();
                            utils.popup("Campo no Eliminado", "Error al eliminar" +
                                " el campo");
                        });

                }

            });
        }

        function getCampos() {

            var query = "SELECT id, nombre, seleccionado, cuenta FROM campo WHERE cuenta = 0  AND usuario_id = (?) ORDER BY nombre ASC";
            $cordovaSQLite.execute(db, query,[id_user_app]).then(function (res) {

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

        function getCampo() {
            var queryCampo = "SELECT * FROM campo WHERE id = (?)";

            var requestGetCampo = $cordovaSQLite.execute(db, queryCampo, [$scope.idCampoAct])
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

                        responseGetCampo = true
                    }else{
                        $ionicLoading.hide();
                        utils.popup('Error de Campo', 'Error al obtener el' +
                            ' campo. Volver a intentar más tarde.');
                    }
                });

            modulePromises.push(requestGetCampo);

        }

        function countCampoServer(intento) {
            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir+'campo_user_next_id',
                {}
            );

            var countCamposRequest = $http(httpRequest)
                .then(function successCallback(response) {

                    if(response.data.ok){
                        countCamposUser = response.data.next_id;
                        responseCountCampos = true;
                    }else{
                        $ionicLoading.hide();
                        responseCountCampos = false;
                    }
                }, function errorCallback(response) {

                    if(response.status == -1){
                        if (intento < 3) {
                            countCampoServer(intento + 1);
                        } else {
                            $ionicLoading.hide();
                            utils.popup("Error de Conexión", "Volver a" +
                                " intentar más tarde");
                            responseCountCampos = false;
                        }
                    }else{
                        $ionicLoading.hide();
                        // utils.popup("Error de Parámetros", "Revisar los" +
                        //     " parámetros de la petición -- HTTP");
                        // utils.popup("Error de Parámetros", JSON.stringify(response));
                        responseCountCampos = false
                    }
                });

            modulePromises.push(countCamposRequest);
        }

        function insertCampoServer(intento) {
            var idCampoServer = id_user_app+"_"+countCamposUser;
            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir+'campo_insert',
                {campo_id:idCampoServer,nombre:nombreCampoA,
                    par_hoyo_1:par[0],par_hoyo_2:par[1],par_hoyo_3:par[2],par_hoyo_4:par[3],par_hoyo_5:par[4],par_hoyo_6:par[5],par_hoyo_7:par[6],par_hoyo_8:par[7],par_hoyo_9:par[8],par_hoyo_10:par[9],
                    par_hoyo_11:par[10],par_hoyo_12:par[11],par_hoyo_13:par[12],par_hoyo_14:par[13],par_hoyo_15:par[14],par_hoyo_16:par[15],par_hoyo_17:par[16],par_hoyo_18:par[17],
                    ventaja_hoyo_1:ventaja[0],ventaja_hoyo_2:ventaja[1],ventaja_hoyo_3:ventaja[2],ventaja_hoyo_4:ventaja[3],ventaja_hoyo_5:ventaja[4],ventaja_hoyo_6:ventaja[5],ventaja_hoyo_7:ventaja[6],ventaja_hoyo_8:ventaja[7],ventaja_hoyo_9:ventaja[8],ventaja_hoyo_10:ventaja[9],
                    ventaja_hoyo_11:ventaja[10],ventaja_hoyo_12:ventaja[11],ventaja_hoyo_13:ventaja[12],ventaja_hoyo_14:ventaja[13],ventaja_hoyo_15:ventaja[14],ventaja_hoyo_16:ventaja[15],ventaja_hoyo_17:ventaja[16],ventaja_hoyo_18:ventaja[17], email: user_app, password: password_app}
            );

            $http(httpRequest)
                .then(function successCallback(response) {
                    $ionicLoading.hide();
                    if (response.data.ok) {

                        actualizarCampo(response.data.campo_id,1);
                        $scope.campos.splice($scope.index, 1);

                        utils.popup('Campo Guardado', 'El campo se guardó' +
                            ' correctamente en la cuenta');

                    } else {
                        utils.popup('Error del Campo', 'No se pudo guardar' +
                            ' el campo, volver a intentar más tarde');
                    }
                }, function errorCallback(response) {

                    if(response.status == -1){
                        if (intento < 3) {
                            insertCampoServer(intento + 1);
                        } else {
                            $ionicLoading.hide();
                            utils.popup("Error de Conexión", "Volver a" +
                                " intentar más tarde");
                        }
                    }else{
                        $ionicLoading.hide();
                        // utils.popup("Error de Parámetros", "Revisar los" +
                        //     " parámetros de la petición HTTP");
                        // utils.popup("ERROR", JSON.stringify(response));
                    }
                });
        }

        function actualizarCampo(idCampo,cuenta) {
            var query = "UPDATE campo SET id = ?, cuenta = ? WHERE id = ?";
            $cordovaSQLite.execute(db, query, [idCampo,cuenta,$rootScope.idCampoAct]);
        }

        function alertOpcionesCampo(nombreCampo, url) {
            alertPopupOpcionesCampo = $ionicPopup.alert({
                templateUrl: 'templates/'+url,
                title: 'Campo: '+nombreCampo,
                scope: $scope,
                okText:'Cancelar',
                okType:'button-assertive'
            });
        }

        $ionicPlatform.ready(function () {
            servicePantallas.savePantalla(3);
            getCampos();
        });

    });
