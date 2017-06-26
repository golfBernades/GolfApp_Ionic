// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db = null;
var dir = 'http://148.233.65.228:8080/';
// var dir = 'http://192.168.0.15:8000/';
var id_user_app = "";
var user_app = "";
var password_app = "";
var sesionActual = false;


angular.module('starter', ['ionic', 'ngCordova', 'starter.seleccion-jugadores',
    'starter.campos-dispositivo', 'starter.juego', 'starter.nuevo-campo',
    'starter.seleccion-apuestas', 'starter.inicio', 'starter.login', 'starter.registro',
    'starter.campos-cuenta', 'starter.juego_consulta','starter.seleccion-parejas'])

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
                name: "gosaoa80aaaauasaqopspp9.db",
                iosDatabaseLocation: 'default'
            });

            var pantalla = "CREATE TABLE IF NOT EXISTS pantalla" +
                "(id integer PRIMARY KEY AUTOINCREMENT" +
                ",pantalla text)";

            $cordovaSQLite.execute(db, pantalla);

            var clave = "CREATE TABLE IF NOT EXISTS clave" +
                "(clave text PRIMARY KEY)";

            $cordovaSQLite.execute(db, clave);

            var usuario = "CREATE TABLE IF NOT EXISTS usuario" +
                "(id integer PRIMARY KEY" +
                ",email text" +
                ",password text)";

            $cordovaSQLite.execute(db, usuario);

            var jugador = "CREATE TABLE IF NOT EXISTS jugador" +
                "(id integer PRIMARY KEY AUTOINCREMENT, " +
                "nombre text, " +
                "handicap integer," +
                "jugar integer," +
                "sexo integer," +
                "url_foto text," +
                "password text," +
                "email text," +
                "usuario_id integer NOT NULL," +
                "CONSTRAINT email_unique UNIQUE (email)," +
                "FOREIGN KEY (usuario_id) REFERENCES usuario (id))";

            $cordovaSQLite.execute(db, jugador);

            var campo = "CREATE TABLE IF NOT EXISTS campo (" +
                "id text NOT NULL PRIMARY KEY" +
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
                ",cuenta integer (1) NOT NULL" +
                ",seleccionado integer(1) NOT NULL" +
                ",usuario_id integer NOT NULL" +
                ",FOREIGN KEY (usuario_id) REFERENCES usuario (id))";

            $cordovaSQLite.execute(db, campo);

            var apuesta = "CREATE TABLE IF NOT EXISTS apuesta (" +
                "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ",nombre varchar(50) NOT NULL" +
                ",seleccionada integer(1) NOT NULL" +
                ",CONSTRAINT nombre_ap_unique UNIQUE (nombre))";

            $cordovaSQLite.execute(db, apuesta);

            var partido = "CREATE TABLE IF NOT EXISTS partido (" +
                "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ", clave_consulta CHAR(8) NULL UNIQUE" +
                ", clave_edicion CHAR(8) NULL UNIQUE" +
                ", inicio DATETIME NOT NULL" +
                ", fin DATETIME DEFAULT NULL" +
                ", id_servidor INTEGER NULL UNIQUE)";

            $cordovaSQLite.execute(db, partido);

            // var apuesta_partido = "CREATE TABLE IF NOT EXISTS apuesta_partido (" +
            //     "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
            //     ",partido_id integer NOT NULL" +
            //     ",apuesta_id integer NOT NULL" +
            //     ",CONSTRAINT unique_id_apue UNIQUE (partido_id, apuesta_id)" +
            //     ",FOREIGN KEY (apuesta_id) REFERENCES apuesta (id)" +
            //     ",FOREIGN KEY (partido_id) REFERENCES partido (id))";
            //
            // $cordovaSQLite.execute(db, apuesta_partido);

            var puntuacion = "CREATE TABLE IF NOT EXISTS puntuaciones (" +
                "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ",hoyo integer NOT NULL" +
                ",golpes integer NOT NULL" +
                ",unidades integer NOT NULL" +
                ",jugador_id integer NOT NULL" +
                ",FOREIGN KEY (jugador_id) REFERENCES jugador (id))";

            $cordovaSQLite.execute(db, puntuacion);


            var foursome = "CREATE TABLE IF NOT EXISTS foursome (" +
                "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ",j_1_id integer NOT NULL" +
                ",j_1_nombre text NOT NULL" +
                ",j_2_id integer NOT NULL" +
                ",j_2_nombre text NOT NULL" +
                ",j_3_id integer NOT NULL" +
                ",j_3_nombre text NOT NULL" +
                ",j_4_id integer NOT NULL" +
                ",j_4_nombre text NOT NULL" +
                ",ventaja integer NOT NULL" +
                ",usuario_id integer NOT NULL" +
                ",FOREIGN KEY (usuario_id) REFERENCES usuario (id))";

            $cordovaSQLite.execute(db, foursome);


            var foursomeTwo = "CREATE TABLE IF NOT EXISTS foursomeTwo (" +
                "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ",j_1_id integer NOT NULL" +
                ",j_1_nombre text NOT NULL" +
                ",j_2_id integer NOT NULL" +
                ",j_2_nombre text NOT NULL" +
                ",usuario_id integer NOT NULL" +
                ",FOREIGN KEY (usuario_id) REFERENCES usuario (id))";

            $cordovaSQLite.execute(db, foursomeTwo);


            var foursomeConf = "CREATE TABLE IF NOT EXISTS configFoursome (" +
                "id integer NOT NULL PRIMARY KEY AUTOINCREMENT" +
                ",mudo_nombre text NOT NULL" +
                ",mudo_handicap integer NOT NULL" +
                ",modalidad text NOT NULL" +
                ",golpes integer NOT NULL" +
                ",usuario_id integer NOT NULL" +
                ",FOREIGN KEY (usuario_id) REFERENCES usuario (id))";

            $cordovaSQLite.execute(db, foursomeConf);

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

            function isUser() {
                var query = "SELECT * FROM usuario";
                $cordovaSQLite.execute(db, query).then(function (res) {
                    console.log(JSON.stringify(res) + " érrrrppppppp")
                    if (res.rows.length > 0) {

                        id_user_app = res.rows.item(0).id;
                        user_app = res.rows.item(0).email;
                        password_app = res.rows.item(0).password;
                        sesionActual = true;


                        console.log(id_user_app, user_app, password_app);
                    } else {
                        sesionActual = false;
                    }
                });
            }

            isUser();
        });

        $ionicPlatform.registerBackButtonAction(function(event) {

        }, 500);
    })

    .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        $stateProvider

            .state('login', {
                cache: false,
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginController'
            })

            .state('registro', {
                cache: false,
                url: '/registro',
                templateUrl: 'templates/registro.html',
                controller: 'registroController'
            })

            .state('inicio', {
                cache: false,
                url: '/inicio',
                templateUrl: 'templates/inicio.html',
                controller: 'inicioController'
            })

            .state('seleccion_jugadores', {
                cache: false,
                url: '/seleccion_jugadores',
                templateUrl: 'templates/seleccion_jugadores.html',
                controller: 'jugadoresController'
            })

            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabCampos.html"
            })

            .state('tabs.camp-dis', {
                url: '/camp-dis',
                views: {
                    'camp-dis': {
                        templateUrl: 'templates/campos_dispositivo.html',
                        controller: 'camposDispController'
                    }
                }
            })

            .state('tabs.camp-cue', {
                url: "/camp-cue",
                views: {
                    'camp-cue': {
                        templateUrl: 'templates/campos_cuenta.html',
                        controller: 'camposCuenController'
                    }
                }
            })

            .state('seleccion_apuestas', {
                cache: false,
                url: '/seleccion_apuestas',
                templateUrl: 'templates/seleccion_apuestas.html',
                controller: 'apuestasController'
            })

            .state('nuevo_campo', {
                cache: false,
                url: '/nuevo_campo',
                templateUrl: 'templates/nuevo_campo.html',
                controller: 'nuevoCampoController'
            })

            .state('juego', {
                cache: false,
                url: '/juego',
                templateUrl: 'templates/juego.html',
                controller: 'juegoController'
            })

            .state('juego_consulta', {
                cache: false,
                url: '/juego_consulta',
                templateUrl: 'templates/juego_consulta.html',
                controller: 'juegoConsultaController'
            })

            .state('seleccion_parejas', {
                cache: false,
                url: '/seleccion_parejas',
                templateUrl: 'templates/seleccion_parejas.html',
                controller: 'parejasController'
            })

            .state('tabsAp', {
                url: "/tabAp",
                abstract: true,
                templateUrl: "templates/tabApuestas.html"
            })

            .state('tabsAp.apue-raya', {
                url: '/apue-raya',
                views: {
                    'apue-raya': {
                        templateUrl: 'templates/juego.html',
                        controller: 'juegoController'
                    }
                }
            });

        $urlRouterProvider.otherwise('/inicio')


    })


    .service('serviceHttpRequest', function () {

        this.createPostHttpRequest = function (url, data) {
            var httpRequest = {
                method: 'POST',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "="
                            + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: data,
                timeout: 3000
            };

            return httpRequest;
        };

        this.createPutHttpRequest = function (url, data) {

            var httpRequest = {
                method: 'PUT',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "="
                            + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: data,
                timeout: 3000
            };

            return httpRequest;
        };

        this.createDelHttpRequest = function (url, data) {
            var httpRequest = {
                method: 'DELETE',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "="
                            + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: data,
                timeout: 3000
            };

            return httpRequest;
        }
    })

    .service('servicePantallas', function ($cordovaSQLite, $ionicLoading) {
        this.savePantalla = function (numPantalla) {
            var pantalla = "UPDATE pantalla SET pantalla = ? WHERE id = 1";
            $cordovaSQLite.execute(db, pantalla, [numPantalla]);
        };
    })

    .service('utils', function ($ionicPopup, $ionicLoading) {

        this.popup = function(title, template) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: template
            });
        };

        this.showLoading = function() {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>' +
                '<p>Cargando</p>',
                animation: 'fade-in'
            }).then(function () {
                // console.log("The loading indicator is now displayed");
            });
        };
    });
