angular.module('starter.juego', ['ionic', 'starter.seleccion-jugadores'])

    .controller('juegoController', function ($scope, $ionicPopup, $cordovaSQLite,
                                             $state, $ionicLoading, $timeout,
                                             $ionicPlatform, $q, $http,
                                             serviceHttpRequest, $ionicPopover,
                                             sql, utils) {
        $scope.hoyos1a9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        $scope.hoyos10a18 = [10, 11, 12, 13, 14, 15, 16, 17, 18];
        $scope.pares1a9 = [];
        $scope.pares10a18 = [];
        $scope.ventajas1a9 = [];
        $scope.ventajas10a18 = [];
        $scope.nombreCampo = '';

        $scope.hoyos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
            16, 17, 18];
        $scope.jugadores = [];
        $scope.tablero = {};
        $scope.campo = {};
        $scope.partido = {};

        $scope.partidoId = '';
        $scope.claveConsulta = '';
        $scope.claveEdicion = '';
        $scope.inicioPartido = '';

        $scope.partidoSincronizado = false;

        var opcionesPopover;
        var sCirc = 'div-circular';
        var nCirc = 'circular-hidden';
        var modulePromises = [];

        $scope.partidoExistente = {
            id: null,
            claveConsulta: 'Offline',
            claveEdicion: null,
            idServidor: null,
            inicio: null,
            fin: null
        };

        $scope.popover

        $ionicPlatform.ready(function () {
            console.log('GolfApp', 'juego.$ionicPlatform.ready()');

            /*
             $q.all(modulePromises).then(function () {
             if ($scope.partidoExistente.id) {
             // console.log('GolfApp', 'Partido local existente');

             modulePromises.push(sincronizarPartidos());
             modulePromises.push(loadPuntos());
             } else {
             // console.log('GolfApp', 'Partido local no' +
             //     ' existente');

             modulePromises.push(insertarPartidoLocal());

             $q.all(modulePromises).then(function () {
             modulePromises.push(sincronizarPartidos());
             });
             }

             $q.all(modulePromises).then(function () {
             actualizarScoreUi();

             setTimeout(function () {
             compartirScoreboard();
             }, 1000);

             fixRowsAndColumns();

             setTimeout(function () {
             $ionicLoading.hide();
             if ($scope.partidoExistente.idServidor) {
             popup('Clave de consulta', '<h1>'
             + $scope.partidoExistente.claveConsulta
             + '</h1>');
             }
             }, 1000);
             });
             });
             */

            showLoading();

            modulePromises.push(loadCampo());
            modulePromises.push(loadJugadores());

            $q.all(modulePromises)
                .then(function () {
                    $scope.partido = new Partido($scope.jugadores, $scope.campo);
                    modulePromises.push(loadPartidoLocal());
                    modulePromises.push(loadApuestas());
                    return $q.all(modulePromises);
                })
                .then(function () {
                    if ($scope.foursomeSeleccionada) {
                        setTimeout(function () {
                            $scope.partido.apuestas.find('nassau').apuesta.actualizar();
                        }, 5000);
                    }

                    if ($scope.partidoExistente.id) {
                        modulePromises.push(sincronizarPartidos());
                        modulePromises.push(loadPuntos());
                    } else {
                        modulePromises.push(insertarPartidoLocal());

                        $q.all(modulePromises).then(function () {
                            modulePromises.push(sincronizarPartidos());
                        });
                    }

                    return $q.all(modulePromises);
                })
                .then(function () {

                    actualizarScoreUi();

                    fixRowsAndColumns();

                    setTimeout(function () {
                        $ionicLoading.hide();
                        if ($scope.partidoExistente.idServidor) {
                            utils.popup('Clave de consulta',
                                '<h1 class="monospaced">'
                                + $scope.partidoExistente.claveConsulta
                                + '</h1>');
                        }
                    }, 1000);

                });

            $ionicPopover.fromTemplateUrl(
                'templates/opciones_partido_popover.html', {
                    scope: $scope
                }).then(function (popover) {
                opcionesPopover = popover;
            });

            screen.orientation.addEventListener('change', function () {
                $state.reload();
            });
        });

        function loadPartidoLocal() {
            var queryPartido = 'SELECT * FROM partido';

            var loadPartido = $cordovaSQLite.execute(db, queryPartido)
                .then(function (res) {
                    if (res.rows.length != 0) {
                        var partidoRow = res.rows.item(0);
                        // console.log('GolfApp', 'Partido' +
                        //     ' local: ' + JSON.stringify(partidoRow));
                        $scope.partidoExistente = {
                            id: partidoRow.id,
                            claveConsulta: partidoRow.clave_consulta,
                            claveEdicion: partidoRow.clave_edicion,
                            idServidor: partidoRow.id_servidor,
                            inicio: partidoRow.inicio,
                            fin: partidoRow.fin
                        };
                    } else {
                        // console.log('GolfApp', 'Partido local: No hay');
                    }
                });

            modulePromises.push(loadPartido);
        }

        function loadApuestas() {
            var queryApuestas = "SELECT id, nombre FROM apuesta WHERE" +
                " seleccionada = 1";

            var apuestas = $cordovaSQLite.execute(db, queryApuestas)
                .then(function (res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        if (res.rows.item(i).nombre.toLowerCase()
                            == 'units') {
                            $scope.rayasSeleccionada = true;
                            $scope.tablero.rayasSeleccionada = true;
                        } else if (res.rows.item(i).nombre.toLowerCase()
                            == 'rabbits') {
                            $scope.conejaSeleccionada = true;
                            $scope.tablero.conejaSeleccionada = true;
                        } else if (res.rows.item(i).nombre.toLowerCase()
                            == 'nassau') {
                            $scope.foursomeSeleccionada = true;
                            $scope.tablero.foursomeSeleccionada = true;
                        }
                    }

                    if ($scope.rayasSeleccionada) {
                        modulePromises.push(agregarApuestaRayas());
                    }

                    if ($scope.conejaSeleccionada) {
                        modulePromises.push(agregarApuestaConeja());
                    }

                    if ($scope.foursomeSeleccionada) {
                        modulePromises.push(agregarApuestaFoursome());
                    }
                });

            modulePromises.push(apuestas)
        }

        function agregarApuestaRayas() {
            console.log('GolfApp', 'juego.agregarApuestaRayas()');

            $scope.partido.agregarApuesta('units',
                new ApuestaRayas($scope.partido));

            $.each($scope.tablero.datos_juego, function (index, dato) {
                dato.apuestaRayas = {
                    unidades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0],
                    units: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0],
                    style_rayas: []
                }
            });
        }

        function agregarApuestaConeja() {
            console.log('GolfApp', 'juego.agregarApuestaConeja()');

            $scope.partido.agregarApuesta('rabbits',
                new ApuestaConeja($scope.partido));

            $.each($scope.tablero.datos_juego, function (index, dato) {
                dato.apuestaConeja = {
                    status: ['.', '.', '.', '.', '.', '.', '.', '.', '.',
                        '.', '.', '.', '.', '.', '.', '.', '.', '.']
                };
            });
        }

        var apuestaFoursome;

        function agregarApuestaFoursome() {
            console.log('GolfApp', 'juego.agregarApuestaFoursome()');

            var modoJugadores = undefined;
            var modoPresiones = undefined;

            var promise = $q.when()
                .then(function () {
                    return getFoursomeModalidad();
                })
                .then(function (data) {
                    if (data != undefined) {
                        modoJugadores = data.modoJugadores;
                        modoPresiones = data.modoPresiones;

                        $scope.tablero.configFoursome = data;

                        apuestaFoursome = new ApuestaFoursome($scope.partido,
                            modoJugadores, modoPresiones);
                        $scope.partido.agregarApuesta('nassau',
                            apuestaFoursome);
                    }
                    return getFoursomeParejas();
                })
                .then(function (data) {
                    $scope.tablero.apuestaFoursome = [];

                    // console.log('ModoJugadores', modoJugadores);

                    if (modoJugadores == 'pareja') {
                        modulePromises.push(agregarCompeticionesFoursome(data, 'pareja', 0));
                    } else if (modoJugadores == 'individual') {
                        modulePromises.push(agregarCompeticionesFoursome(data, 'individual', 0));
                    }
                })
                .catch(function (error) {
                    console.log('GolfApp', error);
                });

            modulePromises.push(promise);
        }

        function getFoursomeModalidad() {
            var defered = $q.defer();
            var promise = defered.promise;

            var selectQuery = 'SELECT * FROM config_foursome';

            sql.sqlQuery(db, selectQuery, [])
                .then(function (res) {
                    if (res.rows.length > 0) {
                        var configuracion = {
                            modoJugadores: res.rows.item(0).modo_jugadores,
                            modoPresiones: res.rows.item(0).modo_presiones
                        };
                        defered.resolve(configuracion);
                    } else {
                        defered.reject('No hay configuración Nassau');
                    }
                })
                .catch(function (error) {
                    defered.reject(error);
                });

            return promise;
        }

        function getFoursomeParejas() {
            var defered = $q.defer();
            var promise = defered.promise;

            var query = "SELECT * FROM nassau";

            sql.sqlQuery(db, query, [])
                .then(function (res) {
                    if (res.rows.length > 0) {
                        defered.resolve(res.rows);
                    } else {
                        defered.reject('No hay parejas Nassau');
                    }
                })
                .catch(function (error) {
                    defered.reject(error);
                });

            return promise;
        }

        function agregarCompeticionesFoursome(parejas, tipoCompeti, idx) {
            if (tipoCompeti == 'pareja') {
                var p1j1 = {
                    id: parejas.item(idx).p1_j1_id,
                    nombre: parejas.item(idx).p1_j1_nombre,
                    idx: parejas.item(idx).p1_j1_idx,
                    handicap: parejas.item(idx).p1_j1_handicap
                };

                var p1j2 = {
                    id: parejas.item(idx).p1_j2_id,
                    nombre: parejas.item(idx).p1_j2_nombre,
                    idx: parejas.item(idx).p1_j2_idx,
                    handicap: parejas.item(idx).p1_j2_handicap
                };

                var p2j1 = {
                    id: parejas.item(idx).p2_j1_id,
                    nombre: parejas.item(idx).p2_j1_nombre,
                    idx: parejas.item(idx).p2_j1_idx,
                    handicap: parejas.item(idx).p2_j1_handicap
                };

                var p2j2 = {
                    id: parejas.item(idx).p2_j2_id,
                    nombre: parejas.item(idx).p2_j2_nombre,
                    idx: parejas.item(idx).p2_j2_idx,
                    handicap: parejas.item(idx).p2_j2_handicap
                };

                $scope.hayMudo = p1j1.nombre == "Mudo" || p1j2.nombre == "Mudo"
                    || p2j1.nombre == "Mudo" || p2j2.nombre == "Mudo";

                $scope.tablero.apuestaFoursome.push({
                    p1_j1: p1j1,
                    p1_j2: p1j2,
                    p2_j1: p2j1,
                    p2_j2: p2j2,
                    p1_puntos: [
                        [], [], [], [], [], [], [], [], [], [], [], [], [], [],
                        [], [], [], []
                    ]
                });

                modulePromises.push(apuestaFoursome.agregarCompeticionPareja(
                    p1j1, p1j2, parejas.item(idx).p1_jug_ventaja, p2j1, p2j2,
                    parejas.item(idx).p2_jug_ventaja
                ));
            } else if (tipoCompeti == 'individual') {
                var j1 = {
                    id: parejas.item(idx).p1_j1_id,
                    nombre: parejas.item(idx).p1_j1_nombre,
                    idx: parejas.item(idx).p1_j1_idx,
                    handicap: parejas.item(idx).p1_j1_handicap
                };

                var j2 = {
                    id: parejas.item(idx).p1_j2_id,
                    nombre: parejas.item(idx).p1_j2_nombre,
                    idx: parejas.item(idx).p1_j2_idx,
                    handicap: parejas.item(idx).p1_j2_handicap
                };

                $scope.tablero.apuestaFoursome.push({
                    j1: j1,
                    j2: j2,
                    p1_puntos: [
                        [], [], [], [], [], [], [], [], [], [], [], [], [], [],
                        [], [], [], []
                    ]
                });

                modulePromises.push(apuestaFoursome
                    .agregarCompeticionIndividual(j1, j2));
            }

            if (idx < parejas.length - 1) {
                modulePromises.push(agregarCompeticionesFoursome(parejas, tipoCompeti, idx + 1));
            }
        }

        function sincronizarPartidos() {
            // console.log('GolfApp', 'sincronizarPartidos');

            if (!$scope.partidoExistente.idServidor) {
                // console.log('GolfApp', 'Partido aún no sincronizado');

                modulePromises.push(subirPartido());

                $q.all(modulePromises).then(function () {
                    updatePartidoLocal();
                });
            } else {
                // console.log('GolfApp', 'Partido ya sincronizado');
            }
        }

        function updatePartidoLocal() {
            // console.log('GolfApp', 'updatePartidoLocal');

            // console.log('Intento subir partido idServidor: ['
            //     + $scope.partidoExistente.idServidor + ']');

            if ($scope.partidoExistente.idServidor) {
                var updateQuery = 'UPDATE partido SET' +
                    ' id_servidor = ?, clave_consulta = ?,' +
                    ' clave_edicion = ?' +
                    ' WHERE id = ?';
                var data = [$scope.partidoExistente.idServidor,
                    $scope.partidoExistente.claveConsulta,
                    $scope.partidoExistente.claveEdicion,
                    $scope.partidoExistente.id];

                // console.log('GolfApp', 'UpdateLocalData: ['
                //     + data.join(', ') + ']');

                var updateLocal = $cordovaSQLite.execute(db,
                    updateQuery, data)
                    .then(function () {
                        $cordovaSQLite.execute(db, 'SELECT *' +
                            ' FROM partido')
                            .then(function (res) {
                                // console.log('GolfApp',
                                //     'LocalSincronizado: ['
                                //     + JSON.stringify(res.rows.item(0))
                                //     + ']');
                            })
                    });
                modulePromises.push(updateLocal);
            }
        }

        function subirPartido() {
            // console.log('GolfApp', 'subirPartido');
            // console.log('GolfApp', 'Inicio: '
            //     + $scope.partidoExistente.inicio);

            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir + 'partido_insert',
                {
                    inicio: $scope.partidoExistente.inicio,
                    email: 'porfirioads@gmail.com',
                    password: 'holamundo'
                }
            );

            var insertServer = $http(httpRequest)
                .then(function successCallback(response) {
                    if (response.data.ok) {
                        $scope.partidoExistente.claveConsulta
                            = response.data.clave_consulta;
                        $scope.partidoExistente.claveEdicion
                            = response.data.clave_edicion;
                        $scope.partidoExistente.idServidor
                            = response.data.partido_id;
                        console.log('GolfApp', '[OK] Insertar partido en' +
                            ' servidor ['
                            + [$scope.partidoExistente.claveConsulta,
                                $scope.partidoExistente.claveEdicion,
                                $scope.partidoExistente.idServidor]
                                .join(', ') + ']');
                    } else {
                        console.log('GolfApp', response.config.url + '['
                            + response.config.method + ']: '
                            + response.data.error_message);
                    }
                }, function errorCallback(response) {
                    if (response.status == -1) {
                        console.log('GolfApp', response.config.url + '['
                            + response.config.method + ']: '
                            + 'Error de conexión');
                    } else {
                        console.log('GolfApp', response.config.url + '['
                            + response.config.method + ']: '
                            + response.data.error_message);
                    }
                });

            modulePromises.push(insertServer);
        }

        function insertarPartidoLocal() {
            // console.log('GolfApp', 'insertarPartidoLocal');

            var insertQuery = 'INSERT INTO partido (inicio) VALUES (?)';

            $scope.partidoExistente.inicio = moment()
                .format("YYYY-MM-DD h:mm:ss");

            var insertLocal = $cordovaSQLite.execute(db, insertQuery,
                [$scope.partidoExistente.inicio])
                .then(function successCallback(res) {
                    // console.log(JSON.stringify(res))
                    $scope.partidoExistente.id = res.insertId;
                    // console.log('GolfApp', '[OK] Partido local inserted');
                }, function errorCallback(res) {
                    // console.log('GolfApp', '[ERROR] Partido local inserted');
                });

            modulePromises.push(insertLocal);
        }

        $scope.selectFoursome = function () {
            opcionesPopover.hide();

            actualizarScoreUi();

            var tableroToShare = getTableroToShare();

            setTimeout(function () {
                refreshLocalTablero(tableroToShare).then(function () {
                    var query = "UPDATE consulta_json SET clave = ?";
                    sql.sqlQuery(db, query, [0])
                        .then(function (res) {
                            $state.go('juego_foursome');
                        })
                        .catch(function (error) {
                            console.log(JSON.stringify(error))
                        });
                }).catch(function (error) {
                    console.log('$scope.selectFoursome [OK]');
                });
            }, 300);
        };

        $scope.showOpcionesPartido = function ($event) {
            opcionesPopover.show($event);
        };

        $scope.finalizarPartido = function () {
            opcionesPopover.hide();

            $scope.finPartido = moment().format("YYYY-MM-DD h:mm:ss");

            var confirmPopup = $ionicPopup.confirm({
                title: 'Finalizar partido',
                template: '¿Estás seguro de que quieres finalizar el' +
                ' partido? Ya no podrás editar el tablero',
                cancelText: 'Cancelar',
                cancelType: 'button-assertive',
                okText: 'Finalizar'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    modulePromises.push(finalizarPartidoLocal());
                    finalizarPartidoServer();
                    $state.go('inicio');

                    $q.all(modulePromises).then(function () {
                        if (!$scope.partidoExistente.id) {
                            finalizarPartidoServer();
                        }
                        $state.go('inicio');
                    });
                }
            });
        };

        function finalizarPartidoLocal() {
            // console.log('GolfApp', 'finalizarPartidoLocal');

            var deletePuntosQuery = 'DELETE FROM puntuaciones';
            var deletePartidoQuery = 'DELETE FROM partido';

            var deletePuntos = $cordovaSQLite.execute(db, deletePuntosQuery)
                .then(function (res) {
                    var deletePartido = $cordovaSQLite
                        .execute(db, deletePartidoQuery)
                        .then(function (res) {
                            opcionesPopover.hide();
                            $scope.partidoExistente.id = null;
                        });

                    modulePromises.push(deletePartido);
                });

            modulePromises.push(deletePuntos);
        }

        function finalizarPartidoServer() {
            // console.log('GolfApp', 'finalizarPartidoServer');

            var httpRequest = serviceHttpRequest.createPutHttpRequest(
                dir + 'partido_finalizar',
                {
                    fin: $scope.finPartido,
                    clave_edicion: $scope.partidoExistente.claveEdicion,
                    partido_id: $scope.partidoExistente.idServidor
                }
            );

            $http(httpRequest)
                .then(function successCallback(response) {
                    if (!response.data.ok) {
                        // console.log('GolfApp', response.config.url + '['
                        //     + response.config.method + ']: '
                        //     + response.data.error_message);
                    }
                }, function errorCallback(response) {
                    if (response.status == -1) {
                        // console.log('GolfApp', response.config.url + '['
                        //     + response.config.method + ']: '
                        //     + 'Error de conexión');
                    } else {
                        // console.log('GolfApp', response.config.url + '['
                        //     + response.config.method + ']: '
                        //     + response.data.error_message);
                    }
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
        }

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
                            totales_golpes: [0, 0, 0, 0],
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

                                var registrar = $scope.partido
                                    .registrarGolpes(j,
                                        resPunt.rows.item(i).hoyo - 1,
                                        resPunt.rows.item(i).golpes,
                                        resPunt.rows.item(i).unidades);

                                modulePromises.push(registrar);
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

        $scope.guardarPuntos = function (jugador_idx, jugador_id, hoyo) {
            $scope.juego = {};

            $ionicPopup.show({
                templateUrl: 'templates/registro_puntos_popup.html',
                title: 'Registro de puntos.',
                subTitle: 'Jugador: '
                + $scope.jugadores[jugador_idx].nombre + ', Hoyo: '
                + hoyo + '.',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive'
                    },
                    {
                        text: 'Guardar',
                        type: 'button-positive',
                        onTap: function (e) {
                            var golpesRealizaos = $scope.juego.golpesRealizados;
                            var unidades = $scope.juego.puntosExtras;
                            unidades = unidades ? unidades : 0;

                            var regex = new RegExp('^[0-9]*$');

                            var entradaCorrecta = true;

                            if ($scope.rayasSeleccionada) {
                                // console.log('RayasIsSeleccionada');
                                if (!regex.test(unidades)) {
                                    console.log('UnidadesFormatIncorrect');
                                    $scope.juego.style_unidades = 'background-color: red';
                                    e.preventDefault();
                                    entradaCorrecta = false;
                                }
                            }

                            if (golpesRealizaos) {
                                // console.log('GolpesInserted');
                                if (regex.test(golpesRealizaos)) {
                                    // console.log('GolpesFormatCorrect');
                                    if (entradaCorrecta) {
                                        if ($scope.rayasSeleccionada) {
                                            $scope.tablero.datos_juego[jugador_idx]
                                                .apuestaRayas.unidades[hoyo - 1]
                                                = unidades;
                                        }

                                        $scope.tablero.datos_juego[jugador_idx]
                                            .golpes[hoyo - 1] = golpesRealizaos;

                                        var promises = [];

                                        promises.push(guardarPuntosDb(jugador_id,
                                            hoyo, golpesRealizaos, unidades));

                                        promises.push($scope.partido
                                            .registrarGolpes(jugador_idx,
                                                (hoyo - 1), golpesRealizaos,
                                                unidades));

                                        $q.all(promises).then(function () {
                                            actualizarScoreUi();
                                            setTimeout(function () {
                                                compartirScoreboard();
                                            });
                                        });
                                    }
                                } else {
                                    $scope.juego.style_golpes = 'background-color: red';
                                    e.preventDefault();
                                }
                            } else {
                                $scope.juego.style_golpes = 'background-color: red';
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        };

        function refreshLocalTablero(tableroToShare) {
            var defered = $q.defer();
            var promise = defered.promise;

            var deleteQuery = 'DELETE FROM tablero_json';
            var insertQuery = 'INSERT INTO tablero_json (tablero) VALUES (?)';
            var insertData = [JSON.stringify(tableroToShare)];

            sql.sqlQuery(db, deleteQuery, [])
                .then(function (res) {
                    // console.log('GolfApp', deleteQuery + ' [OK]');
                    return sql.sqlQuery(db, insertQuery, insertData);
                })
                .then(function (res) {
                    // console.log('GolfApp', insertQuery + ' [OK]');
                    defered.resolve('refreshLocalTablero() [OK]')
                })
                .catch(function (error) {
                    console.log('GolfApp', error);
                    defered.reject(error);
                });

            return promise;
        }

        function getParesArray() {
            var pares = [];
            $.each($scope.campo.pares, function (index, value) {
                pares.push(value.value);
            });
            return pares;
        }

        function getTableroToShare() {
            var tableroToShare = {};

            if ($scope.hayMudo) {
                console.log('Se agregará el mudo al tablero para compartir');
                tableroToShare = jQuery.extend(true, {}, $scope.tablero);

                tableroToShare.datos_juego.push({
                    index: tableroToShare.length,
                    nombre: "Mudo",
                    handicap: 0,
                    jugador_id: 9999,
                    golpes: getParesArray(),
                    totales_golpes: [0, 0, 0, 0],
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
            } else {
                console.log('No se agregará el mudo al tablero para compartir');
                tableroToShare = $scope.tablero;
            }

            return tableroToShare;
        }

        function compartirScoreboard() {
            console.log('GolfApp', 'compartirScoreboard');

            //------------------------------------------------------------------
            var tableroToShare = getTableroToShare();
            //------------------------------------------------------------------

            var sincroPromises = [];

            if (!$scope.partidoExistente.idServidor) {
                console.log('GolfApp', 'compartirScoreboard [Offline]');
                sincroPromises.push(sincronizarPartidos());
            } else {
                console.log('GolfApp', 'compartirScoreboard [Online]');
            }

            $q.all(sincroPromises).then(function () {
                $scope.partidoSincronizado = false;

                var httpRequest = serviceHttpRequest.createPostHttpRequest(
                    dir + 'partido_tablero_write',
                    {
                        partido_id: $scope.partidoExistente.idServidor,
                        clave_edicion: $scope.partidoExistente.claveEdicion,
                        tablero_json: JSON.stringify(tableroToShare)
                    }
                );

                $http(httpRequest)
                    .then(function successCallback(response) {
                        if (response.data.ok) {
                            console.log('$scope.partidoSincronizado = true;')
                            $scope.partidoSincronizado = true;
                        } else {
                            console.log('ERROR', response.config.url + '['
                                + response.data.error_message + ']');
                        }
                    }, function errorCallback(response) {
                        if (response.status === -1) {
                            console.log('ERROR', response.config.url +
                                '[Error de Conexión]');
                        } else {
                            console.log('ERROR', response.config.url + '['
                                + response.data.error_message + ']');
                        }
                    });
            });
        }

        $scope.lastData = {
            golpes: null,
            handicap: null
        };

        function actualizarScoreUi() {
            // console.log('GolfApp', 'actualizarScoreUi');

            var numJugadores = $scope.tablero.datos_juego.length;

            for (var i = 0; i < numJugadores; i++) {
                var golpesTotales1a9 = 0;
                var golpesTotales10a18 = 0;
                var golpesTotalesTotal = 0;
                var golpesMenosHandicap = 0;

                for (var j = 0; j < 18; j++) {
                    if ($scope.rayasSeleccionada) {
                        var apuestaRayas = $scope.partido.apuestas
                            .find('units');

                        var units =
                            apuestaRayas.apuesta.scoreRayas[i].puntos[j];

                        units = units ? units : 0;
                        $scope.tablero.datos_juego[i].apuestaRayas.units[j]
                            = units;

                        if (units < 0)
                            $scope.tablero.datos_juego[i].apuestaRayas
                                .style_rayas[j] = 'color: red;';
                        else if (units > 0)
                            $scope.tablero.datos_juego[i].apuestaRayas
                                .style_rayas[j] = 'color: green';
                        else
                            $scope.tablero.datos_juego[i].apuestaRayas
                                .style_rayas[j] = 'color: black';
                    }

                    if ($scope.conejaSeleccionada) {
                        var apuestaConeja = $scope.partido.apuestas
                            .find('rabbits');

                        var status = apuestaConeja.apuesta.scoreConeja[i].status[j];

                        $scope.tablero.datos_juego[i]
                            .apuestaConeja.status[j] = status;
                    }

                    if ($scope.foursomeSeleccionada) {
                        var apuestaFoursome = $scope.partido.apuestas
                            .find('nassau').apuesta;

                        $.each(apuestaFoursome.competiciones,
                            function (index, competi) {
                                $scope.tablero.apuestaFoursome[index].p1_puntos
                                    = competi.puntuaciones;
                            });
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

                golpesTotalesTotal = golpesTotales1a9 + golpesTotales10a18;
                golpesMenosHandicap = golpesTotalesTotal
                    - $scope.tablero.datos_juego[i].handicap;
                $scope.tablero.datos_juego[i].totales_golpes[0]
                    = golpesTotales1a9;
                $scope.tablero.datos_juego[i].totales_golpes[1]
                    = golpesTotales10a18;
                $scope.tablero.datos_juego[i].totales_golpes[2]
                    = golpesTotalesTotal;
                $scope.tablero.datos_juego[i].totales_golpes[3]
                    = golpesMenosHandicap;
            }
        }

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
                                // console.log("UPDATE ID -> " + res.insertId);
                            }, function (err) {
                                console.error(err);
                            });
                    } else {
                        $cordovaSQLite.execute(db, insertDatos, [hoyo, golpes,
                            unidades, id_jugador])
                            .then(function (res) {
                                // console.log("INSERT ID -> " + res.insertId);
                            }, function (err) {
                                console.error(err);
                            });
                    }
                }, function (err) {
                    console.error(err);
                });
        }

        $scope.actualizarJuego = function () {
            // opcionesPopover.hide();
            console.log('juego.$scope.actualizarJuego');
            actualizarScoreUi();
            setTimeout(function () {
                compartirScoreboard();
            }, 1000);
        };

        $scope.recargarJuego = function () {
            opcionesPopover.hide();
            $state.reload();
        };

    });
