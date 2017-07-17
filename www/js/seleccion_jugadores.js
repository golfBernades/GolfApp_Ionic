angular.module('starter.seleccion-jugadores', ['ionic'])

    .controller('jugadoresController', function ($scope, $ionicPopup,
                                                 $cordovaSQLite, $state,
                                                 $ionicPlatform, $ionicLoading,
                                                 $rootScope, servicePantallas,
                                                 utils) {
        $scope.jugadores = [];

        var modificar = false;

        $scope.seleccionarCampo = function () {
            var query = "SELECT jugar FROM jugador WHERE usuario_id = (?)";
            $cordovaSQLite.execute(db, query, [id_user_app])
                .then(function (res) {
                    if (res.rows.length > 0) {

                        var control = false;

                        for (var i = 0; i < $scope.jugadores.length; i++) {
                            if ($scope.jugadores[i].jugar == 1) {
                                control = true;
                                break;
                            }
                        }
                        if (control) {

                            if (modificar) {
                                var del_four = "DELETE FROM foursome WHERE usuario_id = (?)";
                                $cordovaSQLite.execute(db, del_four, [id_user_app]);

                                var del_four_two = "DELETE FROM foursomeTwo WHERE usuario_id = (?)";
                                $cordovaSQLite.execute(db, del_four_two, [id_user_app]);
                            }

                            switch ($rootScope.campos) {
                                case 1:
                                    $state.go('tabs.camp-dis');
                                    break;
                                case 2:
                                    $state.go('tabs.camp-cue');
                                    break;
                                default:
                                    $state.go('tabs.camp-dis');
                                    break;
                            }

                        } else {
                            utils.popup("Selección de jugadores",
                                "Debes seleccionar los jugadores que" +
                                " participarán en el partido para poder" +
                                " avanzar");
                        }
                    } else {
                        utils.popup("Creación de jugadores", "Debes crear" +
                            " los jugadores que participarán en el partido" +
                            " para poder avanzar");
                    }
                }, function (err) {
                    console.log(JSON.stringify(err))
                });
        };

        $scope.inicio = function () {
            $state.go('inicio');
        };

        $scope.isJugador = function (idJugador, index) {

            var query = "UPDATE jugador SET jugar = ? WHERE id =?";
            if ($scope.jugadores[index].jugar) {
                $cordovaSQLite.execute(db, query, [1, idJugador]);
            } else {
                $cordovaSQLite.execute(db, query, [0, idJugador]);
            }

        }

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

            var myPopup = $ionicPopup.show({
                templateUrl: 'templates/add_user_popup.html',
                title: 'Nuevo jugador',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive'
                    },
                    {
                        text: 'Agregar',
                        type: 'button-balanced',
                        onTap: function (e) {
                            var nombre = $scope.data.nombreJug;
                            var handicap = $scope.data.handicap;

                            var x = document.getElementById("handicap").value;

                            if (nombre && (x != '')) {

                                var control = true;

                                for (var i = 0; i < $scope.jugadores.length; i++) {
                                    if (nombre.toLowerCase() == $scope.jugadores[i].nombre.toLowerCase()) {
                                        control = false;
                                        break;
                                    }
                                }

                                if (control) {
                                    var query = "INSERT INTO jugador (nombre, handicap,jugar, usuario_id) VALUES (?,?,?,?)";
                                    $cordovaSQLite.execute(db, query, [nombre, handicap, 0, id_user_app])
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
                                    utils.popup("Jugadores repetido!", "Nombre de jugador repetido. Escribir otro nombre.")
                                }

                                $scope.data.nombreJug = "";
                                $scope.data.handicap = "";
                                document.getElementById("nombreJug").style.backgroundColor = "#FAFAFA";
                                document.getElementById("handicap").style.backgroundColor = "#FAFAFA";

                                e.preventDefault();
                            } else {

                                if (!nombre && !handicap) {
                                    document.getElementById("nombreJug").style.backgroundColor = "#F5A9A9";
                                    document.getElementById("handicap").style.backgroundColor = "#F5A9A9"
                                } else if (!nombre) {
                                    document.getElementById("nombreJug").style.backgroundColor = "#F5A9A9";
                                } else if (!handicap) {
                                    document.getElementById("handicap").style.backgroundColor = "#F5A9A9"
                                }

                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        };

        $scope.editJugador = function (index) {

            $scope.data = {};

            $scope.data.nombreJugEd = ($scope.jugadores[index].nombre);
            $scope.data.handicapEd = ($scope.jugadores[index].handicap);

            var nombre = $scope.data.nombreJugEd = ($scope.jugadores[index].nombre);

            var myPopup = $ionicPopup.show({
                templateUrl: 'templates/edit_user_popup.html',
                title: 'Editar jugador',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar',
                        type: 'button-assertive'
                    },
                    {
                        text: 'Actualizar',
                        type: 'button-balanced',
                        onTap: function (e) {
                            var nomb = $scope.data.nombreJugEd;
                            var handi = $scope.data.handicapEd;


                            if (nomb && nomb) {
                                var control = true;

                                if (nomb.toLowerCase() != $scope.jugadores[index].nombre.toLowerCase()) {
                                    for (var i = 0; i < $scope.jugadores.length; i++) {
                                        if (nomb.toLowerCase() == $scope.jugadores[i].nombre.toLowerCase()) {
                                            control = false;
                                            break;
                                        }
                                    }
                                }

                                if (control) {
                                    var query = "UPDATE jugador SET nombre = ?, handicap = ? WHERE id = ?";
                                    $cordovaSQLite.execute(db, query, [nomb, handi, $scope.jugadores[index].id])
                                        .then(function (res) {
                                            $scope.jugadores[index].nombre = nomb;
                                            $scope.jugadores[index].handicap = handi;

                                            modificar = true;
                                        });
                                } else {
                                    var title = "Jugadores repetido!";
                                    var template = "El nombre del jugador ya" +
                                        " se está usando, por favor escribir" +
                                        " otro.";
                                    utils.popup(title, template);
                                    e.preventDefault();
                                }

                            } else {
                                if (!nomb && !nomb) {
                                    document.getElementById("nombreJugEd").style.backgroundColor = "#F5A9A9";
                                    document.getElementById("handicapEd").style.backgroundColor = "#F5A9A9"
                                } else if (!nomb) {
                                    document.getElementById("nombreJugEd").style.backgroundColor = "#F5A9A9";
                                } else if (!nomb) {
                                    document.getElementById("handicapEd").style.backgroundColor = "#F5A9A9"
                                }
                                e.preventDefault();
                            }
                        }
                    }
                ]
            });
        };

        function getApuesta() {

            var query = "SELECT * FROM apuesta WHERE nombre = (?) AND seleccionada = 1";
            $cordovaSQLite.execute(db, query, ["Foursome"]).then(function (result) {
                if (result.rows.length > 0) {
                    utils.popup("Apuesta Foursome",
                        "Se está llevando a cabo la apuesta 'Foursome', si" +
                        " se realiza alguna modificación en los jugadores" +
                        " los datos de esta apuesta se perderán");
                }
            }, function (err) {
                console.error(err);
            });

        }

        function getJugadores() {

            var query = "SELECT * FROM jugador WHERE usuario_id = (?)";
            $cordovaSQLite.execute(db, query, [id_user_app]).then(function (res) {
                if (res.rows.length > 0) {

                    for (var i = 0; i < res.rows.length; i++) {
                        console.log(res.rows.item(i).id + " "
                            + res.rows.item(i).jugar);

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
                JSON.stringify(err)
            });
        };

        $ionicPlatform.ready(function () {
            getJugadores();
        });

    });
