angular.module('starter.seleccion-apuestas', ['ionic'])

    .controller('apuestasController', function ($scope, $cordovaSQLite, $state,
                                                $ionicPlatform, $ionicPopup, $rootScope, servicePantallas) {
        var valor;

        $scope.apuestas = [];

        $scope.guardarPantallaApuestas = function (seleccion) {

            switch (seleccion) {
                case 3:
                    if($rootScope.campos == 1){
                        $state.go('tabs.camp-dis')
                    }else{
                        $state.go('tabs.camp-cue')
                    }

                    break;

                case 6:

                    var selOneCampo = "SELECT id FROM apuesta WHERE seleccionada = 1";
                    $cordovaSQLite.execute(db, selOneCampo).then(function (res) {
                        if (res.rows.length > 0) {
                            getCampoSeleccionado();
                            $state.go('juego');

                        } else {
                            alertNoApuestaSelec();
                        }
                    });

                    break;

            }
        };

        $scope.apuestaSeleccionada = function (apuesta) {

            var selectApuestas = "SELECT seleccionada FROM apuesta WHERE id = ?";
            $cordovaSQLite.execute(db, selectApuestas, [apuesta.id]).then(function (res) {

                if (res.rows.item(0).seleccionada == 0) {
                    valor = 1
                } else {
                    valor = 0
                }
                var updateSeleccion = "UPDATE apuesta SET seleccionada = ? WHERE id = ?";
                $cordovaSQLite.execute(db, updateSeleccion, [valor, apuesta.id]);

            });
        };

        function alertNoApuestaSelec() {
            var alertPopup = $ionicPopup.alert({
                title: 'Apuesta no seleccionada!',
                template: 'Para avanzar debes seleccionar una o mas apuestas.'
            });
        }

        function getCampoSeleccionado() {
            var idCampo = "";

            var campoSel = "SELECT id FROM campo WHERE seleccionado = 1";
            $cordovaSQLite.execute(db, campoSel).then(function (res) {
                if (res.rows.length > 0) {
                    idCampo = res.rows.item(0).id;
                }
            });

            setTimeout(function () {
                crearPartido(idCampo);
            }, 200)
        }

        function crearPartido(campo_id) {
            var fecha = new Date();

            var inicioJuego = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();

            // console.log(inicioJuego + " " + " " + campo_id + ".............");
            var guardarPartido = "INSERT INTO partido (clave_consulta, clave_edicion, inicio, campo_id) VALUES (?,?,?,?)";

            $cordovaSQLite.execute(db, guardarPartido, ["9999", "9999", inicioJuego, campo_id])
                .then(function (res) {

                }, function (err) {
                    console.log(err);
                });


            $cordovaSQLite.execute(db, "select * from partido")
                .then(function (res) {

                    for (var i = 0; i < res.rows.length; i++) {
                        console.log(res.rows.item(i).id + " ID PARTIDO")
                    }
                }, function (err) {
                    console.log(err);
                    console.log("error");
                });

        }

        function getApuestas() {
            setTimeout(function () {
                var query = "SELECT * FROM apuesta";
                $cordovaSQLite.execute(db, query).then(function (result) {
                    if (result.rows.length > 0) {
                        for (var i = 0; i < result.rows.length; i++) {
                            if (result.rows.item(i).seleccionada == 0) {

                                $scope.apuestas.push(new Apuesta(result.rows.item(i).id, result.rows.item(i).nombre, false));
                            } else {
                                $scope.apuestas.push(new Apuesta(result.rows.item(i).id, result.rows.item(i).nombre, true));
                            }
                        }
                    } else {
                        var apuesta = "INSERT INTO apuesta (nombre, seleccionada) VALUES (?,?)";
                        $cordovaSQLite.execute(db, apuesta, ["rayas", 0]);

                        getApuestas();
                    }
                }, function (err) {
                    console.error(err);
                });
            }, 500)

        }

        $ionicPlatform.ready(function () {
            servicePantallas.savePantalla(6);
            getApuestas();
        });

    });
