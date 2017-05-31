// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db = null;
angular.module('starter', ['ionic', 'ngCordova', 'starter.seleccion-jugadores',
    'starter.seleccion-campo', 'starter.juego', 'starter.nuevo-campo',
    'starter.seleccion-apuestas', 'starter.inicio'])

    .run(function ($ionicPlatform, $cordovaSQLite, $state) {
        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            db = $cordovaSQLite.openDB({
                name: "Lj9bgooou89.db",
                iosDatabaseLocation: 'default'
            });

            var pantalla = "CREATE TABLE IF NOT EXISTS pantalla" +
                "(id integer PRIMARY KEY AUTOINCREMENT" +
                ",pantalla integer)";
            $cordovaSQLite.execute(db, pantalla);

            var jugador = "CREATE TABLE IF NOT EXISTS jugador" +
                "(id integer PRIMARY KEY AUTOINCREMENT, " +
                "nombre text, " +
                "handicap integer," +
                "sexo integer," +
                "url_foto text," +
                "password text," +
                "email text," +
                "CONSTRAINT email_unique UNIQUE (email))";
            $cordovaSQLite.execute(db, jugador);

            var campo = "CREATE TABLE IF NOT EXISTS campo (" +
                "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ",nombre text(100) NOT NULL" +
                ",ciudad text(100) DEFAULT NULL" +
                ",par_hoyo_1 integer DEFAULT NULL" +
                ",par_hoyo_2 integer DEFAULT NULL" +
                ",par_hoyo_3 integer DEFAULT NULL" +
                ",par_hoyo_4 integer DEFAULT NULL" +
                ",par_hoyo_5 integer DEFAULT NULL" +
                ",par_hoyo_6 integer DEFAULT NULL" +
                ",par_hoyo_7 integer DEFAULT NULL" +
                ",par_hoyo_8 integer DEFAULT NULL" +
                ",par_hoyo_9 integer DEFAULT NULL" +
                ",par_hoyo_10 integer DEFAULT NULL" +
                ",par_hoyo_11 integer DEFAULT NULL" +
                ",par_hoyo_12 integer DEFAULT NULL" +
                ",par_hoyo_13 integer DEFAULT NULL" +
                ",par_hoyo_14 integer DEFAULT NULL" +
                ",par_hoyo_15 integer DEFAULT NULL" +
                ",par_hoyo_16 integer DEFAULT NULL" +
                ",par_hoyo_17 integer DEFAULT NULL" +
                ",par_hoyo_18 integer DEFAULT NULL" +
                ",ventaja_hoyo_1 integer DEFAULT NULL" +
                ",ventaja_hoyo_2 integer DEFAULT NULL" +
                ",ventaja_hoyo_3 integer DEFAULT NULL" +
                ",ventaja_hoyo_4 integer DEFAULT NULL" +
                ",ventaja_hoyo_5 integer DEFAULT NULL" +
                ",ventaja_hoyo_6 integer DEFAULT NULL" +
                ",ventaja_hoyo_7 integer DEFAULT NULL" +
                ",ventaja_hoyo_8 integer DEFAULT NULL" +
                ",ventaja_hoyo_9 integer DEFAULT NULL" +
                ",ventaja_hoyo_10 integer DEFAULT NULL" +
                ",ventaja_hoyo_11 integer DEFAULT NULL" +
                ",ventaja_hoyo_12 integer DEFAULT NULL" +
                ",ventaja_hoyo_13 integer DEFAULT NULL" +
                ",ventaja_hoyo_14 integer DEFAULT NULL" +
                ",ventaja_hoyo_15 integer DEFAULT NULL" +
                ",ventaja_hoyo_16 integer DEFAULT NULL" +
                ",ventaja_hoyo_17 integer DEFAULT NULL" +
                ",ventaja_hoyo_18 integer DEFAULT NULL" +
                ",seleccionado integer(1) NOT NULL)";
            $cordovaSQLite.execute(db, campo);


            var apuesta = "CREATE TABLE IF NOT EXISTS apuesta (" +
                "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ",nombre varchar(50) NOT NULL" +
                ",seleccionada integer(1) NOT NULL" +
                ",CONSTRAINT nombre_ap_unique UNIQUE (nombre))";
            $cordovaSQLite.execute(db, apuesta);

            var partido = "CREATE TABLE IF NOT EXISTS partido (" +
                "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ",clave_consulta char(8) NOT NULL UNIQUE" +
                ",clave_edicion char(8) NOT NULL UNIQUE" +
                ",inicio datetime NOT NULL" +
                ",fin datetime DEFAULT NULL" +
                ",campo_id integer NOT NULL" +
                ",FOREIGN KEY (campo_id) REFERENCES campo (id))";
            $cordovaSQLite.execute(db, partido);

            var apuesta_partido = "CREATE TABLE IF NOT EXISTS apuesta_partido (" +
                "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ",partido_id integer NOT NULL" +
                ",apuesta_id integer NOT NULL" +
                ",CONSTRAINT unique_id_apue UNIQUE (partido_id, apuesta_id)" +
                ",FOREIGN KEY (apuesta_id) REFERENCES apuesta (id)" +
                ",FOREIGN KEY (partido_id) REFERENCES partido (id))";
            $cordovaSQLite.execute(db, apuesta_partido);

            var puntuacion = "CREATE TABLE IF NOT EXISTS puntuaciones (" +
                "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ",hoyo integer NOT NULL" +
                ",golpes integer NOT NULL" +
                ",unidades integer NOT NULL" +
                ",jugador_id integer NOT NULL" +
                ",FOREIGN KEY (jugador_id) REFERENCES jugador (id))";
            $cordovaSQLite.execute(db, puntuacion);

            var idx_partido_partido_jugador_id_fk = "CREATE INDEX " +
                "IF NOT EXISTS idx_partido_partido_jugador_id_fk " +
                "ON partido (jugador_id);";
            $cordovaSQLite.execute(db, idx_partido_partido_jugador_id_fk);

            var idx_partido_partido_campo_id_fk = "CREATE INDEX " +
                "IF NOT EXISTS idx_partido_partido_campo_id_fk " +
                "ON partido (campo_id)";
            $cordovaSQLite.execute(db, idx_partido_partido_campo_id_fk);

            var idx_jugador_partido_jugador_partido_partido_id_fk =
                "CREATE INDEX IF NOT EXISTS " +
                "idx_jugador_partido_jugador_partido_partido_id_fk " +
                "ON jugador_partido (partido_id)";
            $cordovaSQLite.execute(db, idx_jugador_partido_jugador_partido_partido_id_fk);

            var idx_apuesta_partido_apuesta_partido_apuesta_id_fk =
                "CREATE INDEX IF NOT EXISTS " +
                "idx_apuesta_partido_apuesta_partido_apuesta_id_fk " +
                "ON apuesta_partido (apuesta_id)";
            $cordovaSQLite.execute(db, idx_apuesta_partido_apuesta_partido_apuesta_id_fk);

            var idx_puntuaciones_puntuaciones_partido_id_fk = "CREATE INDEX " +
                "IF NOT EXISTS idx_puntuaciones_puntuaciones_partido_id_fk " +
                "ON puntuaciones (partido_id)";
            $cordovaSQLite.execute(db, idx_puntuaciones_puntuaciones_partido_id_fk);

        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('inicio', {
                url: '/inicio',
                templateUrl: 'templates/inicio.html'
            });
        $stateProvider
            .state('seleccion_jugadores', {
                url: '/seleccion_jugadores',
                templateUrl: 'templates/seleccion_jugadores.html'
            });

        $stateProvider
            .state('seleccion_campo', {
                url: '/seleccion_campo',
                templateUrl: 'templates/seleccion_campo.html'
            });

        $stateProvider
            .state('seleccion_apuestas', {
                url: '/seleccion_apuestas',
                templateUrl: 'templates/seleccion_apuestas.html'
            });

        $stateProvider
            .state('nuevo_campo', {
                url: '/nuevo_campo',
                templateUrl: 'templates/nuevo_campo.html'
            });

        $stateProvider
            .state('juego', {
                url: '/juego',
                templateUrl: 'templates/juego.html'
            });

        $urlRouterProvider.otherwise('/inicio');
    })

    .controller('ctrlInicio', function ($scope, $state, $cordovaSQLite) {

        $scope.paginas = function (select) {

            switch (select) {

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
                    break;

                case 5:
                    $state.go('nuevo_campo');
                    break;

                case 6:
                    $state.go('juego');
                    break;
            }
        }

    });
