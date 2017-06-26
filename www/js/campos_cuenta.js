/**
 * Created by Victor Hugo on 11/06/2017.
 */

angular.module('starter.campos-cuenta', ['ionic'])

.controller('camposCuenController', function ($scope, $state, $cordovaSQLite,
                                              $ionicPlatform, $ionicPopup, $rootScope,
                                              $http,$ionicLoading,servicePantallas,
                                              serviceHttpRequest,utils) {

    var campoSeleccionado = false;
    var alertPopupOpcionesCampo = null;

    $scope.campos = [];
    $scope.select = true;
    $scope.data = {
        clientSide: 'ng'
    };

    $rootScope.idCampoAct = null;
    $rootScope.campos = 2;


    $scope.seleccionaJugadores = function () {
        $state.go('seleccion_jugadores');
    };

    $scope.seleccionaApuestas = function () {
        var selAllCampos = "SELECT id FROM campo";
        var selOneCampo = "SELECT id FROM campo WHERE seleccionado = 1";
        $cordovaSQLite.execute(db, selAllCampos).then(function (res) {
            if (res.rows.length > 0) {

                $cordovaSQLite.execute(db, selOneCampo).then(function (res) {
                    if (res.rows.length > 0) {
                        $state.go('seleccion_apuestas');
                    } else {
                        utils.popup('Campo no seleccionado!','Para avanzar debes seleccionar un campo.')
                    }
                })

            } else {
                utils.popup('Campo no seleccionado!','Para avanzar debes crear y seleccionar un campo. ')
            }
        });
    };

    $scope.campoSeleccionado = function (campo) {

        var updateAll = "UPDATE campo SET seleccionado = 0";
        $cordovaSQLite.execute(db, updateAll);

        var actualizaCampoSel = "UPDATE campo SET seleccionado = 1 WHERE id = ?";
        $cordovaSQLite.execute(db, actualizaCampoSel, [campo.id]);

        campoSeleccionado = true;

    };

    $scope.popupOpcionesCampo= function(idCampo,nombreCampo,index) {

        $rootScope.idCampoAct = idCampo;
        $scope.nombreCampo = nombreCampo;
        $scope.index = index;

        var query = "SELECT * FROM campo WHERE id = (?) AND cuenta = 0";
        $cordovaSQLite.execute(db, query,[idCampo]).then(function (res) {

            alertOpcionesCampo(nombreCampo,"edit_delete_campo.html");

        });

    };

    $scope.actualizar = function () {
        alertPopupOpcionesCampo.close();
        $state.go('nuevo_campo')
    };

    $scope.eliminar = function() {

        var query = "SELECT * FROM campo WHERE id = (?) AND cuenta = 0";
        $cordovaSQLite.execute(db, query,[$rootScope.idCampoAct]).then(function (res) {
            alertPopupOpcionesCampo.close();
            alertPopupOpcionesCampo = null;
            confirmDeleteCampoDispositivoCuenta()

        });

    };

    function confirmDeleteCampoDispositivoCuenta() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Eliminar Campo',
            template: 'Estas seguro de eliminar el campo ' + $scope.nombreCampo+'?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                utils.showLoading();
                deleteCampoDispositivoCuenta(0);
            }

        });
    }

    function deleteCampoDispositivoCuenta(intento) {
        var httpRequest = serviceHttpRequest.createDelHttpRequest(
            dir+'campo_delete',
            {campo_id:$rootScope.idCampoAct ,email:user_app , password: password_app}
        );

        $http(httpRequest)
            .then(function successCallback(response) {

                $ionicLoading.hide();

                if(response.data.ok){

                    var query = 'DELETE FROM campo WHERE id = (?)';
                    $cordovaSQLite.execute(db, query, [$rootScope.idCampoAct]);
                    $scope.campos.splice($scope.index, 1);


                    utils.popup("Campo Eliminado","Campo eliminado correctamente de la cuenta.");
                }else{
                    utils.popup("Campo No Eliminado","Campo pudo ser eliminaado. Volverlo a intentar más tarde.");
                }
            }, function errorCallback(response) {

                if(response.status == -1){
                    if (intento < 3) {
                        deleteCampoDispositivoCuenta(intento + 1);
                    } else {
                        $ionicLoading.hide();
                        utils.popup("Error de Conexión","Error de Conexión. Volverlo a intentar más tarde.");
                    }
                }else{
                    $ionicLoading.hide();
                    utils.popup("Error de Parámetros","Error de Parámetros incorrectos. Volverlo a intentar más tarde.");
                }
            });
    }

    function alertOpcionesCampo(nombreCampo, url) {
        alertPopupOpcionesCampo = $ionicPopup.alert({
            templateUrl: 'templates/'+url,
            title: 'Campo: '+nombreCampo,
            scope: $scope,
            okText:'Cancelar',
            okType:'button-balanced'
        });
    }

    function getCampos() {

        var query = "SELECT id, nombre, seleccionado FROM campo WHERE cuenta = 1 AND usuario_id = (?) ORDER BY nombre ASC";
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

    $ionicPlatform.ready(function () {
        getCampos();
    });

});
