angular.module('starter.seleccion-jugadores', ['ionic'])

    .controller('jugadoresController', function ($scope, $ionicPopup,
                                                 $cordovaSQLite, $state,
                                                 $ionicPlatform, $ionicLoading,
                                                 $q, servicePantallas,
                                                 sql, utils) {
        $scope.jugadores = [];

        $scope.data = {
            nombreJug: '',
            handicap: '',
            styleNombre: '',
            styleHandicap: ''
        };

        var modificar = false;

        $scope.seleccionarCampo = function () {

            $q.when()
                .then(function () {
                    return cantidadJugadores();
                })
                .then(function () {
                    return elimiarFousrome();
                })
                .then(function () {
                    return campoSeleccionado();
                })
                .catch(function (error) {
                    utils.popup('Seleccion Jugadores', JSON.stringify(error));
                })
                .finally(function () {

                });
        }

        function cantidadJugadores() {
            var defered = $q.defer();
            var promise = defered.promise;
            var query = "SELECT jugar FROM jugador WHERE jugar = 1";

            sql.sqlQuery(db, query, [])
                .then(function (res) {
                    if (res.rows.length >= 2) {
                        defered.resolve("OK");
                    } else {
                        defered.reject("Debes crear o seleccionar al menos 2" +
                            " los jugadores que participarán en el partido" +
                            " para poder avanzar");
                    }
                })
                .catch(function (err) {
                    defered.reject(err);
                });

            return promise;
        }

        function campoSeleccionado() {
            var defered = $q.defer();
            var promise = defered.promise;

            if(sesionActual) {
                var query = "SELECT seleccionado FROM campo WHERE seleccionado = (?) OR seleccionado = (?)";

                sql.sqlQuery(db, query, [1, 2])
                    .then(function (res) {
                        if (res.rows.length > 0) {
                            switch (res.rows.item(0).seleccionado) {
                                case 1:
                                    $state.go('tabs.camp-dis');
                                    break;
                                case 2:
                                    $state.go('tabs.camp-cue');
                                    break;
                            }
                        } else {
                            $state.go('tabs.camp-dis');
                        }
                        defered.resolve("OK");
                    })
                    .catch(function (err) {
                        defered.reject(err);
                    });
            } else {
                $state.go('tabs.camp-dis');
                defered.resolve("OK");
            }

            return promise;
        }

        function elimiarFousrome() {

            var defered = $q.defer();
            var promise = defered.promise;
            var query = "DELETE FROM nassau";

            if (modificar) {
                sql.sqlQuery(db, query, [])
                    .then(function (res) {
                        defered.resolve("OK");
                    })
                    .catch(function (err) {
                        defered.reject(err);
                    });
            } else {
                defered.resolve("OK");
            }

            return promise;
        }

        $scope.inicio = function () {
            $state.go('inicio');
        };

        $scope.isJugador = function (idJugador, index) {
            var query = "UPDATE jugador SET jugar = ? WHERE id =?";

            modificar = true;
            if ($scope.jugadores[index].jugar) {
                $cordovaSQLite.execute(db, query, [1, idJugador]);
            } else {
                $cordovaSQLite.execute(db, query, [0, idJugador]);
            }
        };

        $scope.deleteJugador = function (index) {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Eliminar jugador',
                template: '¿Estás seguro que deseas eliminar a ' + $scope.jugadores[index].nombre + '?',
                cancelText: 'Cancelar',
                cancelType: 'button-assertive',
                okText: 'Eliminar'

            });

            confirmPopup.then(function (res) {
                if (res) {
                    var query = 'DELETE FROM jugador  WHERE id = ?';
                    $cordovaSQLite.execute(db, query, [$scope.jugadores[index].id]);
                    $scope.jugadores.splice(index, 1);
                    modificar = true;
                }
            });
        };

        $scope.addJugador = function () {
            $scope.data = {};

            $ionicPopup.show({
                templateUrl: 'templates/form_jugador_popup.html',
                title: 'Nuevo jugador',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive'
                    },
                    {
                        text: 'Agregar',
                        type: 'button-positive',
                        onTap: function (e) {
                            var nombre = $scope.data.nombreJug;
                            var handicap = $scope.data.handicap;

                            if (nombre && handicap) {

                                var control = true;

                                for (var i = 0; i < $scope.jugadores.length; i++) {
                                    if (nombre.toLowerCase() == $scope
                                            .jugadores[i].nombre
                                            .toLowerCase()) {
                                        control = false;
                                        break;
                                    }
                                }

                                if (control) {
                                    var query = "INSERT INTO jugador (nombre, "
                                        + "handicap, jugar) VALUES (?, ?, ?)";

                                    var queryData = [nombre, handicap, 0];

                                    $cordovaSQLite.execute(db, query, queryData)
                                        .then(function (res) {
                                            $scope.jugadores.push({
                                                id: res.insertId,
                                                nombre: nombre,
                                                handicap: handicap,
                                                jugar: false
                                            });
                                            modificar = true;
                                        }, function (err) {
                                            console.log(JSON.stringify(err))
                                        });
                                } else {
                                    utils.popup("Jugador repetido",
                                        "El nombre ya se está usando," +
                                        " intenta con otro.");

                                    e.preventDefault();
                                }

                                $scope.data.nombreJug = "";
                                $scope.data.handicap = "";
                            } else {
                                if (!$scope.data.nombreJug)
                                    $scope.data.styleNombre
                                        = 'background-color: red;';
                                if (!$scope.data.handicap)
                                    $scope.data.styleHandicap
                                        = 'background-color: red;';
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        };

        $scope.editJugador = function (index) {
            $scope.data.nombreJug = $scope.jugadores[index].nombre;
            $scope.data.handicap = $scope.jugadores[index].handicap;

            $ionicPopup.show({
                templateUrl: 'templates/form_jugador_popup.html',
                title: 'Editar jugador',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive'
                    },
                    {
                        text: 'Actualizar',
                        type: 'button-positive',
                        onTap: function (e) {
                            var nombre = $scope.data.nombreJug;
                            var handicap = $scope.data.handicap;

                            if (nombre && handicap) {
                                var control = true;

                                for (var i = 0; i < $scope.jugadores.length; i++) {
                                    if (i != index) {
                                        if (nombre.toLowerCase() == $scope
                                                .jugadores[i].nombre
                                                .toLowerCase()) {
                                            control = false;
                                            break;
                                        }
                                    }
                                }

                                if (control) {
                                    var query = "UPDATE jugador SET nombre = ?"
                                        + ", handicap = ? WHERE id = ?";

                                    var queryData = [nombre, handicap,
                                        $scope.jugadores[index].id];

                                    $cordovaSQLite.execute(db, query, queryData)
                                        .then(function (res) {
                                            $scope.jugadores[index].nombre = nombre;
                                            $scope.jugadores[index].handicap = handicap;
                                            modificar = true;
                                        });

                                    $scope.data.nombreJug = "";
                                    $scope.data.handicap = "";
                                } else {
                                    var title = "Jugador repetido!";
                                    var template = "El nombre del jugador ya" +
                                        " se está usando, por favor escribir" +
                                        " otro.";
                                    utils.popup(title, template);
                                    e.preventDefault();
                                }
                            } else {
                                if (!$scope.data.nombreJug)
                                    $scope.data.styleNombre
                                        = 'background-color: red;';
                                if (!$scope.data.handicap)
                                    $scope.data.styleHandicap
                                        = 'background-color: red;';
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        };

        function getApuesta() {
            var query = "SELECT * FROM apuesta WHERE nombre = (?) AND seleccionada = 1";

            $cordovaSQLite.execute(db, query, ["Nassau"])
                .then(function (result) {
                    if (result.rows.length > 0) {
                        utils.popup("Apuesta Nassau",
                            "Se está llevando a cabo la apuesta 'Nassau', si"
                            + " se realiza alguna modificación en los jugadores"
                            + " los datos de esta apuesta se perderán");
                    }
                }, function (err) {
                    console.error(err);
                });
        }

        function getJugadores() {
            var query = "SELECT * FROM jugador";
            $cordovaSQLite.execute(db, query).then(function (res) {
                if (res.rows.length > 0) {

                    for (var i = 0; i < res.rows.length; i++) {
                        if (res.rows.item(i).jugar == 1) {
                            $scope.jugadores.push({
                                id: res.rows.item(i).id,
                                nombre: res.rows.item(i).nombre,
                                handicap: res.rows.item(i).handicap,
                                jugar: true
                            });
                        } else {
                            $scope.jugadores.push({
                                id: res.rows.item(i).id,
                                nombre: res.rows.item(i).nombre,
                                handicap: res.rows.item(i).handicap,
                                jugar: false
                            });
                        }

                    }
                    getApuesta();
                }

            }, function (err) {
                console.log(err);
            });
        }

        $ionicPlatform.ready(function () {
            $scope.sesionActual = sesionActual;
            getJugadores();
        });

        /**
         * Esta función está al pendiente de los cambios en la variable
         * $scope.data.handicap para validar que coincida con una expresión
         * regular, y en caso de que no coincida, regresar al último valor
         * correcto que tenía.
         */
        $scope.$watch('data.handicap', function (newValue, oldValue) {
            var regex = new RegExp('^-?[0-9]*$');

            if (!regex.test(newValue)) {
                $scope.data.handicap = oldValue;
            }
        });
    });
