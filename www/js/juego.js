angular.module('starter.juego', ['ionic', 'starter.seleccion-jugadores'])

    .controller('juegoController', function ($scope, $ionicPopup, $cordovaSQLite,
                                             $state, $ionicLoading, $timeout,
                                             $ionicPlatform, $q, $http) {
            $scope.hoyos1a9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            $scope.hoyos10a18 = [10, 11, 12, 13, 14, 15, 16, 17, 18];
            $scope.pares1a9 = [];
            $scope.pares10a18 = [];
            $scope.ventajas1a9 = [];
            $scope.ventajas10a18 = [];


            $scope.hoyos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                17, 18];
            $scope.jugadores = [];
            $scope.pares = [];
            $scope.tablero = [];
            $scope.ventajas = [];
            $scope.campo = {};
            $scope.partido = {};

            var sCirc = 'div-circular';
            var nCirc = 'circular-hidden';

            var modulePromises = [];

            $ionicPlatform.ready(function () {
                console.log('GolfApp>> juego.$ionicPlatform.ready');

                showLoading();

                modulePromises.push(loadJugadores());
                modulePromises.push(loadCampo());
                modulePromises.push(loadPuntos());

                $q.all(modulePromises).then(function () {
                    actualizarScoreUi();
                    fixRowsAndColumns();

                    setTimeout(function () {
                        $ionicLoading.hide()
                    }, 3000)
                });

                //crearCampoServer(1);

                screen.orientation.addEventListener('change', function () {
                    console.log(screen.orientation.type); // e.g. portrait
                    // $state.go('juego');
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
                        for (var i = 0; i < resJug.rows.length; i++) {
                            // console.log('GolfApp>>', 'Jug_' + i + ': ['
                            //     + resJug.rows.item(i).id + '] -> '
                            //     + resJug.rows.item(i).nombre);

                            $scope.jugadores.push(resJug.rows.item(i));

                            $scope.tablero.push({
                                index: i,
                                nombre: resJug.rows.item(i).nombre,
                                handicap: resJug.rows.item(i).handicap,
                                jugador_id: resJug.rows.item(i).id,
                                golpes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0],
                                totales_golpes: [0, 0, 0],
                                unidades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0, 0],
                                rayas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0],
                                style_rayas: [],
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
                                    $scope.tablero[j]
                                        .golpes[resPunt.rows.item(i).hoyo - 1]
                                        = resPunt.rows.item(i).golpes;
                                    $scope.tablero[j]
                                        .unidades[resPunt.rows.item(i).hoyo - 1]
                                        = resPunt.rows.item(i).unidades;
                                    $scope.partido.registrarGolpes(j,
                                        resPunt.rows.item(i).hoyo - 1,
                                        resPunt.rows.item(i).golpes,
                                        resPunt.rows.item(i).unidades);
                                    break;
                                }
                            }
                            // console.log('GolfApp>>', 'res[' + i + '] -> '
                            //     + JSON.stringify(resPunt.rows.item(i)));
                        }
                    });

                modulePromises.push(selectPuntosPromise);
            }

            function loadCampo() {
                var queryCampo = "SELECT * FROM campo WHERE seleccionado = 1";

                var selectCampoPromise = $cordovaSQLite.execute(db, queryCampo)
                    .then(function (res) {
                        if (res.rows.length > 0) {
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_1});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_2});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_3});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_4});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_5});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_6});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_7});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_8});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_9});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_10});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_11});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_12});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_13});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_14});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_15});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_16});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_17});
                            $scope.pares.push({value: res.rows.item(0).par_hoyo_18});

                            $scope.pares1a9.push({value: res.rows.item(0).par_hoyo_1});
                            $scope.pares1a9.push({value: res.rows.item(0).par_hoyo_2});
                            $scope.pares1a9.push({value: res.rows.item(0).par_hoyo_3});
                            $scope.pares1a9.push({value: res.rows.item(0).par_hoyo_4});
                            $scope.pares1a9.push({value: res.rows.item(0).par_hoyo_5});
                            $scope.pares1a9.push({value: res.rows.item(0).par_hoyo_6});
                            $scope.pares1a9.push({value: res.rows.item(0).par_hoyo_7});
                            $scope.pares1a9.push({value: res.rows.item(0).par_hoyo_8});
                            $scope.pares1a9.push({value: res.rows.item(0).par_hoyo_9});
                            $scope.pares10a18.push({value: res.rows.item(0).par_hoyo_10});
                            $scope.pares10a18.push({value: res.rows.item(0).par_hoyo_11});
                            $scope.pares10a18.push({value: res.rows.item(0).par_hoyo_12});
                            $scope.pares10a18.push({value: res.rows.item(0).par_hoyo_13});
                            $scope.pares10a18.push({value: res.rows.item(0).par_hoyo_14});
                            $scope.pares10a18.push({value: res.rows.item(0).par_hoyo_15});
                            $scope.pares10a18.push({value: res.rows.item(0).par_hoyo_16});
                            $scope.pares10a18.push({value: res.rows.item(0).par_hoyo_17});
                            $scope.pares10a18.push({value: res.rows.item(0).par_hoyo_18});

                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_1});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_2});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_3});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_4});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_5});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_6});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_7});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_8});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_9});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_10});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_11});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_12});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_13});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_14});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_15});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_16});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_17});
                            $scope.ventajas.push({value: res.rows.item(0).ventaja_hoyo_18});

                            $scope.ventajas1a9.push({value: res.rows.item(0).ventaja_hoyo_1});
                            $scope.ventajas1a9.push({value: res.rows.item(0).ventaja_hoyo_2});
                            $scope.ventajas1a9.push({value: res.rows.item(0).ventaja_hoyo_3});
                            $scope.ventajas1a9.push({value: res.rows.item(0).ventaja_hoyo_4});
                            $scope.ventajas1a9.push({value: res.rows.item(0).ventaja_hoyo_5});
                            $scope.ventajas1a9.push({value: res.rows.item(0).ventaja_hoyo_6});
                            $scope.ventajas1a9.push({value: res.rows.item(0).ventaja_hoyo_7});
                            $scope.ventajas1a9.push({value: res.rows.item(0).ventaja_hoyo_8});
                            $scope.ventajas1a9.push({value: res.rows.item(0).ventaja_hoyo_9});
                            $scope.ventajas10a18.push({value: res.rows.item(0).ventaja_hoyo_10});
                            $scope.ventajas10a18.push({value: res.rows.item(0).ventaja_hoyo_11});
                            $scope.ventajas10a18.push({value: res.rows.item(0).ventaja_hoyo_12});
                            $scope.ventajas10a18.push({value: res.rows.item(0).ventaja_hoyo_13});
                            $scope.ventajas10a18.push({value: res.rows.item(0).ventaja_hoyo_14});
                            $scope.ventajas10a18.push({value: res.rows.item(0).ventaja_hoyo_15});
                            $scope.ventajas10a18.push({value: res.rows.item(0).ventaja_hoyo_16});
                            $scope.ventajas10a18.push({value: res.rows.item(0).ventaja_hoyo_17});
                            $scope.ventajas10a18.push({value: res.rows.item(0).ventaja_hoyo_18});

                            var campoPromises = [];

                            var crearCampo = function () {
                                $scope.campo = new Campo(res.rows.item(0).id,
                                    res.rows.item(0).nombre, $scope.pares,
                                    $scope.ventajas);
                            };

                            var crearPartido = function () {
                                $scope.partido = new Partido($scope.jugadores,
                                    $scope.campo);
                            };

                            campoPromises.push(crearCampo());

                            $q.all(campoPromises).then(function () {
                                campoPromises.push(crearPartido());
                                $q.all(campoPromises).then(function () {
                                    $scope.partido.agregarApuesta(
                                        new ApuestaRayas($scope.partido));
                                });
                            });
                        }
                    });

                modulePromises.push(selectCampoPromise);
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

                                $scope.tablero[jugador_idx].golpes[hoyo - 1] = golpesRealizaos;
                                $scope.tablero[jugador_idx].unidades[hoyo - 1] = unidades;

                                if (golpesRealizaos) {
                                    var promises = [];

                                    promises.push(guardarPuntosDb(jugador_id, hoyo,
                                        golpesRealizaos, unidades));
                                    promises.push($scope.partido
                                        .registrarGolpes(jugador_idx,
                                            (hoyo - 1), golpesRealizaos,
                                            unidades));

                                    $q.all(promises).then(function () {
                                        // console.log('GolfApp', 'AllPromisesExecuted');
                                        actualizarScoreUi();
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

            function actualizarScoreUi() {
                var numJugadores = $scope.partido.apuestas[0].scoreRayas.length;

                for (var i = 0; i < numJugadores; i++) {
                    var golpesTotales1a9 = 0;
                    var golpesTotales10a18 = 0;
                    var golpesTotalesTotal = 0;

                    for (var j = 0; j < 18; j++) {
                        var rayas = $scope.partido.apuestas[0].scoreRayas[i].puntos[j];
                        rayas = rayas ? rayas : 0;
                        $scope.tablero[i].rayas[j] = rayas;

                        if(j < 9) {
                            golpesTotales1a9 += $scope.tablero[i].golpes[j];
                        }  else {
                            golpesTotales10a18 += $scope.tablero[i].golpes[j];
                        }

                        if (rayas < 0)
                            $scope.tablero[i].style_rayas[j] = 'color: red;';
                        else if (rayas > 0)
                            $scope.tablero[i].style_rayas[j] = 'color: green';
                        else
                            $scope.tablero[i].style_rayas[j] = 'color: black';

                        if ($scope.tablero[i].golpes[j] != 0) {
                            var circulos = $scope.pares[j].value - $scope.tablero[i].golpes[j];

                            for (var m = 0; m < circulos && m < 4; m++) {
                                $scope.tablero[i].circulos[j][m] = sCirc;
                            }

                            for (m = circulos; m < 4; m++) {
                                $scope.tablero[i].circulos[j][m] = nCirc;
                            }
                        }
                    }

                    golpesTotalesTotal = golpesTotales1a9 + golpesTotales10a18
                     - $scope.tablero[i].handicap;
                    $scope.tablero[i].totales_golpes[0] = golpesTotales1a9;
                    $scope.tablero[i].totales_golpes[1] = golpesTotales10a18;
                    $scope.tablero[i].totales_golpes[2] = golpesTotalesTotal;
                }
            }

            $scope.variableTest = 'HolaValorDefault';

            $scope.actualizarJuego = function () {
                // console.log('btnActualizar.click()');

                var deleteQuery = 'DELETE FROM puntuaciones';

                $cordovaSQLite.execute(db, deleteQuery)
                    .then(function (resDelete) {
                        console.log('GolfApp>>', 'ResDelete: ' + JSON.stringify(resDelete));
                    });
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
