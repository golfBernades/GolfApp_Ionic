/**
 * Created by Victor Hugo on 16/04/2017.
 */

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

    this.actualizar = function (jugadorIndex, hoyoIndex) {
        // Verificar si ya terminaron todos los jugadores en ese hoyo
        var terminaronTurno = true;
        var playersNumber = this.partido.scoreBoard.length;
        for (var i = 0; i < playersNumber; i++) {
            if (this.partido.scoreBoard[i].golpes[hoyoIndex] == 0) {
                // Aún no terminan de pegar los jugadores
                terminaronTurno = false;
                break;
            }
        }
        // Realizar el conteo de puntos en caso de que ya todos jugaran el
        // hoyo en curso
        if (terminaronTurno) {
            console.log('Todos terminaron el hoyo ' + (hoyoIndex + 1));
            // Se recorren los jugadores para obtener las Puntuaciones de
            // todos contra todos
            var playersNumber = this.partido.scoreBoard.length;
            for (var i = 0; i < playersNumber; i++) {
                for (var j = 0; j < playersNumber; j++) {
                    // Validación para que un Jugador solo se compare con
                    // los demás y no con el mismo
                    if (i != j) {
                        var golpesI = this.partido.scoreBoard[i].golpes[hoyoIndex];
                        var golpesJ = this.partido.scoreBoard[j].golpes[hoyoIndex];
                        var unidadesI = this.partido.scoreBoard[i].unidades[hoyoIndex];
                        var unidadesJ = this.partido.scoreBoard[j].unidades[hoyoIndex];
                        var handicapI = this.partido.jugadores[i].handicap;
                        var handicapJ = this.partido.jugadores[j].handicap;
                        var ventajaHoyo = this.partido.campo.ventajas[hoyoIndex];
                        var diferenciaIJ = (handicapI - handicapJ);
                        var diferenciaJI = (handicapJ - handicapI);

                        console.log('hoyo', hoyoIndex + 1);

                        // Si se cumple, el Jugador I le dará ventaja al J
                        if (diferenciaIJ >= ventajaHoyo) {
                            console.log('jugadores', 'i: ' + (i + 1) + ', j: ' + (j + 1));
                            // Si se cumple, aplicará más de una ventaja
                            if (diferenciaIJ > 18) {
                                console.log('diferenciaIJ', diferenciaIJ);
                                vents = 1;
                                while (diferenciaIJ - 18 >= ventajaHoyo) {
                                    vents++;
                                    diferenciaIJ -= 18;
                                }
                                console.log('ventajasIJ', vents);
                                golpesI -= vents;
                            }
                            // Aplica la ventaja normal (restar un golpe)
                            else {
                                console.log('ventajasIJ', 1);
                                golpesI--;
                            }
                        }
                        // Si se cumple, el Jugador J le dará ventaja al I
                        else if (diferenciaJI >= ventajaHoyo) {
                            console.log('jugadores', 'i: ' + (i + 1) + ', j: ' + (j + 1));
                            // Si se cumple, aplicará más de una ventaja
                            if (diferenciaJI > 18) {
                                console.log('diferenciaJI', diferenciaJI);
                                vents = 1;
                                while (diferenciaJI - 18 >= ventajaHoyo) {
                                    vents++;
                                    diferenciaJI -= 18;
                                }
                                console.log('ventajasJI', vents);
                                golpesJ -= vents;
                            }
                            // Aplica la ventaja normal (restar un golpe)
                            else {
                                console.log('ventajasJI', 1);
                                golpesJ--;
                            }
                        }

                        // Se suma un punto al Jugador que le corresponda de
                        // acuerdo al oponente actual en esta ronda de rayas.
                        if (golpesI < golpesJ) {
                            this.scoreRayas[i].puntos[hoyoIndex]++;
                        } else if (golpesI > golpesJ) {
                            this.scoreRayas[i].puntos[hoyoIndex]--;
                        }
                        this.scoreRayas[i].puntos[hoyoIndex] += unidadesI - unidadesJ;
                    }
                }
                // Se suman los puntos obtenidos por el Jugador en el hoyo
                // anterior en caso de que no se esté jugando en el primer hoyo.
                if (hoyoIndex > 0) {
                    this.scoreRayas[i].puntos[hoyoIndex]
                        += this.scoreRayas[i].puntos[hoyoIndex - 1];
                    if (hoyoIndex == 9) {
                        this.scoreRayas[i].puntos[hoyoIndex]
                            -= this.scoreRayas[i].puntos[8];
                    }
                }
            }
        }
    };

    this.createScoreboard = function () {
        var numJugadores = this.partido.scoreBoard.length;
        var numHoyos = this.partido.scoreBoard[0].golpes.length;
        for (var i = 0; i < numJugadores; i++) {
            this.scoreRayas.push({puntos: []});
            for (var j = 0; j < numHoyos; j++) {
                this.scoreRayas[i].puntos.push(0);
            }
        }
    };

    this.createScoreboard();
}
