/**
 * Created by Victor Hugo on 22/03/2017.
 */

angular.module('starter.seleccion-apuestas', ['ionic'])

.controller('apuestasCtrl', function ($scope, $cordovaSQLite) {

  $scope.apuestas =[];

    function getApuestas() {
      setTimeout(function () {
        var query = "SELECT * FROM apuesta";
        $cordovaSQLite.execute(db, query).then(function(res) {

          if(res.rows.length>0){
            for(var i =0; i<res.rows.length; i++){
              $scope.apuestas.push(new Apuesta(res.rows.item(i).id, res.rows.item(i).nombre));
            }
          }else{
            var apuesta ="INSERT INTO apuesta (nombre) VALUES (?)";
            $cordovaSQLite.execute(db, apuesta,["rayas"]);

            getApuestas();
          }
        }, function (err) {
          console.error(err);
        });
      },500)

    }

    getApuestas();
});
