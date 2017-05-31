/**
 * Created by Victor Hugo on 23/03/2017.
 */

angular.module('starter.nuevo-campo', ['ionic'])

    .controller('campoCtrl', function ($scope, $ionicPopup, $state, $cordovaSQLite, $timeout, $ionicLoading) {

        var campo = null;
        var par = [];
        var ventaja = [];

        $scope.guardarPantallaNuevoCampo = function (seleccion) {

            var pantalla = "UPDATE pantalla SET pantalla = ? WHERE id = 1";
            switch (seleccion) {
                case 3:
                    vaciarCampos();
                    $cordovaSQLite.execute(db, pantalla, [3]);
                    $state.go('seleccion_campo')
                    break;
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

            var ok = true;
            if (nombreCampo == "") {
                document.getElementById("nombreCampoNuevo").style.backgroundColor = "#F5A9A9";
                ok = false;
            } else {
                if (par.length != 18 || ventaja.length != 18) {
                    ok = false;
                    par = [];
                    ventaja = [];
                } else {
                    ok = true;
                }
            }

            if (!ok) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Datos incompletos!',
                    template: 'No puedes dejar campos vacios.',
                    okType: 'button-balanced'
                });
            } else {

                var query = "INSERT INTO campo (nombre, par_hoyo_1, par_hoyo_2, par_hoyo_3,par_hoyo_4, par_hoyo_5, par_hoyo_6, par_hoyo_7, par_hoyo_8, par_hoyo_9, par_hoyo_10, par_hoyo_11, par_hoyo_12, par_hoyo_13, par_hoyo_14, par_hoyo_15, par_hoyo_16, par_hoyo_17, par_hoyo_18," +
                    "ventaja_hoyo_1, ventaja_hoyo_2, ventaja_hoyo_3, ventaja_hoyo_4, ventaja_hoyo_5, ventaja_hoyo_6, ventaja_hoyo_7, ventaja_hoyo_8, ventaja_hoyo_9, ventaja_hoyo_10, ventaja_hoyo_11, ventaja_hoyo_12, ventaja_hoyo_13, ventaja_hoyo_14, ventaja_hoyo_15, ventaja_hoyo_16, ventaja_hoyo_17, ventaja_hoyo_18, seleccionado)" +
                    "VALUES (?,?,?,?,? ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                $cordovaSQLite.execute(db, query, [nombreCampo, par[0], par[1], par[2], par[3], par[4], par[5], par[6], par[7], par[8], par[9], par[10], par[11], par[12], par[13], par[14], par[15], par[16], par[17],
                    ventaja[0], ventaja[1], ventaja[2], ventaja[3], ventaja[4], ventaja[5], ventaja[6], ventaja[7], ventaja[8], ventaja[9], ventaja[10], ventaja[11], ventaja[12], ventaja[13], ventaja[14], ventaja[15], ventaja[16], ventaja[17], 0])
                    .then(function (res) {
                        console.log("INSERT ID -> " + res.insertId);

                    }, function (err) {
                        console.error(err);
                    });


                $timeout(function () {
                    $state.go('seleccion_campo', {}, {reload: true});
                }, 1000);
                vaciarCampos();
            }

        };

        function vaciarCampos() {

            par = [];
            ventaja = [];

            document.getElementById("nombreCampoNuevo").value = "";
            for (var i = 1; i < 19; i++) {
                document.getElementById("par" + i).value = "";
                document.getElementById("ven" + i).value = "";
            }
        };

    });
