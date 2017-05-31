/**
 * Created by Victor Hugo on 22/03/2017.
 */

angular.module('starter.seleccion-campo', ['ionic'])

    .controller('ctrlCampo', function ($scope, $cordovaSQLite, $state, $ionicPlatform, $ionicPopup) {

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
                                    alertNoCampoSelec();
                                }
                            })

                        } else {
                            alertNoCampos();
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

        function alertNoCampoSelec() {
            var alertPopup = $ionicPopup.alert({
                title: 'Campo no seleccionado!',
                template: 'Para avanzar debes seleccionar un campo.'
            });
        };

        function alertNoCampos() {
            var alertPopup = $ionicPopup.alert({
                title: 'Campo no seleccionado!',
                template: 'Para avanzar debes crear y seleccionar un campo. '
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
