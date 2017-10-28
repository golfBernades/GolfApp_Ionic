/**
 * Esta función crea una instancia de un objeto de tipo ApuestaRayas, que es
 * el gestor de las Puntuaciones para un Partido donde se está jugando esta
 * modalidad.
 *
 * @param partido Es la instancia del Partido donde se está implementando
 * esta Apuesta.
 *
 * @author Porfirio Ángel Díaz Sánchez
 */
function ApuestaRayas(partido) {
    this.partido = partido;
    this.scoreRayas = [];

    // this.actualizar = function (jugadorIndex, hoyoIndex) {
    this.actualizar = function (jugadorIndex, hoyoIndex) {
        // console.log('GolfApp', 'ApuestaRayas.actualizar');

        var playersNumber = this.partido.scoreBoard.length;

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
                // console.log('GolfApp', 'ApuestaRayas.actualizar [hoyo '
                //     + hIndex + ']');
                this.actualizarHoyo(hIndex);
            }
        }
    };

    this.actualizarHoyo = function (hIndex, playersNumber) {
        var playersNumber = this.partido.scoreBoard.length;

        // console.log(playersNumber + ' PLAYERS')

        for (var i = 0; i < playersNumber; i++) {
            for (var j = 0; j < playersNumber; j++) {
                // Validación para que un Jugador solo se compare con
                // los demás y no con el mismo
                if (i != j) {
                    var golpesI = this.partido.scoreBoard[i].golpes[hIndex];
                    var golpesJ = this.partido.scoreBoard[j].golpes[hIndex];
                    var unidadesI = this.partido.scoreBoard[i].unidades[hIndex];
                    var unidadesJ = this.partido.scoreBoard[j].unidades[hIndex];
                    var handicapI = this.partido.jugadores[i].handicap;
                    var handicapJ = this.partido.jugadores[j].handicap;
                    var ventajaHoyo = this.partido.campo.ventajas[hIndex].value;
                    var diferenciaIJ = (handicapI - handicapJ);
                    var diferenciaJI = (handicapJ - handicapI);

                    // console.log('ventajaHoyo[' + hIndex + '] = ' + JSON.stringify(ventajaHoyo));

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

                    // Se suma un punto al Jugador que le corresponda de
                    // acuerdo al oponente actual en esta ronda de units.
                    if (golpesI < golpesJ) {
                        this.scoreRayas[i].puntos[hIndex]++;
                    } else if (golpesI > golpesJ) {
                        this.scoreRayas[i].puntos[hIndex]--;
                    }
                    this.scoreRayas[i].puntos[hIndex] += unidadesI - unidadesJ;
                }
            }
            // Se suman los puntos obtenidos por el Jugador en el hoyo
            // anterior en caso de que no se esté jugando en el primer hoyo.
            if (hIndex > 0) {
                this.scoreRayas[i].puntos[hIndex]
                    += this.scoreRayas[i].puntos[hIndex - 1];
                if (hIndex == 9) {
                    this.scoreRayas[i].puntos[hIndex]
                        -= this.scoreRayas[i].puntos[8];
                }
            }
        }
    };

    this.createScoreboard = function () {
        var numJugadores = this.partido.scoreBoard.length;
        var numHoyos = this.partido.scoreBoard[0].golpes.length;
        this.scoreRayas = [];
        for (var i = 0; i < numJugadores; i++) {
            this.scoreRayas.push({puntos: []});
            for (var j = 0; j < numHoyos; j++) {
                this.scoreRayas[i].puntos.push(0);
            }
        }
    };

    this.createScoreboard();
}
