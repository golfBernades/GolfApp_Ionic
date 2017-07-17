/**
 * Esta función crea una instancia de un objeto de tipo ApuestaFoursome, que es
 * el gestor de las puntuaciones para un partido donde se está jugando esta
 * modalidad.
 *
 * @param partido Es la instancia del Partido donde se está implementando
 * esta Apuesta.
 * @param modalidad Determina si la apuesta se llevara en parejas o de forma
 * individual. Las modalidades pueden ser:
 *
 * individual_normal
 * individual_california
 * pareja_normal
 * pareja_california
 *
 * @author Porfirio Ángel Díaz Sánchez
 */
function ApuestaFoursome(partido, modalidad) {
    this.partido = partido;

    this.competiciones = [];

    var playersNumber = this.partido.scoreBoard.length;

    /**
     * Agrega dos jugadores que están compitiendo individualmente uno contra
     * el otro en esta apuesta.
     *
     * @param jugador1 Instancia del jugador 1 {index, nombre, handicap}
     * @param jugador2 Instancia del jugador 2 {index, nombre, handicap}
     */
    this.agregarCompeticionIndividual = function (jugador1, jugador2) {
        this.competiciones.push({
            jugador1: jugador1,
            jugador2: jugador2,
            puntuaciones: [
                [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
                [], []
            ]
        });
    };

    /**
     * Agrega dos parejas que están compitiendo una contra la otra en esta
     * apuesta.
     *
     * @param p1Jugador1 Instancia del jugador 1 de la pareja 1
     * {index, nombre, handicap}
     * @param p1Jugador2 Instancia del jugador 2 de la pareja 1
     * {index, nombre, handicap}
     * @param p1Ventaja Es el índice que indica cual jugador de la pareja 1
     * llevará la ventaja (1 o 2).
     * @param p2Jugador1 Instancia del jugador 1 de la pareja 2
     * {index, nombre, handicap}
     * @param p2Jugador2 Instancia del jugador 2 de la pareja 2
     * {index, nombre, handicap}
     * @param p2Ventaja Es el índice que indica cual jugador de la pareja 2
     * llevará la ventaja (1 o 2).
     */
    this.agregarCompeticionPareja = function (p1Jugador1, p1Jugador2, p1Ventaja,
                                              p2Jugador1, p2Jugador2, p2Ventaja) {
        this.competiciones.push({
            p1Jugador1: p1Jugador1,
            p1Jugador2: p1Jugador2,
            p1Ventaja: p1Ventaja,
            p2Jugador1: p2Jugador1,
            p2Jugador2: p2Jugador2,
            p2Ventaja: p2Ventaja,
            puntuaciones: [
                [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
                [], []
            ]
        });
    };

    this.resetScoreboard = function () {
        $.each(this.competiciones, function (index, value) {
            value.puntuaciones = [
                [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
                [], []
            ];
        });
    };

    this.actualizar = function () {
        this.resetScoreboard();

        $.each(this.competiciones, function (index, competicion) {
            if (modalidad == 'pareja_normal'
                || modalidad == 'pareja_california') {
                this.actualizarParejas(competicion);
            } else if (modalidad == 'individual_normal'
                || modalidad == 'pareja_california') {
                this.actualizarIndividual(competicion);
            }
        });
    };

    this.actualizarIndividual = function (competicion) {
        for (var hIndex = 0; hIndex < 18; hIndex++) {
            var turnoTerminado = false;
            var indexJ1 = competicion.jugador1.index;
            var golpesJ1 = this.partido.scoreBoard[indexJ1].golpes[hIndex];
            var indexJ2 = competicion.jugador2.index;
            var golpesJ2 = this.partido.scoreBoard[indexJ2].golpes[hIndex];

            if (golpesJ1 && golpesJ2) {
                turnoTerminado = true;
            }

            if (turnoTerminado) {
                this.actualizarHoyoIndividual(competicion, hIndex);
            }
        }
    };

    this.actualizarHoyoIndividual = function (competicion, hIndex) {
        var indexJ1 = competicion.jugador1.index;
        var golpesJ1 = this.partido.scoreBoard[indexJ1].golpes[hIndex];
        var indexJ2 = competicion.jugador2.index;
        var golpesJ2 = this.partido.scoreBoard[indexJ2].golpes[hIndex];
        var handicapJ1 = this.partido.jugadores[indexJ1].handicap;
        var handicapJ2 = this.partido.jugadores[indexJ2].handicap;
        var ventajaHoyo = this.partido.campo.ventajas[hIndex].value;
        var diferenciaJ1J2 = (handicapJ1 - handicapJ2);
        var diferenciaJ2J1 = (handicapJ2 - handicapJ1);
        var vents = 0;

        if (diferenciaJ1J2 >= ventajaHoyo) {
            if (diferenciaJ1J2 > 18) {
                vents = 1;
                while (diferenciaJ1J2 - 18 >= ventajaHoyo) {
                    vents++;
                    diferenciaJ1J2 -= 18;
                }
                golpesJ1 -= vents;
            } else {
                golpesJ1--;
            }
        } else if (diferenciaJ2J1 >= ventajaHoyo) {
            if (diferenciaJ2J1 > 18) {
                vents = 1;
                while (diferenciaJ2J1 - 18 >= ventajaHoyo) {
                    vents++;
                    diferenciaJ2J1 -= 18;
                }
                golpesJ2 -= vents;
            }
            else {
                golpesJ2--;
            }
        }

        if (golpesJ1 < golpesJ2) {
            if (hIndex > 0) {
                var compAnterior = competicion.puntuaciones[hIndex - 1];
                var compActual = competicion.puntuaciones[hIndex];

                for (var i = 0; i < compAnterior.length; i++) {
                    compActual.push(compAnterior[i] + 1);
                }

                var ultimaPuntuacion = compActual[compActual.length - 1];

                if (ultimaPuntuacion == 3 || ultimaPuntuacion == -3) {
                    console.log('Se agregará otra puntuación')
                }
            } else {
                competicion.puntuaciones[hIndex].push(1);
            }
        } else if (golpesI > golpesJ) {
            if (hIndex > 0) {
                var compAnterior = competicion.puntuaciones[hIndex - 1];
                var compActual = competicion.puntuaciones[hIndex];

                for (var i = 0; i < compAnterior.length; i++) {
                    compActual.push(compAnterior[i] - 1);
                }

                var ultimaPuntuacion = compActual[compActual.length - 1];

                if (ultimaPuntuacion == 3 || ultimaPuntuacion == -3) {
                    console.log('Se agregará otra puntuación')
                }
            } else {
                competicion.puntuaciones[hIndex].push(-1);
            }
        } else {
            if (hIndex > 0) {
                var compAnterior = competicion.puntuaciones[hIndex - 1];
                var compActual = competicion.puntuaciones[hIndex];

                for (var i = 0; i < compAnterior.length; i++) {
                    compActual.push(compAnterior[i]);
                }
            } else {
                competicion.puntuaciones[hIndex].push(0);
            }
        }
    };

    this.actualizarParejas = function (competicion) {
        for (var hIndex = 0; hIndex < 18; hIndex++) {
            var turnoTerminado = false;
            var indexP1J1 = competicion.p1Jugador1.index;
            var golpesP1J1 = this.partido.scoreBoard[indexP1J1].golpes[hIndex];
            var indexP1J2 = competicion.p1Jugador2.index;
            var golpesP1J2 = this.partido.scoreBoard[indexP1J2].golpes[hIndex];
            var indexP2J1 = competicion.p2Jugador1.index;
            var golpesP2J1 = this.partido.scoreBoard[indexP2J1].golpes[hIndex];
            var indexP2J2 = competicion.p2Jugador2.index;
            var golpesP2J2 = this.partido.scoreBoard[indexP2J2].golpes[hIndex];

            if (golpesP1J1 && golpesP1J2 && golpesP2J1 && golpesP2J2) {
                turnoTerminado = true;
            }

            if (turnoTerminado) {
                // TODO Hacer las acciones para actualizar el hoyo
            }
        }
    };

    this.actualizarHoyoParejas = function () {

    };
}