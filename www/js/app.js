// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.seleccion-jugadores','starter.seleccion-campo','starter.juego','starter.nuevo-campo'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('inicio',{
        url:'/inicio',
        templateUrl:'templates/inicio.html'
      });
    $stateProvider
      .state('seleccion_jugadores',{
        url:'/seleccion_jugadores',
        templateUrl:'templates/seleccion_jugadores.html'
      });

    $stateProvider
      .state('seleccion_campo',{
        url:'/seleccion_campo',
        templateUrl:'templates/seleccion_campo.html'
      });

    $stateProvider
      .state('seleccion_apuestas',{
        url:'/seleccion_apuestas',
        templateUrl:'templates/seleccion_apuestas.html'
      });

    $stateProvider
      .state('nuevo_campo',{
        url:'/nuevo_campo',
        templateUrl:'templates/nuevo_campo.html'
      });

    $stateProvider
      .state('juego',{
        url:'/juego',
        templateUrl:'templates/juego.html'
      });
    $urlRouterProvider.otherwise('/inicio');
  })

  .controller('ctrlInicio', function ($scope,$state) {

    $scope.paginas=function (select) {

      switch (select){

        case 1:
          $state.go('inicio');
          break;

        case 2:
          $state.go('seleccion_jugadores');
          break;

        case 3:
          $state.go('seleccion_campo');
          break;

        case 4:
          $state.go('seleccion_apuestas');
          break

        case 5:
          $state.go('nuevo_campo');
          break

        case 6:
          $state.go('juego');
          break
      }
    }
  });
