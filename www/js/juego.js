angular.module('starter.juego', ['ionic'])

    .controller('ctrlJuego', function ($scope, $ionicPopup, $cordovaSQLite,
                                       $state, $ionicLoading, $timeout,
                                       $ionicPlatform) {

        //----------------------------------------------------------------------
        $scope.actualizarJuego = function () {
            console.log('btnActualizar.click()');

            $('#fixed_hdr1').fxdHdrCol({
                fixedCols: 1,
                width: '100%',
                height: '100%',
                colModal: [
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'},
                    {width: 100, align: 'center'}
                ]
            });
        };
        //----------------------------------------------------------------------

        var jugadores = [];
        var campo;
        var partido;

        var ventajas = [];
        var par = [];

        var ventajasPantalla = [];
        var parPantalla = [];

        var puntuaciones = [];

        $scope.guardarPantallaJuego = function (seleccion) {

            var pantalla = "UPDATE pantalla SET pantalla = ? WHERE id = 1";
            console.log(seleccion);
            switch (seleccion) {

                case 1:
                    $cordovaSQLite.execute(db, pantalla, [1]);
                    $state.go('inicio')
                    break;
            }

        };

        $scope.score = function (id, hoyo, id_jugador) {

            var nombre = jugadores[id].nombre;

            $scope.juego = {};

            var myPopup = $ionicPopup.show({
                templateUrl: '../templates/registro_puntos_popup.html',
                title: 'Jugador:' + nombre,
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'button-assertive'
                    },
                    {
                        text: '<b>Guardar</b>',
                        type: 'button-balanced',
                        onTap: function (e) {
                            var golpesRealizaos = $scope.juego.golpesRealizados;
                            var puntosExtras = $scope.juego.puntosExtras;
                            var puntos;

                            if (golpesRealizaos) {

                                puntosExtras = puntosExtras ? puntosExtras : 0;

                                partido.registrarGolpes(id, (hoyo - 1), golpesRealizaos, puntosExtras);
                                guardarScore(id_jugador, hoyo, golpesRealizaos, puntosExtras);

                                for (var i = 0; i < jugadores.length; i++) {
                                    for (var j = 1; j < 19; j++) {
                                        console.log(id_jugador + "idejugador");
                                        document.getElementById("golpes" + i + "" + j).innerHTML = partido.scoreBoard[i].golpes[j - 1];
                                        document.getElementById("unidades" + i + "" + j).innerHTML = partido.scoreBoard[i].unidades[j - 1];
                                        document.getElementById("rayas" + i + "" + j).innerHTML = partido.apuestas[0].scoreRayas[i].puntos[j - 1];

                                        puntos = partido.apuestas[0].scoreRayas[i].puntos[j - 1];
                                        if (puntos < 0) {
                                            document.getElementById("rayas" + i + "" + j).style.color = "#FF0000";
                                        } else if (puntos > 0) {
                                            document.getElementById("rayas" + i + "" + j).style.color = "#28a54c";
                                        } else {
                                            document.getElementById("rayas" + i + "" + j).style.color = "#000000";
                                        }

                                    }
                                }

                            } else {
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        };

        function agregaPuntos(id, hoyo, golpes) {

            console.log(par[hoyo - 1] - golpes);
            switch (par[hoyo - 1] - golpes) {

                case 1:

                    document.getElementById("golpes" + id + "" + hoyo).innerHTML =
                        "<div>" +
                        "<div style='border: 2px; background-color: blue; border-radius: 50%; width: 10px; height: 10px;'>" +
                        golpes +
                        "</div>" +
                        "</div>";
                    break;

                case 2:
                    document.getElementById("golpes" + id + "" + hoyo).innerHTML =
                        "<div>" +
                        "<div>" +
                        golpes +
                        "</div>" +
                        "</div>";
                    break;

                case 3:
                    break;

                case 4:
                    break
            }
        }

        function getJugadores() {
            var query = "SELECT * FROM jugador";
            $cordovaSQLite.execute(db, query).then(function (res) {
                for (var i = 0; i < res.rows.length; i++) {
                    console.log(res.rows.item(i).id + " res.rows.item(i).id")
                    jugadores.push(new Jugador(res.rows.item(i).id, res.rows.item(i).nombre, "", res.rows.item(i).handicap, "", "", "", ""))
                }
                $scope.jugadoresConf = jugadores;
            });
        }

        function getCampo() {
            var query = "SELECT * FROM campo WHERE seleccionado = 1";
            $cordovaSQLite.execute(db, query).then(function (res) {

                if (res.rows.length > 0) {
                    par = [res.rows.item(0).par_hoyo_1, res.rows.item(0).par_hoyo_2, res.rows.item(0).par_hoyo_3, res.rows.item(0).par_hoyo_4, res.rows.item(0).par_hoyo_5,
                        res.rows.item(0).par_hoyo_6, res.rows.item(0).par_hoyo_7, res.rows.item(0).par_hoyo_8, res.rows.item(0).par_hoyo_9, res.rows.item(0).par_hoyo_10,
                        res.rows.item(0).par_hoyo_11, res.rows.item(0).par_hoyo_12, res.rows.item(0).par_hoyo_13, res.rows.item(0).par_hoyo_14, res.rows.item(0).par_hoyo_15,
                        res.rows.item(0).par_hoyo_16, res.rows.item(0).par_hoyo_17, res.rows.item(0).par_hoyo_18];

                    parPantalla = {
                        h1: res.rows.item(0).par_hoyo_1,
                        h2: res.rows.item(0).par_hoyo_2,
                        h3: res.rows.item(0).par_hoyo_3,
                        h4: res.rows.item(0).par_hoyo_4,
                        h5: res.rows.item(0).par_hoyo_5,
                        h6: res.rows.item(0).par_hoyo_6,
                        h7: res.rows.item(0).par_hoyo_7,
                        h8: res.rows.item(0).par_hoyo_8,
                        h9: res.rows.item(0).par_hoyo_9,
                        h10: res.rows.item(0).par_hoyo_10,
                        h11: res.rows.item(0).par_hoyo_11,
                        h12: res.rows.item(0).par_hoyo_12,
                        h13: res.rows.item(0).par_hoyo_13,
                        h14: res.rows.item(0).par_hoyo_14,
                        h15: res.rows.item(0).par_hoyo_15,
                        h16: res.rows.item(0).par_hoyo_16,
                        h17: res.rows.item(0).par_hoyo_17,
                        h18: res.rows.item(0).par_hoyo_18
                    };

                    $scope.pares = parPantalla;

                    ventajas = [res.rows.item(0).ventaja_hoyo_1, res.rows.item(0).ventaja_hoyo_2, res.rows.item(0).ventaja_hoyo_3, res.rows.item(0).ventaja_hoyo_4, res.rows.item(0).ventaja_hoyo_5,
                        res.rows.item(0).ventaja_hoyo_6, res.rows.item(0).ventaja_hoyo_7, res.rows.item(0).ventaja_hoyo_8, res.rows.item(0).ventaja_hoyo_9, res.rows.item(0).ventaja_hoyo_10,
                        res.rows.item(0).ventaja_hoyo_11, res.rows.item(0).ventaja_hoyo_12, res.rows.item(0).ventaja_hoyo_13, res.rows.item(0).ventaja_hoyo_14, res.rows.item(0).ventaja_hoyo_15,
                        res.rows.item(0).ventaja_hoyo_16, res.rows.item(0).ventaja_hoyo_17, res.rows.item(0).ventaja_hoyo_18];

                    ventajasPantalla = {
                        h1: res.rows.item(0).ventaja_hoyo_1,
                        h2: res.rows.item(0).ventaja_hoyo_2,
                        h3: res.rows.item(0).ventaja_hoyo_3,
                        h4: res.rows.item(0).ventaja_hoyo_4,
                        h5: res.rows.item(0).ventaja_hoyo_5,
                        h6: res.rows.item(0).ventaja_hoyo_6,
                        h7: res.rows.item(0).ventaja_hoyo_7,
                        h8: res.rows.item(0).ventaja_hoyo_8,
                        h9: res.rows.item(0).ventaja_hoyo_9,
                        h10: res.rows.item(0).ventaja_hoyo_10,
                        h11: res.rows.item(0).ventaja_hoyo_11,
                        h12: res.rows.item(0).ventaja_hoyo_12,
                        h13: res.rows.item(0).ventaja_hoyo_13,
                        h14: res.rows.item(0).ventaja_hoyo_14,
                        h15: res.rows.item(0).ventaja_hoyo_15,
                        h16: res.rows.item(0).ventaja_hoyo_16,
                        h17: res.rows.item(0).ventaja_hoyo_17,
                        h18: res.rows.item(0).ventaja_hoyo_18
                    };
                    //
                    $scope.ventajas = ventajasPantalla;

                    campo = new Campo(res.rows.item(0).id, res.rows.item(0).nombre, par, ventajas);
                    partido = new Partido(jugadores, campo);
                    partido.agregarApuesta(new ApuestaRayas(partido))

                }
            });
        }

        function getPuntuacion() {
            var getJugadores = "SELECT * FROM jugador";
            var getPuntuaciones = "SELECT * FROM puntuaciones WHERE jugador_id = (?) AND hoyo = (?)";

            $cordovaSQLite.execute(db, getJugadores).then(function (res1) {

                var i = 0;
                var j = 0;
                for (i = 0; i < res1.rows.length; i++) {
                    for (j = 1; j < 19; j++) {
                        //console.log("fuera consulta [" + i + "," + j + "]");
                        $cordovaSQLite.execute(db, getPuntuaciones, [res1.rows.item(i).id, j]).then(function (res2) {
                            //console.log("dentro consulta [" + i + "," + j + "]");
                            if (res2.rows.length > 0) {

                                console.log("golpes" + "\n"
                                    + "indice:" + (i - 1) + "\n"
                                    + "idJugad:" + res1.rows.item(i).id + "\n"
                                    + "hoyo:" + j);

                                //document.getElementById("golpes"+(i-1)+""+res1.rows.item(i).id+""+j).innerHTML = res2.rows.item(0).golpes;
                                //document.getElementById("unidades"+(i-1)+""+res1.rows.item(i).id+""+j).innerHTML = res2.rows.item(0).unidades;
                            }
                        });
                    }
                    j--;
                }
                i--;
            });
        }

        function guardarScore(id_jugador, hoyo, golpes, unidades) {

            console.log("ID JUGADOR: " + id_jugador + " HOYO: " + hoyo);
            var selectJugador = "SELECT id FROM puntuaciones WHERE jugador_id = (?) AND hoyo = (?)";
            var insertDatos = "INSERT INTO puntuaciones (hoyo, golpes, unidades, jugador_id) VALUES (?,?,?,?)";
            var updateDatos = "UPDATE puntuaciones SET golpes=?, unidades=? WHERE jugador_id = (?) AND hoyo = (?)";

            $cordovaSQLite.execute(db, selectJugador, [id_jugador, hoyo]).then(function (res) {

                if (res.rows.length > 0) {
                    $cordovaSQLite.execute(db, updateDatos, [golpes, unidades, id_jugador, hoyo])
                        .then(function (res) {
                            console.log("UPDATE ID -> " + res.insertId);

                        }, function (err) {
                            console.error(err);
                        });
                } else {
                    $cordovaSQLite.execute(db, insertDatos, [hoyo, golpes, unidades, id_jugador])
                        .then(function (res) {
                            console.log("INSERT ID -> " + res.insertId);

                        }, function (err) {
                            console.error(err);
                        });
                }
            }, function (err) {
                console.error(err);
            });

        }

        $ionicPlatform.ready(function () {
            getJugadores();
            getCampo();


        });

    });
