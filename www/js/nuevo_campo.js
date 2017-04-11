/**
 * Created by Victor Hugo on 23/03/2017.
 */

angular.module('starter.nuevo-campo', ['ionic'])

  .controller('campoCtrl', function ($scope, $ionicPopup, $state, setCampo) {

    var campo = null;
    var par = [];
    var ventaja = [];

    $scope.guardarCampo = function () {

      document.getElementById("nombreCampoNuevo").style.backgroundColor = "#FFFFFF";

      for (var i = 1; i < 19; i++) {
        document.getElementById("par" + i).style.backgroundColor = "#FFFFFF";
        document.getElementById("ven" + i).style.backgroundColor = "#FFFFFF";

        var parX = document.getElementById("par" + i).value;
        var venX = document.getElementById("ven" + i).value;

        if (parX == "") {
          document.getElementById("par" + i).style.backgroundColor = "#F5A9A9";
        } else {
          par.push(parX);
        }
        if (venX == "") {
          document.getElementById("ven" + i).style.backgroundColor = "#F5A9A9";
        } else {
          ventaja.push(venX);
        }
      }

      var nombreCampo = document.getElementById("nombreCampoNuevo").value;

      var ok = true;
      if (nombreCampo == "") {
        document.getElementById("nombreCampoNuevo").style.backgroundColor = "#F5A9A9";
        ok = false;
      }

      if (par.length != 18 || ventaja.length != 18) {
        ok = false;
      }

      if (!ok) {
        var alertPopup = $ionicPopup.alert({
          title: 'Datos incompletos!',
          template: 'No puedes dejar campos vacios.',
          okType: 'button-balanced'
        });
      } else {
        campo = new Campo(nombreCampo, par, ventaja);
        insertaCampo(campo);
        vaciarCampos();
        $state.go('seleccion_campo');
      }

    }


    function insertaCampo(campo) {
      setCampo.hola(campo);
    }

    function vaciarCampos() {

      par = [];
      ventaja = [];

      document.getElementById("nombreCampoNuevo").value ="";
      for(var i =1;i<19;i++ ){
        document.getElementById("par" + i).value ="";
        document.getElementById("ven" + i).value ="";
      }
    }

  });
