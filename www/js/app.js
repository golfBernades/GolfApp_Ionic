// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db = null;
 // var dir = 'http://webgreenbets.com/public/';
// var dir = 'http://www.oruss.com.mx/greenbet/public/';
var dir = 'https://gps.oruss.com.mx/greenbet/public/';
var id_user_app = "";
var user_app = "";
var password_app = "";
var sesionActual = false;
var jugando;

angular.module('starter', ['ionic', 'ngCordova', 'starter.seleccion-jugadores',
    'starter.campos-dispositivo', 'starter.juego', 'starter.nuevo-campo',
    'starter.seleccion-apuestas', 'starter.inicio', 'starter.login',
    'starter.registro', 'starter.campos-cuenta', 'starter.juego_consulta',
    'starter.seleccion-parejas', 'starter.juego-nassau'])

    .run(function ($ionicPlatform, $cordovaSQLite, $state) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(false);
            }

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            configureDatabase();

        });

        function configureDatabase() {
            db = window.sqlitePlugin.openDatabase({
                name: 'ap23aata2aa3os.db',
                location: 'default'
            }, function successCallback() {
                console.log("La DB se abrió correctamente");
            }, function errorCallback() {
                console.log("No se pudo abrir la DB");
            });

            var pantalla = 'CREATE TABLE IF NOT EXISTS pantalla'
                + '(id integer PRIMARY KEY AUTOINCREMENT'
                + ',pantalla text)';

            $cordovaSQLite.execute(db, pantalla);

            var clave = 'CREATE TABLE IF NOT EXISTS clave'
                + '(clave text PRIMARY KEY)';

            $cordovaSQLite.execute(db, clave);

            var usuario = 'CREATE TABLE IF NOT EXISTS usuario'
                + '(id integer PRIMARY KEY'
                + ',email text'
                + ',password text'
                + ',jugando integer DEFAULT 0)';

            $cordovaSQLite.execute(db, usuario);

            var jugador = 'CREATE TABLE IF NOT EXISTS jugador'
                + '(id integer PRIMARY KEY AUTOINCREMENT, '
                + 'nombre text, '
                + 'handicap integer,'
                + 'jugar integer)';

            $cordovaSQLite.execute(db, jugador);

            var campo = 'CREATE TABLE IF NOT EXISTS campo (' +
                'id text NOT NULL PRIMARY KEY' +
                ',nombre text(100) NOT NULL' +
                ',par_hoyo_1 integer DEFAULT NULL' +
                ',par_hoyo_2 integer DEFAULT NULL' +
                ',par_hoyo_3 integer DEFAULT NULL' +
                ',par_hoyo_4 integer DEFAULT NULL' +
                ',par_hoyo_5 integer DEFAULT NULL' +
                ',par_hoyo_6 integer DEFAULT NULL' +
                ',par_hoyo_7 integer DEFAULT NULL' +
                ',par_hoyo_8 integer DEFAULT NULL' +
                ',par_hoyo_9 integer DEFAULT NULL' +
                ',par_hoyo_10 integer DEFAULT NULL' +
                ',par_hoyo_11 integer DEFAULT NULL' +
                ',par_hoyo_12 integer DEFAULT NULL' +
                ',par_hoyo_13 integer DEFAULT NULL' +
                ',par_hoyo_14 integer DEFAULT NULL' +
                ',par_hoyo_15 integer DEFAULT NULL' +
                ',par_hoyo_16 integer DEFAULT NULL' +
                ',par_hoyo_17 integer DEFAULT NULL' +
                ',par_hoyo_18 integer DEFAULT NULL' +
                ',ventaja_hoyo_1 integer DEFAULT NULL' +
                ',ventaja_hoyo_2 integer DEFAULT NULL' +
                ',ventaja_hoyo_3 integer DEFAULT NULL' +
                ',ventaja_hoyo_4 integer DEFAULT NULL' +
                ',ventaja_hoyo_5 integer DEFAULT NULL' +
                ',ventaja_hoyo_6 integer DEFAULT NULL' +
                ',ventaja_hoyo_7 integer DEFAULT NULL' +
                ',ventaja_hoyo_8 integer DEFAULT NULL' +
                ',ventaja_hoyo_9 integer DEFAULT NULL' +
                ',ventaja_hoyo_10 integer DEFAULT NULL' +
                ',ventaja_hoyo_11 integer DEFAULT NULL' +
                ',ventaja_hoyo_12 integer DEFAULT NULL' +
                ',ventaja_hoyo_13 integer DEFAULT NULL' +
                ',ventaja_hoyo_14 integer DEFAULT NULL' +
                ',ventaja_hoyo_15 integer DEFAULT NULL' +
                ',ventaja_hoyo_16 integer DEFAULT NULL' +
                ',ventaja_hoyo_17 integer DEFAULT NULL' +
                ',ventaja_hoyo_18 integer DEFAULT NULL' +
                ',cuenta integer (1) NOT NULL' +
                ',seleccionado integer(1) NOT NULL' +
                ',usuario_id integer NOT NULL' +
                ',FOREIGN KEY (usuario_id) REFERENCES usuario (id))';

            $cordovaSQLite.execute(db, campo);

            var apuesta = 'CREATE TABLE IF NOT EXISTS apuesta (' +
                'id integer NOT NULL PRIMARY KEY AUTOINCREMENT' +
                ',nombre varchar(50) NOT NULL' +
                ',seleccionada integer(1) NOT NULL' +
                ',CONSTRAINT nombre_ap_unique UNIQUE (nombre))';

            $cordovaSQLite.execute(db, apuesta);

            var partido = 'CREATE TABLE IF NOT EXISTS partido ('
                + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT'
                + ', clave_consulta CHAR(8) NULL UNIQUE'
                + ', clave_edicion CHAR(8) NULL UNIQUE'
                + ', inicio DATETIME NOT NULL'
                + ', fin DATETIME DEFAULT NULL'
                + ', id_servidor INTEGER NULL UNIQUE)';

            $cordovaSQLite.execute(db, partido);

            var puntuacion = 'CREATE TABLE IF NOT EXISTS puntuaciones ('
                + 'id integer NOT NULL PRIMARY KEY AUTOINCREMENT'
                + ',hoyo integer NOT NULL'
                + ',golpes integer NOT NULL'
                + ',unidades integer NOT NULL'
                + ',jugador_id integer NOT NULL'
                + ',FOREIGN KEY (jugador_id) REFERENCES jugador (id))';

            $cordovaSQLite.execute(db, puntuacion);

            var tableroJson = 'CREATE TABLE IF NOT EXISTS tablero_json ('
                + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '
                + 'tablero TEXT NOT NULL'
                + ')';

            $cordovaSQLite.execute(db, tableroJson);

            var consultaJson = 'CREATE TABLE IF NOT EXISTS consulta_json ('
                + 'clave INTEGER PRIMARY KEY'
                + ')';

            $cordovaSQLite.execute(db, consultaJson);

            $cordovaSQLite.execute(db, "SELECT * FROM consulta_json")
                .then(function (res) {
                    if(res.rows.length==0){
                        var insertConsultaJson = 'INSERT INTO consulta_json (clave) VALUES (?)';
                        $cordovaSQLite.execute(db, insertConsultaJson, [1]);
                    }
                }, function (err) {
                    console.log(JSON.stringify(err))
                });

            var nassau = 'CREATE TABLE IF NOT EXISTS nassau ('
                + 'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'
                + 'p1_j1_id INTEGER NULL,'
                + 'p1_j1_nombre TEXT NULL,'
                + 'p1_j1_handicap INTEGER NULL,'
                + 'p1_j1_idx INTEGER NULL,'
                + 'p1_j2_id INTEGER NULL,'
                + 'p1_j2_nombre TEXT NULL,'
                + 'p1_j2_handicap INTEGER NULL,'
                + 'p1_j2_idx INTEGER NULL,'
                + 'p1_jug_ventaja INTEGER NULL,'
                + 'p2_j1_id INTEGER NULL,'
                + 'p2_j1_nombre TEXT NULL,'
                + 'p2_j1_handicap INTEGER NULL,'
                + 'p2_j1_idx INTEGER NULL,'
                + 'p2_j2_id INTEGER NULL,'
                + 'p2_j2_nombre TEXT  NULL,'
                + 'p2_j2_handicap INTEGER NULL,'
                + 'p2_j2_idx INTEGER NULL,'
                + 'p2_jug_ventaja INTEGER NULL'
                + ')';

            $cordovaSQLite.execute(db, nassau);

            var configFoursome = 'CREATE TABLE IF NOT EXISTS config_foursome '
                + '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, '
                + 'modo_jugadores TEXT NOT NULL, '
                + 'modo_presiones TEXT NOT NULL, '
                + 'pareja_idx INTEGER NOT NULL'
                + ')';

            $cordovaSQLite.execute(db, configFoursome);


            $cordovaSQLite.execute(db, "SELECT * FROM config_foursome")
                .then(function (res) {
                    if(res.rows.length==0){
                        var query = 'INSERT INTO config_foursome ' +
                        '(modo_jugadores, modo_presiones, pareja_idx) VALUES ' +
                        '(?, ?, ?)';
                        var qureyData = ['pareja', 'normal', 0];
                        $cordovaSQLite.execute(db, query, qureyData);
                    }
                }, function (err) {
                    console.log(JSON.stringify(err))
                });

            var idx_partido_partido_jugador_id_fk = 'CREATE INDEX ' +
                'IF NOT EXISTS idx_partido_partido_jugador_id_fk ' +
                'ON partido (jugador_id);';

            $cordovaSQLite.execute(db, idx_partido_partido_jugador_id_fk);

            var idx_partido_partido_campo_id_fk = 'CREATE INDEX ' +
                'IF NOT EXISTS idx_partido_partido_campo_id_fk ' +
                'ON partido (campo_id)';

            $cordovaSQLite.execute(db, idx_partido_partido_campo_id_fk);

            var idx_jugador_partido_jugador_partido_partido_id_fk =
                'CREATE INDEX IF NOT EXISTS ' +
                'idx_jugador_partido_jugador_partido_partido_id_fk ' +
                'ON jugador_partido (partido_id)';

            $cordovaSQLite.execute(db, idx_jugador_partido_jugador_partido_partido_id_fk);

            var idx_apuesta_partido_apuesta_partido_apuesta_id_fk =
                'CREATE INDEX IF NOT EXISTS ' +
                'idx_apuesta_partido_apuesta_partido_apuesta_id_fk ' +
                'ON apuesta_partido (apuesta_id)';

            $cordovaSQLite.execute(db, idx_apuesta_partido_apuesta_partido_apuesta_id_fk);

            var idx_puntuaciones_puntuaciones_partido_id_fk = 'CREATE INDEX ' +
                'IF NOT EXISTS idx_puntuaciones_puntuaciones_partido_id_fk ' +
                'ON puntuaciones (partido_id)';

            $cordovaSQLite.execute(db, idx_puntuaciones_puntuaciones_partido_id_fk);
        }

        $ionicPlatform.registerBackButtonAction(function (event) {

        }, 500);
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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

            .state('juego_foursome', {
                cache: false,
                url: '/juego_foursome',
                templateUrl: 'templates/juego_foursome.html',
                controller: 'juegoFoursomeController'
            })

            .state('acercaDe', {
                cache: false,
                url: '/acercaDe',
                templateUrl: 'templates/acercaDe.html'
            });

        // $urlRouterProvider.otherwise('/juego_foursome');
		$urlRouterProvider.otherwise('/inicio');

        // Configuración de elementos visuales
        $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.tabs.style('striped');
        $ionicConfigProvider.tabs.position('top');
        $ionicConfigProvider.views.swipeBackEnabled(false);
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
                timeout: 7000
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
                timeout: 7000
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
                timeout: 7000
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

        this.popup = function (title, template) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: template,
                okText: 'Aceptar'
            });
        };

        this.showLoading = function () {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>' +
                '<p>Cargando</p>',
                animation: 'fade-in'
            }).then(function () {
                // console.log("The loading indicator is now displayed");
            });
        };

        this.hideLoading = function () {
            $ionicLoading.hide();
        }
    })

    .service('sql', function ($q, $cordovaSQLite) {
        this.sqlQuery = function (db, query, queryData) {
            var defered = $q.defer();
            var promise = defered.promise;

            $cordovaSQLite.execute(db, query, queryData)
                .then(function successCallback(res) {
                    defered.resolve(res);
                }, function errorCallback(error) {
                    defered.reject(error);
                });

            return promise;
        };
    });
