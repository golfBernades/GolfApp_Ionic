function ApuestaConeja(partido) {
    this.partido = partido;
    this.scoreConeja = [];
    var playersNumber = this.partido.scoreBoard.length;
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

                var name = this.partido.jugadores[jIndex].nombre.toLowerCase();

                if (name !== 'mudo') {
                    if (this.partido.scoreBoard[jIndex].golpes[hIndex] == 0) {
                        turnoTerminado = false;
                        break;
                    }
                }
            }

            if (turnoTerminado) {
                this.actualizarHoyo(hIndex);
            }
        }
    };

    this.actualizarHoyo = function (hIndex) {
        var jugadorPataActual = -1;
        var jugadorPataAnterior = -1;

        for (var i = 0; i < playersNumber; i++) {

            if (hIndex > 0 && this.scoreConeja[i].patas[hIndex - 1] > 0) {
                jugadorPataAnterior = i;
                break;
            }
        }

        for (var i = 0; i < playersNumber; i++) {
            var llevaPataJugadorI = true;

            var nameI = this.partido.jugadores[i].nombre.toLowerCase();

            if (nameI === 'mudo') {
                continue;
            }

            for (var j = 0; j < playersNumber; j++) {

                var nameJ = this.partido.jugadores[j].nombre.toLowerCase();

                if (nameJ === 'mudo') {
                    continue;
                }

                if (i != j) {
                    var golpesI = this.partido.scoreBoard[i].golpes[hIndex];
                    var golpesJ = this.partido.scoreBoard[j].golpes[hIndex];
                    var handicapI = this.partido.jugadores[i].handicap;
                    var handicapJ = this.partido.jugadores[j].handicap;
                    var ventajaHoyo = this.partido.campo.ventajas[hIndex].value;
                    var diferenciaIJ = (handicapI - handicapJ);
                    var diferenciaJI = (handicapJ - handicapI);

                    if (diferenciaIJ >= ventajaHoyo) {
                        if (diferenciaIJ > 18) {
                            vents = 1;

                            while (diferenciaIJ - 18 >= ventajaHoyo) {
                                vents++;
                                diferenciaIJ -= 18;
                            }

                            golpesI -= vents;
                        } else {
                            golpesI--;
                        }
                    } else if (diferenciaJI >= ventajaHoyo) {
                        if (diferenciaJI > 18) {

                            vents = 1;
                            while (diferenciaJI - 18 >= ventajaHoyo) {
                                vents++;
                                diferenciaJI -= 18;
                            }

                            golpesJ -= vents;
                        } else {
                            golpesJ--;
                        }
                    }

                    if (golpesI >= golpesJ) {
                        llevaPataJugadorI = false;
                        break;
                    }
                }
            }

            if (llevaPataJugadorI) {
                jugadorPataActual = i;
                break;
            }
        }


        // Alguien es candidato a pata
        if (jugadorPataActual != -1) {
            // console.log('[hoyo ' + (hIndex + 1) + '] -> Candidato a pata: '
            //     + jugadorPataActual);
            // Hoyos del 2 al 18
            if (hIndex > 0) {
                // Alguien llevaba pata en el hoyo anterior
                if (jugadorPataAnterior != -1) {
                    // console.log('[hoyo ' + (hIndex + 1) + '] -> Había pata' +
                    //     ' en el hoyo anterior');
                    // Hizo dos patas seguidas
                    if (jugadorPataAnterior == jugadorPataActual) {
                        // console.log('[hoyo ' + (hIndex + 1) + '] -> El' +
                        //     ' jugador ' + jugadorPataActual + ' hizo patas' +
                        //     ' seguidas');
                        this.actualizarStatus(jugadorPataActual, hIndex, 1);
                    }
                    // Alguien le quitó la pata
                    else {
                        // console.log('[hoyo ' + (hIndex + 1) + '] -> El' +
                        //     ' jugador ' + jugadorPataActual + ' le quitó' +
                        //     ' pata al jugador ' + jugadorPataAnterior);
                        this.actualizarStatus(jugadorPataAnterior, hIndex, -1);
                    }
                }
                // Nadie llevaba pata en el hoyo anterior
                else {
                    // console.log('[hoyo ' + (hIndex + 1) + '] -> No había pata' +
                    //     ' en el hoyo anterior');
                    this.actualizarStatus(jugadorPataActual, hIndex, 1);
                }
            }
            // Hoyo 1
            else {
                this.actualizarStatus(jugadorPataActual, hIndex, 1);
            }
        }
        // Nadie es candidato a pata
        else {
            // console.log('[hoyo ' + (hIndex + 1) + '] -> No hubo candidato a' +
            //     ' pata');
            // Hoyos 2 al 18
            if (hIndex > 0) {
                // Hubo pata en el hoyo anterior
                if (jugadorPataAnterior != -1) {
                    // console.log('[hoyo ' + (hIndex + 1) + '] -> Había pata' +
                    //     ' en el hoyo anterior');

                    var pataQuitada = false;

                    // Se recorren los jugadores para ver si se quitará la
                    // pata aunque nadie sea candidato a ganarla
                    for (i = 0; i < playersNumber; i++) {
                        // Se valida que el jugador actual no sea el mismo
                        // que el que hizo la pata en el hoyo anterior
                        if (i != jugadorPataAnterior) {
                            golpesI = this.partido.scoreBoard[i].golpes[hIndex];
                            golpesJ = this.partido
                                .scoreBoard[jugadorPataAnterior].golpes[hIndex];
                            handicapI = this.partido.jugadores[i].handicap;
                            handicapJ = this.partido
                                .jugadores[jugadorPataAnterior].handicap;
                            ventajaHoyo = this.partido.campo.ventajas[hIndex]
                                .value;
                            diferenciaIJ = (handicapI - handicapJ);
                            diferenciaJI = (handicapJ - handicapI);

                            if (diferenciaIJ >= ventajaHoyo) {
                                if (diferenciaIJ > 18) {
                                    vents = 1;

                                    while (diferenciaIJ - 18 >= ventajaHoyo) {
                                        vents++;
                                        diferenciaIJ -= 18;
                                    }

                                    golpesI -= vents;
                                } else {
                                    golpesI--;
                                }
                            } else if (diferenciaJI >= ventajaHoyo) {
                                if (diferenciaJI > 18) {
                                    vents = 1;

                                    while (diferenciaJI - 18 >= ventajaHoyo) {
                                        vents++;
                                        diferenciaJI -= 18;
                                    }

                                    golpesJ -= vents;
                                } else {
                                    golpesJ--;
                                }
                            }

                            if (golpesI < golpesJ) {
                                this.actualizarStatus(jugadorPataAnterior,
                                    hIndex, -1);
                                pataQuitada = true;
                                break;
                            }
                        }
                    }

                    if (!pataQuitada) {
                        for (i = 0; i < playersNumber; i++) {
                            this.actualizarStatus(i, hIndex, 0);
                        }
                    }
                }
            }
        }
    };

    this.actualizarStatus = function (jugadorIndex, hoyoIndex, aumentoPatas) {
        var patas = 0;
        var conejas = 0;

        if (hoyoIndex > 0) {
            patas = this.scoreConeja[jugadorIndex].patas[hoyoIndex - 1]
                + aumentoPatas;
        } else {
            patas = aumentoPatas;
        }

        // console.log('< [hoyo ' + (hoyoIndex + 1) + '] -> Patas: '
        //     + patas + ', Conejas: ' + conejas );

        if (patas) {
            if (hoyoIndex == 5) {
                conejas = 1;
                patas = 0;
                hayConeja1a6 = true;
            } else if (hoyoIndex == 11) {
                if (!hayConeja1a6) {
                    conejas = 2;
                    hayConeja1a6 = true;
                } else {
                    conejas = 1;
                }
                patas = 0;
                hayConeja7a12 = true;
            } else if (hoyoIndex == 17) {
                if (!hayConeja1a6) {
                    conejas = 3;
                    hayConeja1a6 = true;
                } else if (!hayConeja7a12) {
                    conejas = 2;
                } else {
                    conejas = 1;
                }
                hayConeja7a12 = true;
                patas = 0;
            } else if ((hoyoIndex > 5 && hoyoIndex < 11) && !hayConeja1a6) {
                conejas = 1;
                patas = 1;
                hayConeja1a6 = true;
            } else if ((hoyoIndex > 11 && hoyoIndex < 17)) {
                if (!hayConeja1a6) {
                    conejas = 2;
                    patas = 1;
                    hayConeja1a6 = true;
                    hayConeja7a12 = true;
                } else if (!hayConeja7a12) {
                    conejas = 1;
                    patas = 1;
                    hayConeja7a12 = true;
                }
            }
        }

        this.scoreConeja[jugadorIndex].patas[hoyoIndex] = patas;

        if (!patas && !conejas) {
            this.scoreConeja[jugadorIndex].status[hoyoIndex] = '.';
        } else if (conejas == 1) {
            this.scoreConeja[jugadorIndex].status[hoyoIndex] = 'R'
        } else if (conejas > 1) {
            this.scoreConeja[jugadorIndex].status[hoyoIndex]
                = conejas.toString() + 'R';
        } else {
            this.scoreConeja[jugadorIndex].status[hoyoIndex] = patas.toString();
        }

        this.scoreConeja[jugadorIndex].conejas[hoyoIndex] = conejas;

        // console.log('> [hoyo ' + (hoyoIndex + 1) + '] -> Patas: '
        //     + this.scoreConeja[jugadorIndex].patas[hoyoIndex] + ', Conejas: '
        //     + this.scoreConeja[jugadorIndex].conejas[hoyoIndex]);
    };

    this.createScoreboard = function () {
        this.scoreConeja = [];

        for (var i = 0; i < playersNumber; i++) {
            this.scoreConeja.push({status: [], patas: [], conejas: []});
            for (var j = 0; j < 18; j++) {
                this.scoreConeja[i].status.push('.');
                this.scoreConeja[i].patas.push(0);
                this.scoreConeja[i].conejas.push(0);
            }
        }
    };

    this.createScoreboard();
}
