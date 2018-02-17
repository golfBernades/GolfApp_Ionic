angular.module('starter.inicio', ['ionic'])

    .controller('inicioController', function ($scope, $cordovaSQLite, $state,
                                              $ionicPlatform, $ionicPopup, $ionicLoading,
                                              $http, sql, serviceHttpRequest, utils,
                                              $q) {

        $scope.data = {
            clave: "abcdefgh",
            styleClave: ''
        };

        $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-in";

        $scope.seleccionarJugadores = function () {
            $state.go('seleccion_jugadores');
            // if (sesionActual) {
            //     $state.go('seleccion_jugadores');
            // } else {
            //     confirmSesion()
            // }
        };

        $scope.verificarSesion = function () {
            if (sesionActual) {
                logOut();
            } else {
                logIn();
            }
        };

        $scope.acercaDe = function () {
            $state.go('acercaDe')
        };

        function verificarClave(intento) {

            var httpRequest = serviceHttpRequest.createPostHttpRequest(
                dir + 'partido_consulta_exists',
                {clave_consulta: $scope.data.clave}
            );

            $http(httpRequest)
                .then(function successCallback(response) {

                    $ionicLoading.hide();
                    if (response.data.ok) {

                        if (response.data.exists) {
                            insertClave($scope.data.clave)
                        } else {
                            utils.popup('Error de clave', 'No se pudo' +
                                ' encontrar esa clave. Volver a intentar');
                        }
                    } else {
                        utils.popup('Error de clave', 'No se pudo encontrar' +
                            ' esa clave. Volver a intentar más tarde.');
                    }

                }, function errorCallback(response) {

                    if (response.status == -1) {
                        if (intento < 3) {
                            verificarClave(intento + 1);
                        } else {
                            $ionicLoading.hide();
                            utils.popup("Error de Conexión", "Volver a" +
                                " intentar más tarde");
                        }
                    } else {
                        $ionicLoading.hide();
                        // utils.popup("Error de Parámetros", "Revisar los" +
                        //     " parámetros de la petición HTTP");
                    }
                });
        }

        function confirmSesion() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Iniciar Sesión',
                template: 'Para poder avanzar debes iniciar sesión',
                okText: 'Ingresar',
                okType: 'button-positive',
                cancelText: 'Cancelar',
                cancelType: 'button-assertive'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    logIn()
                }
            });
        }

        function logIn() {
            $state.go('login');
        }

        function logOut() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Cerrar Sesión',
                template: '¿Estás seguro de querer salir de tu cuenta?',
                okText: 'Salir',
                okType: 'button-positive',
                cancelText: 'Cancelar',
                cancelType: 'button-assertive'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    deleteUser();
                    deselectCampo();
                    sesionActual = false;
                    $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-in";
                }
            });
        }

        function deleteUser() {
            var query = 'DELETE FROM usuario';
            $cordovaSQLite.execute(db, query);
        }

        function deselectCampo() {
            var query = 'UPDATE campo SET seleccionado = 0';
            $cordovaSQLite.execute(db, query);
        }

        function insertClave(clave) {
            var query = "INSERT INTO clave (clave) VALUES (?)";
            $cordovaSQLite.execute(db, query, [clave])
                .then(function (res) {
                    $state.go('juego_consulta');
                }, function (err) {
                    console.log(JSON.stringify(err))
                });
        }

        $scope.consultaJuego = function () {
            var query = "SELECT * FROM clave";

            $cordovaSQLite.execute(db, query)
                .then(function (res) {
                    if (res.rows.length > 0) {
                        $state.go('juego_consulta');
                    } else {
                        pedirClave();
                    }
                }, function (err) {
                    console.log(JSON.stringify(err))
                });
        };

        function pedirClave() {
            $ionicPopup.show({
                title: 'Ingresar Clave del Partido',
                templateUrl: 'templates/clave_consulta_popup.html',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive'
                    },
                    {
                        text: 'Verificar',
                        type: 'button-positive',
                        onTap: function (e) {
                            if ($scope.data.clave) {
                                utils.showLoading();
                                verificarClave(0)
                            } else {
                                $scope.data.styleClave = 'background-color:red';
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        }

        $scope.insertTestData = function () {
            var defered = $q.defer();
            var promise = defered.promise;

            var insertJugador = 'INSERT INTO jugador (id, nombre, handicap,'
                + ' jugar) VALUES (?, ?, ?, ?)';

            var jug1Data = [1, 'Beto', 4, 1]; // 0
            var jug2Data = [2, 'Moy', 5, 1]; // 2
            var jug3Data = [3, 'JLuis', 5, 1]; // 1
            var jug4Data = [4, 'Rafa', 5, 1]; // 3
            var jug5Data = [5, 'Micho', 9, 1]; // 4

            var selectApuesta = 'UPDATE apuesta SET seleccionada=1';

            var insertPuntuaciones = 'INSERT INTO `puntuaciones` ' +
                'VALUES (1,1,5,0,1), (2,1,5,0,2), (3,1,8,0,3), ' +
                '(4,1,5,0,4), (5,1,5,0,5), (6,2,7,0,1), (7,2,5,0,2), ' +
                '(8,2,5,0,3), (9,2,4,0,4), (10,2,4,0,5), (11,3,3,0,1), ' +
                '(12,3,4,0,3), (13,3,3,0,2), (14,3,3,0,4), (15,3,4,0,5), ' +
                '(16,4,4,0,1), (17,4,4,0,2), (18,4,4,0,3), (19,4,4,0,4), ' +
                '(20,4,6,0,5), (21,5,4,0,1), (22,5,3,0,3), (23,5,3,0,2), ' +
                '(24,5,3,0,4), (25,5,3,0,5), (26,6,4,0,1), (27,6,4,0,3), ' +
                '(28,6,4,0,2), (29,6,4,0,4), (30,6,5,0,5), (31,7,5,0,1), ' +
                '(32,7,4,0,3), (33,7,5,0,2), (34,7,4,0,4), (35,7,4,0,5), ' +
                '(36,8,4,0,1), (37,8,4,0,3), (38,8,4,0,2), (39,8,4,0,4), ' +
                '(40,8,5,0,5), (41,9,5,0,1), (42,9,5,0,3), (43,9,7,0,2), ' +
                '(44,9,5,0,4), (45,9,4,0,5), (46,10,5,0,1), (47,10,5,0,3), ' +
                '(48,10,6,0,2), (49,10,5,0,4), (50,11,4,0,1), (51,11,3,0,3), ' +
                '(52,11,3,0,2), (53,11,4,0,4), (54,12,3,0,1), (55,12,4,0,3), ' +
                '(56,12,4,0,2), (57,12,4,0,4), (58,10,5,0,5), (59,11,4,0,5), ' +
                '(60,12,3,0,5), (61,13,5,0,1), (62,13,4,0,3), (63,13,4,0,2), ' +
                '(64,13,4,0,4), (65,13,4,0,5), (66,14,3,0,1), (67,14,3,0,3), ' +
                '(68,14,4,0,2), (69,14,4,0,4), (70,14,3,0,5), (71,15,4,0,1), ' +
                '(72,15,5,0,3), (73,15,5,0,2), (74,15,5,0,4), (75,15,5,0,5), ' +
                '(76,16,5,0,1), (77,16,3,0,3), (78,16,5,0,2), (79,16,4,0,4), ' +
                '(80,16,6,0,5), (81,17,4,0,1), (82,17,3,0,3), (83,17,5,0,2), ' +
                '(84,17,4,0,4), (85,17,5,0,5), (86,18,5,0,1), (87,18,4,0,3), ' +
                '(88,18,4,0,2), (89,18,5,0,4), (90,18,4,0,5);';

            $q.when()
                .then(function () {
                    return $cordovaSQLite.execute(db, insertJugador, jug1Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertJugador');
                    return $cordovaSQLite.execute(db, insertJugador, jug2Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertJugador');
                    return $cordovaSQLite.execute(db, insertJugador, jug3Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertJugador');
                    return $cordovaSQLite.execute(db, insertJugador, jug4Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertJugador');
                    return $cordovaSQLite.execute(db, insertJugador, jug5Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertJugador');
                    return $cordovaSQLite.execute(db, selectApuesta);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> selectApuesta');
                    return insertFoursomeParejasData();
                })
                // .then(function () {
                //     console.log('GolfApp', '[OK] -> selectApuesta');
                // return insertFoursomeIndividualData();
                // })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertFoursomeData');
                    return $cordovaSQLite.execute(db, insertPuntuaciones);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertPuntuaciones');
                    // console.log('Database llenada');
                    defered.resolve('Database llenada');
                    utils.popup('INFO', 'Database llenada');
                })
                .catch(function (error) {
                    console.log(JSON.stringify(error));
                    defered.reject(error);
                    // utils.popup('ERROR', JSON.stringify(error));
                });

            return promise;
        };

        function insertFoursomeParejasData() {
            var defered = $q.defer();
            var promise = defered.promise;

            var updateConfigFoursome = 'UPDATE config_foursome SET ' +
                'modo_jugadores=?, modo_presiones=?, pareja_idx=?';

            var configFoursomeData = ['pareja', 'normal', 0];

            var insertFoursome = 'INSERT INTO nassau ('
                + 'p1_j1_id, p1_j1_nombre, p1_j1_handicap, p1_j1_idx, '
                + 'p1_j2_id, p1_j2_nombre, p1_j2_handicap, p1_j2_idx, '
                + 'p2_j1_id, p2_j1_nombre, p2_j1_handicap, p2_j1_idx, '
                + 'p2_j2_id, p2_j2_nombre, p2_j2_handicap, p2_j2_idx, '
                + 'p1_jug_ventaja, p2_jug_ventaja'
                + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

            var four1Data = [1, 'Beto', 4, 0, 2, 'Moy', 5, 2, 3, 'JLuis', 5, 1,
                4, 'Rafa', 5, 3, 1, 1];
            var four2Data = [1, 'Beto', 4, 0, 2, 'Moy', 5, 2, 3, 'JLuis', 5, 1,
                5, 'Micho', 9, 4, 1, 2];
            var four3Data = [1, 'Beto', 4, 0, 2, 'Moy', 5, 2, 4, 'Rafa', 5, 3,
                5, 'Micho', 9, 4, 1, 2];

            $q.when()
                .then(function () {
                    return $cordovaSQLite.execute(db, updateConfigFoursome,
                        configFoursomeData);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> updateConfigFoursome');
                    return $cordovaSQLite.execute(db, insertFoursome,
                        four1Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertFoursome');
                    return $cordovaSQLite.execute(db, insertFoursome,
                        four2Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertFoursome');
                    return $cordovaSQLite.execute(db, insertFoursome,
                        four3Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertFoursomeParejasData');
                    defered.resolve('OK');
                })
                .catch(function (error) {
                    defered.reject(error);
                });

            return promise;
        }

        function insertFoursomeIndividualData() {
            var defered = $q.defer();
            var promise = defered.promise;

            var updateConfigFoursome = 'UPDATE config_foursome SET ' +
                'modo_jugadores=?, modo_presiones=?, pareja_idx=?';

            var configFoursomeData = ['individual', 'california', 0];

            var insertFoursome = 'INSERT INTO nassau ('
                + 'p1_j1_id, p1_j1_nombre, p1_j1_handicap, p1_j1_idx, '
                + 'p1_j2_id, p1_j2_nombre, p1_j2_handicap, p1_j2_idx'
                + ') VALUES (?,?,?,?,?,?,?,?)';

            var four1Data = [1, 'Beto', 4, 0, 2, 'Moy', 5, 2];
            var four2Data = [3, 'JLuis', 5, 1, 4, 'Rafa', 5, 3];
            var four3Data = [3, 'JLuis', 5, 1, 5, 'Micho', 9, 4];
            var four4Data = [4, 'Rafa', 5, 3, 5, 'Micho', 9, 4];

            $q.when()
                .then(function () {
                    return $cordovaSQLite.execute(db, updateConfigFoursome,
                        configFoursomeData);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> updateConfigFoursome');
                    return $cordovaSQLite.execute(db, insertFoursome,
                        four1Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertFoursome');
                    return $cordovaSQLite.execute(db, insertFoursome,
                        four2Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertFoursome');
                    return $cordovaSQLite.execute(db, insertFoursome,
                        four3Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertFoursome');
                    return $cordovaSQLite.execute(db, insertFoursome,
                        four4Data);
                })
                .then(function () {
                    // console.log('GolfApp', '[OK] -> insertFoursomeParejasData');
                    defered.resolve('OK');
                })
                .catch(function (error) {
                    defered.reject(error);
                });

            return promise;
        }

        $scope.emptyDatabase = function () {
            var defered = $q.defer();
            var promise = defered.promise;

            var emptyPuntuaciones = 'DELETE FROM puntuaciones';
            var emptyApuesta = 'UPDATE apuesta SET seleccionada = 0';
            var emptyCampo = 'DELETE FROM campo';
            var emptyClave = 'DELETE FROM clave';
            var emptyConfigFoursome = "UPDATE config_foursome SET" +
                " pareja_idx=0, modo_jugadores='pareja'," +
                " modo_presiones='normal'";
            var emptyFoursome = 'DELETE FROM nassau';
            var emptyJugador = 'DELETE FROM jugador';
            var emptyPantalla = 'DELETE FROM pantalla';
            var emptyPartido = 'DELETE FROM partido';
            var emptyTableroJson = 'DELETE FROM tablero_json';
            var emptyUsuario = 'DELETE FROM usuario';

            $q.when()
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyPuntuaciones);
                })
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyApuesta);
                })
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyCampo);
                })
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyClave);
                })
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyConfigFoursome);
                })
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyFoursome);
                })
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyJugador);
                })
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyPantalla);
                })
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyPartido);
                })
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyTableroJson);
                })
                .then(function () {
                    return $cordovaSQLite.execute(db, emptyUsuario);
                })
                .then(function () {
                    // console.log('Database vaciada');
                    sesionActual = false;
                    $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-in";
                    defered.resolve('Database vaciada');
                    utils.popup('INFO', 'Database vaciada');
                })
                .catch(function (error) {
                    console.log(JSON.stringify(error));
                    defered.reject(error);
                    // utils.popup('ERROR', JSON.stringify(error));
                });

            return promise;
        };

        function isUser() {
            var defered = $q.defer();
            var promise = defered.promise;

            if (sesionActual) {
                $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-out";
            } else {
                $scope.iconStatus = "button button-icon icon-right button-clear glyphicon glyphicon-log-in";
            }
            defered.resolve("OK");

            return promise
        }

        function isJugando() {
            var defered = $q.defer();
            var promise = defered.promise;

            console.log('Jugando: ' + jugando);

            if (jugando) {
                $scope.mensajeJuego = "Continuar juego"
            } else {
                $scope.mensajeJuego = "Iniciar nuevo juego"
            }
            defered.resolve("OK");

            return promise
        }

        function loadUser() {
            var defered = $q.defer();
            var promise = defered.promise;

            var query = "SELECT * FROM usuario";
            sql.sqlQuery(db, query, [])
                .then(function (res) {
                    if (res.rows.length > 0) {
                        id_user_app = res.rows.item(0).id;
                        user_app = res.rows.item(0).email;
                        password_app = res.rows.item(0).password;
                        sesionActual = true;
                        jugando = res.rows.item(0).jugando != 0;
                        console.log('jugando database: ' + jugando);
                    } else {
                        sesionActual = false;
                    }

                    defered.resolve("OK");
                })
                .catch(function (error) {
                    defered.reject(error);
                })

            return promise
        }

        function loadInicio() {

            $q.when()
                .then(function () {
                    return loadUser();
                })
                .then(function () {
                    return isUser();
                })
                .then(function () {
                    return isJugando();
                })
                .catch(function (error) {
                    // utils.popup('Error', JSON.stringify(error));
                })
                .finally(function () {

                });
        }

        $ionicPlatform.ready(function () {
            loadInicio()
        });

    });
