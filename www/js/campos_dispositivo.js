/**
 * Created by Victor Hugo on 22/03/2017.
 */

angular.module('starter.campos-dispositivo', ['ionic'])

    .controller('camposDispController', function ($scope, $cordovaSQLite, $state, $ionicPlatform, $ionicPopup) {

        var campoSeleccionado = false;
        $scope.campos = [];
        $scope.select = true;
        $scope.data = {
            clientSide: 'ng'
        };

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

        function popuAlert(title, template) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: template
            });
        };

        $scope.deleteCampo = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Eliminar campo',
                template: 'Estas seguro de elimnar el campo '+$scope.nombreCampo+'?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    var query = "DELETE FROM campo WHERE id = (?)";
                    $cordovaSQLite.execute(db, query, [$scope.idCampo]).then(function (res) {
                        alertPopupOpcionesCampo.close()
                        $scope.campos.splice($scope.index, 1);
                    });
                } else {
                    console.log('You are not sure');
                }
            });
        };

        var alertPopupOpcionesCampo = null;
        $scope.popupOpcionesCampo= function(idCampo,nombreCampo,index) {

            $scope.idCampo = idCampo;
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

        $ionicPlatform.ready(function () {
            getCampos();
        });




    });
