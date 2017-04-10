/**
 * Created by Victor Hugo on 23/03/2017.
 */

angular.module('starter.juego', ['ionic'])

.controller('ctrlJuego', function ($scope, $ionicPopup) {



  var par =[
    {nombre:'PAR', h1:5 ,h2:10 ,h3:4 ,h4:5, h5:10, h6:11, h7:12, h8:20, h9:4, h10:12, h11:11, h12:9, h13:12, h14:30, h15:25, h16:10 ,h17:19 ,h18:21}
  ];

  var ventajas= [
       {nombre:'VENTAJAS', h1:4 ,h2:2 ,h3:5 ,h4:18, h5:6, h6:1, h7:3, h8:14, h9:17, h10:10, h11:11, h12:8, h13:15, h14:13, h15:9, h16:12 ,h17:16 ,h18:7}
  ];

  $scope.juagadoresCo =[
    ['victor', 9, 0, 0, 0 ,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 , 9, 0, 0 ],
    ['hugo', 99, 0, 0, 0 ,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 , 9, 0, 0 ],
    ['reveles', 999, 0, 0, 0 ,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2 , 9, 0, 0 ]
  ];

  var jugadores =[
  {nombre:'Reveles',  handicap:9, golpes:0, puntosE:0, h1:0, h2:0, h3:0, h4:0 ,h5:0, h6:0, h7:0, h8:0, h9:0, h10:0, h11:0, h12:0, h13:0, h14:0, h15:0, h16:0, h17:0, h18:0, id:2},
  {nombre:'Victor',  handicap:9, golpes:0, puntosE:0, h1:0, h2:0, h3:0, h4:0 ,h5:0, h6:0, h7:0, h8:0, h9:0, h10:0, h11:0, h12:0, h13:0, h14:0, h15:0, h16:0, h17:0, h18:0, id:2},
  {nombre:'Porfirio',  handicap:9, golpes:0, puntosE:0, h1:0, h2:0, h3:0, h4:0 ,h5:0, h6:0, h7:0, h8:0, h9:0, h10:0, h11:0, h12:0, h13:0, h14:0, h15:0, h16:0, h17:0, h18:0, id:2},
  {nombre:'Santiago',  handicap:9, golpes:0, puntosE:0, h1:0, h2:0, h3:0, h4:0 ,h5:0, h6:0, h7:0, h8:0, h9:0, h10:0, h11:0, h12:0, h13:0, h14:0, h15:0, h16:0, h17:0, h18:0, id:2},
  {nombre:'Manuel',  handicap:9, golpes:0, puntosE:0, h1:0, h2:0, h3:0, h4:0 ,h5:0, h6:0, h7:0, h8:0, h9:0, h10:0, h11:0, h12:0, h13:0, h14:0, h15:0, h16:0, h17:0, h18:0, id:2},
  {nombre:'Luis',  handicap:9, golpes:0, puntosE:0, h1:0, h2:0, h3:0, h4:0 ,h5:0, h6:0, h7:0, h8:0, h9:0, h10:0, h11:0, h12:0, h13:0, h14:0, h15:0, h16:0, h17:0, h18:0, id:2}

  ];



  /*
  $scope.score = function (idJugador, hoyo) {
    $scope.data = {};

    var myPopup = $ionicPopup.show({
      template: '<p>' +
      '<label>Num de Golpes:</label>'+
      '<input type="number" ng-model="data.NumGolpes" name="data.NumGolpes">'+
      '</p>'+
      '<p>' +
      '<label>Puntos Extras:</label>'+
      '<input type="number" ng-model="data.PuntExtras">'+
      '</p>',
      title: 'Agregar jugadores',
      subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Guardar</b>',
          type: 'button-balanced',
          onTap: function(e) {
            var numeroGolpes = $scope.data.NumGolpes;
            var puntosExtras = $scope.data.PuntExtras;

              e.preventDefault();
          }
        }
      ]
    });
  }
  */
  $scope.puntoJugador =[];

  $scope.score = function(id, hoyo){

    var nombre = jugadores[id].nombre;
    $scope.juego = {};

     var myPopup = $ionicPopup.show({
      template: '<p>' +
      '<label>Golpes Realizados:</label>'+
      '<input type="number" ng-model="juego.golpesRealizados" name="juego.golpesRealizados" id="golpesRealizados" value="0">'+
      '</p>'+
      '<p>' +
      '<label>Puntos Extras:</label>'+
      '<input type="number" ng-model="juego.puntosExtras" name="juego.puntosExtras" id="puntosExtras" value="0">'+
      '</p>',
      title: 'Jugador:' +nombre,
      subTitle: 'Ingresa número de Golpes y Unidades',
      scope: $scope,
      buttons: [
        { text: 'Cancel',
          type: 'button-assertive'},
        {
          text: '<b>Guardar</b>',
          type: 'button-balanced',
          onTap: function(e) {
            var golpesRealizaos= $scope.juego.golpesRealizados;
            var puntosExtras = $scope.juego.puntosExtras;

            if(golpesRealizaos && puntosExtras){

              document.getElementById("golpes"+id+""+hoyo).innerHTML =golpesRealizaos;
              document.getElementById("unidades"+id+""+hoyo).innerHTML =puntosExtras;

              console.log(jugadores[id])
            }else{

              e.preventDefault();
            }
          }
        }
      ]
    });
  }

  $scope.par = par;
  $scope.jugadoresConf = jugadores;
  $scope.ventajas = ventajas;
});
