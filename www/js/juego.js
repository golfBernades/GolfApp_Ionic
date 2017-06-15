angular.module('starter.juego', ['ionic', 'starter.seleccion-jugadores'])

    .controller('juegoController', function ($scope, $ionicPopup, $cordovaSQLite,
                                             $state, $ionicLoading, $timeout,
                                             $ionicPlatform, $q, $http,
                                             serviceHttpRequest) {
            $scope.hoyos1a9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            $scope.hoyos10a18 = [10, 11, 12, 13, 14, 15, 16, 17, 18];
            $scope.pares1a9 = [];
            $scope.pares10a18 = [];
            $scope.ventajas1a9 = [];
            $scope.ventajas10a18 = [];
            $scope.nombreCampo = '';

            $scope.rayasSeleccionada = false;
            $scope.conejaSeleccionada = false;

            $scope.hoyos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                16, 17, 18];
            $scope.jugadores = [];
            // $scope.pares = [];
            $scope.tablero = {};
            // $scope.ventajas = [];
            $scope.campo = {};
            $scope.partido = {};

            var sCirc = 'div-circular';
            var nCirc = 'circular-hidden';

            var modulePromises = [];

            $ionicPlatform.ready(function () {
                console.log('GolfApp>> juego.$ionicPlatform.ready');

                showLoading();

                modulePromises.push(loadCampo());
                modulePromises.push(loadJugadores());

                $q.all(modulePromises).then(function () {
                    modulePromises.push(crearPartido());
                    modulePromises.push(loadPuntos());

                    $q.all(modulePromises).then(function () {
                        actualizarScoreUi();
                        fixRowsAndColumns();

                        setTimeout(function () {
                            $ionicLoading.hide()
                        }, 3000)
                    });
                });

                screen.orientation.addEventListener('change', function () {
                    $state.reload();
                });
            });

            function popup(title, template) {
                var pop = $ionicPopup.alert({
                    title: title,
                    template: template
                });
            }

            function showLoading() {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>' +
                    '<p>Cargando</p>',
                    animation: 'fade-in'
                }).then(function () {
                    // console.log("The loading indicator is now displayed");
                });
            };

            function fixRowsAndColumns() {
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
                        {width: 100, align: 'center'},
                        {width: 100, align: 'center'},
                        {width: 100, align: 'center'}
                    ]
                });
            }

            function loadJugadores() {
                var queryJugadores = "SELECT * FROM jugador WHERE jugar = 1 ORDER BY handicap, nombre ASC";

                selectJugadoresPromise = $cordovaSQLite
                    .execute(db, queryJugadores).then(function (resJug) {
                        $scope.tablero.datos_juego = [];

                        for (var i = 0; i < resJug.rows.length; i++) {
                            $scope.jugadores.push(resJug.rows.item(i));

                            $scope.tablero.datos_juego.push({
                                index: i,
                                nombre: resJug.rows.item(i).nombre,
                                handicap: resJug.rows.item(i).handicap,
                                jugador_id: resJug.rows.item(i).id,
                                golpes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0],
                                totales_golpes: [0, 0, 0],
                                circulos: [
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc],
                                    [nCirc, nCirc, nCirc, nCirc]
                                ]
                            });
                        }
                    });

                modulePromises.push(selectJugadoresPromise);
            }

            function loadPuntos() {
                var queryPuntos = 'SELECT * FROM puntuaciones';

                var selectPuntosPromise = $cordovaSQLite
                    .execute(db, queryPuntos).then(function (resPunt) {
                        // Recorre los registros de puntuaciones
                        for (var i = 0; i < resPunt.rows.length; i++) {
                            // Recorre los jugadores para determinar su índice
                            for (var j = 0; j < $scope.jugadores.length; j++) {
                                // Compara el id del jugador obtenido de la
                                // bd, con el actual de la lista de jugadores
                                if ($scope.jugadores[j].id
                                    == resPunt.rows.item(i).jugador_id) {
                                    $scope.tablero.datos_juego[j]
                                        .golpes[resPunt.rows.item(i).hoyo - 1]
                                        = resPunt.rows.item(i).golpes;

                                    if ($scope.rayasSeleccionada) {
                                        $scope.tablero.datos_juego[j]
                                            .apuestaRayas.unidades[
                                        resPunt.rows.item(i).hoyo - 1]
                                            = resPunt.rows.item(i).unidades;
                                    }

                                    $scope.partido.registrarGolpes(j,
                                        resPunt.rows.item(i).hoyo - 1,
                                        resPunt.rows.item(i).golpes,
                                        resPunt.rows.item(i).unidades);
                                    break;
                                }
                            }
                        }
                    });

                modulePromises.push(selectPuntosPromise);
            }

            function loadCampo() {
                var queryCampo = "SELECT * FROM campo WHERE seleccionado = 1";

                var selectCampoPromise = $cordovaSQLite.execute(db, queryCampo)
                    .then(function (res) {
                        if (res.rows.length > 0) {
                            $scope.tablero.campo = {
                                nombre: res.rows.item(0).nombre,
                                pares1a9: [
                                    {value: res.rows.item(0).par_hoyo_1},
                                    {value: res.rows.item(0).par_hoyo_2},
                                    {value: res.rows.item(0).par_hoyo_3},
                                    {value: res.rows.item(0).par_hoyo_4},
                                    {value: res.rows.item(0).par_hoyo_5},
                                    {value: res.rows.item(0).par_hoyo_6},
                                    {value: res.rows.item(0).par_hoyo_7},
                                    {value: res.rows.item(0).par_hoyo_8},
                                    {value: res.rows.item(0).par_hoyo_9}
                                ],
                                pares10a18: [
                                    {value: res.rows.item(0).par_hoyo_10},
                                    {value: res.rows.item(0).par_hoyo_11},
                                    {value: res.rows.item(0).par_hoyo_12},
                                    {value: res.rows.item(0).par_hoyo_13},
                                    {value: res.rows.item(0).par_hoyo_14},
                                    {value: res.rows.item(0).par_hoyo_15},
                                    {value: res.rows.item(0).par_hoyo_16},
                                    {value: res.rows.item(0).par_hoyo_17},
                                    {value: res.rows.item(0).par_hoyo_18}
                                ],
                                pares: [],
                                ventajas1a9: [
                                    {value: res.rows.item(0).ventaja_hoyo_1},
                                    {value: res.rows.item(0).ventaja_hoyo_2},
                                    {value: res.rows.item(0).ventaja_hoyo_3},
                                    {value: res.rows.item(0).ventaja_hoyo_4},
                                    {value: res.rows.item(0).ventaja_hoyo_5},
                                    {value: res.rows.item(0).ventaja_hoyo_6},
                                    {value: res.rows.item(0).ventaja_hoyo_7},
                                    {value: res.rows.item(0).ventaja_hoyo_8},
                                    {value: res.rows.item(0).ventaja_hoyo_9}
                                ],
                                ventajas10a18: [
                                    {value: res.rows.item(0).ventaja_hoyo_10},
                                    {value: res.rows.item(0).ventaja_hoyo_11},
                                    {value: res.rows.item(0).ventaja_hoyo_12},
                                    {value: res.rows.item(0).ventaja_hoyo_13},
                                    {value: res.rows.item(0).ventaja_hoyo_14},
                                    {value: res.rows.item(0).ventaja_hoyo_15},
                                    {value: res.rows.item(0).ventaja_hoyo_16},
                                    {value: res.rows.item(0).ventaja_hoyo_17},
                                    {value: res.rows.item(0).ventaja_hoyo_18}
                                ],
                                ventajas: []
                            };

                            $scope.tablero.campo.pares =
                                $scope.tablero.campo.pares1a9
                                    .concat($scope.tablero.campo.pares10a18);

                            $scope.tablero.campo.ventajas =
                                $scope.tablero.campo.ventajas1a9
                                    .concat($scope.tablero.campo.ventajas10a18);

                            var crearCampo = function () {
                                $scope.campo = new Campo(res.rows.item(0).id,
                                    $scope.tablero.campo.nombre,
                                    $scope.tablero.campo.pares,
                                    $scope.tablero.campo.ventajas);
                            };

                            modulePromises.push(crearCampo());
                        }
                    });

                modulePromises.push(selectCampoPromise);
            }

            function crearPartido() {
                var crearPartido = function () {
                    $scope.partido = new Partido($scope.jugadores, $scope.campo);
                };

                var promises = [];
                promises.push(crearPartido());

                ////////////////////////////////
                var queryApuestas = "SELECT id, nombre FROM apuesta WHERE" +
                    " seleccionada = 1";

                var getApuestasPromise = $cordovaSQLite.execute(db,
                    queryApuestas).then(function (res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        if (res.rows.item(i).nombre == 'rayas') {
                            $scope.rayasSeleccionada = true;
                        } else if (res.rows.item(i) == 'coneja') {
                            $scope.conejaSeleccionada = true;
                        }
                    }
                });

                promises.push(getApuestasPromise);

                $q.all(promises).then(function () {
                    if ($scope.rayasSeleccionada) agregarApuestaRayas();

                });
            }

            function agregarApuestaRayas() {
                $scope.partido.agregarApuesta(new ApuestaRayas($scope.partido));

                $.each($scope.tablero.datos_juego, function (index, dato) {
                    dato.apuestaRayas = {
                        unidades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0],
                        rayas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0],
                        style_rayas: []
                    }
                });
            }

            function agregarApuestaConeja() {

            }

            $scope.guardarPuntos = function (jugador_idx, jugador_id, hoyo) {
                $scope.juego = {};

                $ionicPopup.show({
                    templateUrl: 'templates/registro_puntos_popup.html',
                    title: 'Registro de puntos.',
                    subTitle: 'Jugador: ' + $scope.jugadores[jugador_idx].nombre + '.  Hoyo: ' + hoyo + '.',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Cancelar',
                            type: 'button-assertive'
                        },
                        {
                            text: 'Guardar',
                            type: 'button-balanced',
                            onTap: function (e) {
                                var golpesRealizaos = $scope.juego.golpesRealizados;
                                var unidades = $scope.juego.puntosExtras;

                                unidades = unidades ? unidades : 0;

                                $scope.tablero.datos_juego[jugador_idx]
                                    .golpes[hoyo - 1] = golpesRealizaos;

                                if ($scope.rayasSeleccionada) {
                                    $scope.tablero.datos_juego[jugador_idx]
                                        .apuestaRayas.unidades[hoyo - 1]
                                        = unidades;
                                }

                                if (golpesRealizaos) {
                                    var promises = [];

                                    promises.push(guardarPuntosDb(jugador_id,
                                        hoyo, golpesRealizaos, unidades));
                                    promises.push($scope.partido
                                        .registrarGolpes(jugador_idx,
                                            (hoyo - 1), golpesRealizaos,
                                            unidades));

                                    $q.all(promises).then(function () {
                                        // console.log('GolfApp', 'AllPromisesExecuted');
                                        actualizarScoreUi();
                                        compartirScoreboard();
                                    });
                                } else {
                                    $scope.juego.style_golpes = 'background-color: red';
                                    e.preventDefault();
                                }
                            }
                        }
                    ]
                });
            };

            function compartirScoreboard() {
                showLoading();

                var httpRequest = serviceHttpRequest.createPostHttpRequest(
                    dir + 'partido_tablero_write',
                    {
                        partido_id: 7,
                        clave_edicion: 'abcdefgh',
                        tablero_json: JSON.stringify($scope.tablero)
                    }
                );

                $http(httpRequest)
                    .then(function successCallback(response) {
                        if (response.data.ok) {
                            popup('Partido', 'Marcador enviado al servidor');
                        } else {
                            popup('Partido', 'Error al subir marcador');
                        }
                        $ionicLoading.hide();
                    }, function errorCallback(response) {
                        if (response.status == -1) {
                            if (intento < 3) {
                            } else {
                                $ionicLoading.hide();
                                popup('Partido', 'Error de Conexión');
                            }
                        } else {
                            $ionicLoading.hide();
                            popup('Partido', 'Error de Parámetros');
                        }
                    });
            }

            function actualizarScoreUi() {
                var numJugadores = $scope.partido.apuestas[0].scoreRayas.length;

                for (var i = 0; i < numJugadores; i++) {
                    var golpesTotales1a9 = 0;
                    var golpesTotales10a18 = 0;
                    var golpesTotalesTotal = 0;

                    for (var j = 0; j < 18; j++) {
                        if ($scope.rayasSeleccionada) {
                            var rayas = $scope.partido.apuestas[0].scoreRayas[i]
                                .puntos[j];
                            rayas = rayas ? rayas : 0;
                            $scope.tablero.datos_juego[i].apuestaRayas.rayas[j]
                                = rayas;

                            if (rayas < 0)
                                $scope.tablero.datos_juego[i].apuestaRayas
                                    .style_rayas[j] = 'color: red;';
                            else if (rayas > 0)
                                $scope.tablero.datos_juego[i].apuestaRayas
                                    .style_rayas[j] = 'color: green';
                            else
                                $scope.tablero.datos_juego[i].apuestaRayas
                                    .style_rayas[j] = 'color: black';
                        }

                        if (j < 9) {
                            golpesTotales1a9 += $scope.tablero.datos_juego[i].golpes[j];
                        } else {
                            golpesTotales10a18 += $scope.tablero.datos_juego[i].golpes[j];
                        }


                        if ($scope.tablero.datos_juego[i].golpes[j] != 0) {
                            var circulos = $scope.tablero.campo.pares[j].value
                                - $scope.tablero.datos_juego[i].golpes[j];

                            for (var m = 0; m < circulos && m < 4; m++) {
                                $scope.tablero.datos_juego[i].circulos[j][m] = sCirc;
                            }

                            for (m = circulos; m < 4; m++) {
                                $scope.tablero.datos_juego[i].circulos[j][m] = nCirc;
                            }
                        }
                    }

                    golpesTotalesTotal = golpesTotales1a9 + golpesTotales10a18
                        - $scope.tablero.datos_juego[i].handicap;
                    $scope.tablero.datos_juego[i].totales_golpes[0] = golpesTotales1a9;
                    $scope.tablero.datos_juego[i].totales_golpes[1] = golpesTotales10a18;
                    $scope.tablero.datos_juego[i].totales_golpes[2] = golpesTotalesTotal;
                }
            }

            $scope.actualizarJuego = function () {
                compartirScoreboard();
                // console.log('btnActualizar.click()');

                // var deleteQuery = 'DELETE FROM puntuaciones';
                //
                // $cordovaSQLite.execute(db, deleteQuery)
                //     .then(function (resDelete) {
                //         console.log('GolfApp>>', 'ResDelete: ' + JSON.stringify(resDelete));
                //     });
            };

            $scope.guardarPantallaJuego = function (seleccion) {
                var pantalla = "UPDATE pantalla SET pantalla = ? WHERE id = 1";
                switch (seleccion) {
                    case 1:
                        $cordovaSQLite.execute(db, pantalla, [1]);
                        $state.go('inicio');
                        break;
                }
            };

            function guardarPuntosDb(id_jugador, hoyo, golpes, unidades) {
                // console.log('GolfApp', 'Se guardará la siguiente información en'
                //     + ' la tabla "puntuaciones": jugador_id->' + id_jugador
                //     + ', hoyo->' + hoyo + ', golpes->' + golpes + ', unidades->'
                //     + unidades);

                var selectJugador = "SELECT id FROM puntuaciones " +
                    "WHERE jugador_id = (?) AND hoyo = (?)";
                var insertDatos = "INSERT INTO puntuaciones " +
                    "(hoyo, golpes, unidades, jugador_id) VALUES (?,?,?,?)";
                var updateDatos = "UPDATE puntuaciones SET golpes=?, unidades=? " +
                    "WHERE jugador_id = (?) AND hoyo = (?)";

                $cordovaSQLite.execute(db, selectJugador, [id_jugador, hoyo])
                    .then(function (res) {
                        if (res.rows.length > 0) {
                            $cordovaSQLite.execute(db, updateDatos, [golpes, unidades,
                                id_jugador, hoyo])
                                .then(function (res) {
                                    console.log("UPDATE ID -> " + res.insertId);
                                }, function (err) {
                                    console.error(err);
                                });
                        } else {
                            $cordovaSQLite.execute(db, insertDatos, [hoyo, golpes,
                                unidades, id_jugador])
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

        }
    )
;
