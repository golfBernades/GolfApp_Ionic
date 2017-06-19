/**
 * Created by Victor Hugo on 22/03/2017.
 */
angular.module('starter.seleccion-jugadores', ['ionic'])

    .controller('jugadoresController', function ($scope, $ionicPopup, $cordovaSQLite,
                                                 $state, $ionicPlatform, $ionicLoading,
                                                 $rootScope, servicePantallas) {
        $scope.jugadores = [];

        $scope.guardarPantallaJugadores = function (seleccion) {
            var pantalla = "UPDATE pantalla SET pantalla = ? WHERE id = 1";
            switch (seleccion) {
                case 1:
                    servicePantallas.savePantalla(1);
                    $state.go('inicio');
                    break;

                case 3:
                    var query = "SELECT jugar FROM jugador WHERE usuario_id = (?)";
                    $cordovaSQLite.execute(db, query,[id_user_app]).then(function (res) {
                        if(res.rows.length > 0){

                            var control = false;
                            for(var i=0; i<$scope.jugadores.length; i++){
                                if($scope.jugadores[i].jugar == 1){
                                    control = true;
                                    break;
                                }
                            }
                            if(control){

                                switch ($rootScope.campos){
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

                            }else{
                                var title = "Jugadores no seleccionados!";
                                var template = "Seleccionar jugadores para poder avanzar a la siguiente página.";
                                popup(title, template)
                            }
                        }else{
                            var title = "Jugadores no creados!";
                            var template = "No se tiene ningun jugador creado para poder avanzar a la siguiente página.";
                            popup(title, template)
                        }
                    }, function (err) {
                        console.log(JSON.stringify(err))
                    });
                    break;
            }
        };

        $scope.isJugador= function(idJugador, index){

            console.log($scope.jugadores[index].jugar);


            var query = "UPDATE jugador SET jugar = ? WHERE id =?";
            if($scope.jugadores[index].jugar){
                $cordovaSQLite.execute(db, query, [1,idJugador]);
            }else{
                $cordovaSQLite.execute(db, query, [0,idJugador]);
            }

        }

        $scope.deleteSkill = function (index) {

            var nombre = $scope.jugadores[index].nombre;
            var confirmPopup = $ionicPopup.confirm({
                title: 'Eliminar jugador',
                template: '¿Estás seguro que deseas eliminar a ' + nombre + '?',
                cancelText: 'Cancelar',
                cancelType: 'button-assertive',
                okText: 'Eliminar'

            });

            confirmPopup.then(function (res) {
                if (res) {
                    var query = 'DELETE FROM jugador  WHERE id = ?';
                    $cordovaSQLite.execute(db, query, [$scope.jugadores[index].id]);
                    $scope.jugadores.splice(index, 1);

                } else {

                }
            });
        };

        $scope.addUser = function () {
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
                                            var query = "SELECT * FROM jugador WHERE nombre = (?)";
                                            $cordovaSQLite.execute(db, query, [nombre])
                                                .then(function (res) {
                                                if (res.rows.length > 0) {
                                                    $scope.jugadores.push({id: res.rows.item(0).id, nombre:nombre, handicap:handicap, jugar: false})
                                                }
                                            }, function (err) {
                                                    console.log(JSON.stringify(err))
                                                });
                                    }, function (err) {
                                            console.log(JSON.stringify(err))
                                        });
                                } else {
                                    var title = "Jugadores repetido!";
                                    var template = "Nombre de jugador repetido. Escribir otro nombre.";
                                    popup(title, template)
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

        $scope.editUser = function (index) {

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

                                if(nomb.toLowerCase() != $scope.jugadores[index].nombre.toLowerCase()){
                                    for (var i = 0; i < $scope.jugadores.length; i++) {
                                        if (nomb.toLowerCase() == $scope.jugadores[i].nombre.toLowerCase()) {
                                            control = false;
                                            break;
                                        }
                                    }
                                }

                                if (control) {
                                    var query = "UPDATE jugador SET nombre = ?, handicap = ? WHERE id = ?";
                                    $cordovaSQLite.execute(db, query, [nomb, handi, $scope.jugadores[index].id]).then(function (res) {
                                        $scope.jugadores[index].nombre = nomb;
                                        $scope.jugadores[index].handicap = handi;
                                    });
                                } else {
                                    var title = "Jugadores repetido!";
                                    var template = "Nombre de jugador repetido. Escribir otro nombre.";
                                    popup(title, template)
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

        function popup(title, template) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: template
            });
        };

        function getJugadores() {

            var query = "SELECT * FROM jugador WHERE usuario_id = (?)";
            $cordovaSQLite.execute(db, query, [id_user_app]).then(function (res) {
                if (res.rows.length > 0) {

                    for (var i = 0; i < res.rows.length; i++) {
                        console.log(res.rows.item(i).id+" "+res.rows.item(i).jugar)

                        if(res.rows.item(i).jugar == 1){
                            $scope.jugadores.push({id:res.rows.item(i).id, nombre:res.rows.item(i).nombre, handicap:res.rows.item(i).handicap, jugar: true});
                        }else{
                            $scope.jugadores.push({id:res.rows.item(i).id, nombre:res.rows.item(i).nombre, handicap:res.rows.item(i).handicap, jugar: false});
                        }

                    }
                }

            },function (err) {
                JSON.stringify(err)
            });
        };

        $ionicPlatform.ready(function () {
            getJugadores();
        });

    });
