/**
 * Esta función crea una instancia de un objeto de tipo ApuestaConjea, que es
 * el gestor de las puntuaciones para un Partido donde se está jugando esta
 * modalidad.
 *
 * @param partido Es la instancia del Partido donde se está implementando
 * esta Apuesta.
 *
 * @author Porfirio Ángel Díaz Sánchez
 */
function ApuestaConeja(partido) {
    this.partido = partido;
    this.scoreConeja = [];
    var hayConeja1a6;
    var hayConeja7a12;

    this.actualizar = function () {
        var playersNumber = this.partido.scoreBoard.length;

        hayConeja1a6 = false;
        hayConeja7a12 = false;

        this.createScoreboard();

        for (var hIndex = 0; hIndex < 18; hIndex++) {
            var turnoTerminado = true;
            for (var jIndex = 0; jIndex < playersNumber; jIndex++) {
                if (this.partido.scoreBoard[jIndex].golpes[hIndex] == 0) {
                    turnoTerminado = false;
                    break;
                }
            }
            if (turnoTerminado) {
                this.actualizarHoyo(hIndex);
            }
        }
    };

    this.actualizarHoyo = function (hIndex) {
        var playersNumber = this.partido.scoreBoard.length;
        var llevaPata = true;

        for (var i = 0; i < playersNumber; i++) {
            var jugadorConPataAnteriorIndex = -1;

            llevaPata = true;

            for (var j = 0; j < playersNumber; j++) {
                // Validación para que un Jugador solo se compare con
                // los demás y no con el mismo
                if (i != j) {
                    var golpesI = this.partido.scoreBoard[i].golpes[hIndex];
                    var golpesJ = this.partido.scoreBoard[j].golpes[hIndex];
                    var handicapI = this.partido.jugadores[i].handicap;
                    var handicapJ = this.partido.jugadores[j].handicap;
                    var ventajaHoyo = this.partido.campo.ventajas[hIndex].value;
                    var diferenciaIJ = (handicapI - handicapJ);
                    var diferenciaJI = (handicapJ - handicapI);

                    // Se verifica si el jugador j llevaba pata en el hoyo
                    // anterior.
                    if (hIndex > 0) {
                        // var patasAnterior =
                        //     parseInt(this.scoreConeja[j].status[hIndex - 1]);
                        //
                        // if (!isNaN(patasAnterior)) {
                        //     jugadorConPataAnteriorIndex = j;
                        // }

                        var statusAnterior = this.scoreConeja[j]
                            .status[hIndex - 1].toString();

                        var patasAnterior = parseInt(statusAnterior);

                        if ((hIndex > 5 && hIndex < 11)
                            || (hIndex > 11 && hIndex < 17)) {
                            if (statusAnterior.includes('C')) {
                                jugadorConPataAnteriorIndex = j;
                            }
                        } else if (!isNaN(patasAnterior)) {
                            jugadorConPataAnteriorIndex = j;
                        }
                    }

                    // Si se cumple, el Jugador I le dará ventaja al J
                    if (diferenciaIJ >= ventajaHoyo) {
                        // console.log('jugadores', 'i: ' + (i + 1) + ', j: ' + (j + 1));
                        // Si se cumple, aplicará más de una ventaja
                        if (diferenciaIJ > 18) {
                            // console.log('diferenciaIJ', diferenciaIJ);
                            vents = 1;
                            while (diferenciaIJ - 18 >= ventajaHoyo) {
                                vents++;
                                diferenciaIJ -= 18;
                            }
                            // console.log('ventajasIJ', vents);
                            golpesI -= vents;
                        }
                        // Aplica la ventaja normal (restar un golpe)
                        else {
                            // console.log('ventajasIJ', 1);
                            golpesI--;
                        }
                    }
                    // Si se cumple, el Jugador J le dará ventaja al I
                    else if (diferenciaJI >= ventajaHoyo) {
                        // console.log('jugadores', 'i: ' + (i + 1) + ', j: ' + (j + 1));
                        // Si se cumple, aplicará más de una ventaja
                        if (diferenciaJI > 18) {
                            // console.log('diferenciaJI', diferenciaJI);
                            vents = 1;
                            while (diferenciaJI - 18 >= ventajaHoyo) {
                                vents++;
                                diferenciaJI -= 18;
                            }
                            // console.log('ventajasJI', vents);
                            golpesJ -= vents;
                        }
                        // Aplica la ventaja normal (restar un golpe)
                        else {
                            // console.log('ventajasJI', 1);
                            golpesJ--;
                        }
                    }

                    // Se verifica si el jugador i hizo igual o más puntos
                    // que el j, para descartarlo como candidato a ganar pata.
                    if (golpesI >= golpesJ) {
                        // console.log('GolfApp', 'El jugador ' + i + ' con '
                        //     + golpesI + ' golpes queda descartado para llevar '
                        //     + 'para en el hoyo ' + (hIndex + 1));
                        llevaPata = false;
                        break;
                    }
                }
            }

            // Se verifica si el jugador i terminó el turno con la pata, y
            // de ser así se le suma, o bien, se determina si ya ganó la coneja.
            if (llevaPata) {
                // console.log('El menor en el hoyo [' + (hIndex + 1) + '] fue: '
                //     + partido.jugadores[i].nombre);
                if (hIndex > 0) {
                    // Se busca si en el hoyo anterior alguien más llevaba la
                    // pata
                    if (jugadorConPataAnteriorIndex != -1) {
                        // console.log('Otro jugador llevaba pata en el hoyo ['
                        //     + jugadorConPataAnteriorIndex + ']');

                        // Obtiene la cantidad de patas que llevaba otro
                        // jugador en el hoyo anterior

                        // var patasAnterior
                        //     = parseInt(this
                        //     .scoreConeja[jugadorConPataAnteriorIndex]
                        //     .status[hIndex - 1].toString());

                        statusAnterior =
                            this.scoreConeja[jugadorConPataAnteriorIndex]
                                .status[hIndex - 1].toString();

                        if ((hIndex > 5 && hIndex < 11)
                            || (hIndex > 11 && hIndex < 17)) {
                            if (statusAnterior.includes('C')) {
                                patasAnterior = 1;
                            }
                        } else if (!isNaN(statusAnterior)) {
                            patasAnterior = parseInt(statusAnterior);
                        }

                        patasAnterior--;

                        // Resta una pata al otro jugador o la establece
                        // como una cadena vacía si ya resuta 0 patas
                        if (patasAnterior)
                            patasAnterior = patasAnterior.toString();
                        else
                            patasAnterior = '.';

                        this.scoreConeja[jugadorConPataAnteriorIndex]
                            .status[hIndex] = patasAnterior;
                    } else {
                        statusAnterior = this.scoreConeja[i].status[hIndex - 1]
                            .toString();

                        if ((hIndex > 5 && hIndex < 11)
                            || (hIndex > 11 && hIndex < 17)) {
                            if (statusAnterior.includes('C')) {
                                patasAnterior = 1;
                            }
                        } else {
                            patasAnterior = parseInt(statusAnterior);
                        }


                        if (isNaN(patasAnterior)) {
                            this.scoreConeja[i].status[hIndex] = 1;
                        } else {
                            this.scoreConeja[i].status[hIndex]
                                = patasAnterior + 1;
                        }
                    }
                } else {
                    // console.log('GolfApp', 'No se verificarán patas en hoyos' +
                    //     ' anteriores');
                    this.scoreConeja[i].status[hIndex] = '1';
                }
                break;
            }
        }

        if (!llevaPata && hIndex > 0) {
            for (var i = 0; i < playersNumber; i++) {
                statusAnterior = this.scoreConeja[i].status[hIndex - 1]
                    .toString();

                if ((hIndex > 5 && hIndex < 11)
                    || (hIndex > 11 && hIndex < 17)) {
                    if (statusAnterior.includes('C')) {
                        this.scoreConeja[i].status[hIndex] = '1';
                    }
                } else if (statusAnterior != 'C') {
                    this.scoreConeja[i].status[hIndex] = statusAnterior;
                }
            }
        }

        if (hIndex == 5 || hIndex == 11 || hIndex == 17) {
            for (var i = 0; i < playersNumber; i++) {
                var status = this.scoreConeja[i].status[hIndex];
                if (!isNaN(status)) {
                    if (hIndex == 11) {
                        if (hayConeja1a6) {
                            this.scoreConeja[i].status[hIndex] = 'C';
                        } else {
                            this.scoreConeja[i].status[hIndex] = '2C';
                        }
                        hayConeja1a6 = true;
                        hayConeja7a12 = true;
                    } else if (hIndex == 17) {
                        if (hayConeja1a6) {
                            if (hayConeja7a12) {
                                this.scoreConeja[i].status[hIndex] = 'C';
                            } else {
                                this.scoreConeja[i].status[hIndex] = '2C';
                            }
                        } else {
                            this.scoreConeja[i].status[hIndex] = '3C';
                        }
                        hayConeja1a6 = true;
                        hayConeja7a12 = true;
                    } else {
                        this.scoreConeja[i].status[hIndex] = 'C';
                        hayConeja1a6 = true;
                    }
                }
            }
        } else {
            if (hIndex > 5 && hIndex < 11) {
                if (!hayConeja1a6) {
                    for (var i = 0; i < playersNumber; i++) {
                        var status = this.scoreConeja[i].status[hIndex];
                        if (!isNaN(status)) {
                            this.scoreConeja[i].status[hIndex] = 'C';
                            hayConeja1a6 = true;
                        }
                    }
                }
            } else if(hIndex > 11 && hIndex < 17) {
                if(!hayConeja1a6) {
                    for (var i = 0; i < playersNumber; i++) {
                        var status = this.scoreConeja[i].status[hIndex];
                        if (!isNaN(status)) {
                            this.scoreConeja[i].status[hIndex] = '2C';
                            hayConeja1a6 = true;
                            hayConeja7a12 = true;
                        }
                    }
                } else if(!hayConeja7a12) {
                    for (var i = 0; i < playersNumber; i++) {
                        var status = this.scoreConeja[i].status[hIndex];
                        if (!isNaN(status)) {
                            this.scoreConeja[i].status[hIndex] = 'C';
                            hayConeja7a12 = true;
                        }
                    }
                }
            }
        }
    };

    this.createScoreboard = function () {
        var numJugadores = this.partido.scoreBoard.length;
        var numHoyos = this.partido.scoreBoard[0].golpes.length;
        this.scoreConeja = [];

        for (var i = 0; i < numJugadores; i++) {
            this.scoreConeja.push({status: []});
            for (var j = 0; j < numHoyos; j++) {
                this.scoreConeja[i].status.push('.');
            }
        }
    };

    this.createScoreboard();
}
