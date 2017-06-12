/**
 * Created by Victor Hugo on 22/03/2017.
 */
angular.module('starter.seleccion-jugadores', ['ionic'])

    .controller('jugadoresController', function ($scope, $ionicPopup, $cordovaSQLite, $state, $ionicPlatform, $ionicLoading) {
        $scope.jugadores = [];

        $scope.guardarPantallaJugadores = function (seleccion) {
            var pantalla = "UPDATE pantalla SET pantalla = ? WHERE id = 1";
            switch (seleccion) {
                case 1:
                    $cordovaSQLite.execute(db, pantalla, [1]);
                    $state.go('inicio');
                    break;

                case 3:
                    var query = "SELECT * FROM jugador";
                    $cordovaSQLite.execute(db, query).then(function (res) {
                        if(res.rows.length > 0){
                            $cordovaSQLite.execute(db, pantalla, [3]);

                            var control = false;
                            for(var i=0; i<$scope.jugadores.length; i++){
                                if($scope.jugadores[i].jugar == 1){
                                    control = true;
                                    break;
                                }
                            }
                            if(control){
                                $state.go('tabs.camp-dis');
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
                    });
                    break;
            }
        };

        function popup(title, template) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: template
            });
        };

        function showLoading() {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>' +
                '<p>Cargando</p>',
                animation: 'fade-in'
            }).then(function () {

            });
        };

        function getJugadores() {
            var query = "SELECT * FROM jugador";
            $cordovaSQLite.execute(db, query).then(function (res) {
                if (res.rows.length > 0) {
                    showLoading();
                    for (var i = 0; i < res.rows.length; i++) {
                        console.log(res.rows.item(i).id+" "+res.rows.item(i).jugar)
                        //
                        $scope.jugadores.push(new Jugador(res.rows.item(i).id, res.rows.item(i).nombre, "", res.rows.item(i).handicap, res.rows.item(i).jugar, "", "", "", ""));
                    }
                    isChecked();
                }

            });
        };

        function isChecked() {
            console.log($scope.jugadores.length)
            if($scope.jugadores.length>0){
                setTimeout(function () {
                    for(var i=0; i<$scope.jugadores.length; i++){
                        if($scope.jugadores[i].jugar == 1){
                            document.getElementById("cb-"+i).checked = true;
                        }else{
                            document.getElementById("cb-"+i).checked = false;
                        }
                    }
                    $ionicLoading.hide();
                },1000)
            }
        }

        $scope.isJugador= function(idJugador, index){

            var checked = document.getElementById("cb-"+index).checked;
            console.log(idJugador+" "+checked +" "+index)


            var query = "UPDATE jugador SET jugar = ? WHERE id =?";
            if(checked){
                $cordovaSQLite.execute(db, query, [1,idJugador]).then(function (res) {
                    $scope.jugadores[index].jugar=1;
                });
            }else{
                $cordovaSQLite.execute(db, query, [0,idJugador]).then(function (res) {
                    $scope.jugadores[index].jugar=0;
                });
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
                                    var query = "INSERT INTO jugador (nombre, handicap,jugar) VALUES (?,?,?)";
                                    $cordovaSQLite.execute(db, query, [nombre, handicap, 0]).then(function (res) {
                                        var query = "SELECT * FROM jugador WHERE nombre = (?)";
                                        $cordovaSQLite.execute(db, query, [nombre]).then(function (res) {
                                            if (res.rows.length > 0) {
                                                $scope.jugadores.push(new Jugador(res.rows.item(0).id, nombre, "", handicap, 0, "", "", "", ""));
                                            }
                                        });
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

        $ionicPlatform.ready(function () {
            console.log('jugadoresController', 'Ready');
            getJugadores();
        });

    });
