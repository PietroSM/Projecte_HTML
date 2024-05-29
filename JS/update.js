/**
 * Funcion para controlar el movimiento del player
 */
function movimientoPlayer(){
    let vX = 0, vY = 0;

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-400);
        this.player.anims.play('left', true);
        this.direccionPlayer = 'left';
        vX = -400;
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(400);
        this.player.anims.play('right', true);
        this.direccionPlayer = 'right';
        vX = 400;
    } else {
        this.player.setVelocityX(0);
        this.player.anims.play('waiting', true);
    }

    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-400);
        this.player.anims.play('up', true);
        this.direccionPlayer = 'up';
        vY = -400;
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(400);
        this.player.anims.play('down', true);
        this.direccionPlayer = 'down';
        vY = 400;
    } else {
        this.player.setVelocityY(0);
    }
}

/**
 * Funcion para posicionar el arma dependiendo donde este mirando el jugador
 */
function posicionmArma(){
    switch (this.direccionPlayer) {
        case 'left':
            this.arma.setPosition(this.player.x - 80, this.player.y);
            break;
        case 'right':
            this.arma.setPosition(this.player.x + 80, this.player.y);
            break;
        case 'up':
            this.arma.setPosition(this.player.x, this.player.y - 90);
            break;
        case 'down':
            this.arma.setPosition(this.player.x, this.player.y + 90);
            break;
    }
}

/**
 * Funcion oculta y muestra el arma
 */
function mostrarOcultarArma(){
    if (this.cursors.space.isDown) {
        this.arma.visible = true;
    } else {
        this.arma.visible = false;
    }
}

/**
 * Funcion que controla el movimiento de los goblins
 */
function movimientoGoblin(){
    const velocidadGoblin = 50;

    this.enemicGroup.children.iterate((enemic) => {
        const dx = this.player.x - enemic.x;
        const dy = this.player.y - enemic.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > 0) {
            const directionX = dx / length;
            const directionY = dy / length;
            enemic.setVelocity(directionX * velocidadGoblin, directionY * velocidadGoblin);

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) {
                    enemic.anims.play('rightG', true);
                } else {
                    enemic.anims.play('leftG', true);
                }
            } else {
                if (dy > 0) {
                    enemic.anims.play('downG', true);
                } else {
                    enemic.anims.play('upG', true);
                }
            }
        }
    });
}

function update() {
    // Movimiento del jugador
    movimientoPlayer.call(this);

    //Actualitzar posicionm arma
    posicionmArma.call(this);

    // Detectar colisiones entre el arma y los goblins
    this.physics.add.overlap(this.arma, this.enemicGroup, golpearGoblin, null, this);

    // Mostrar/ocultar el arma
    mostrarOcultarArma.call(this);

    // Movimiento de los goblins
    movimientoGoblin.call(this);

    //reducción de vida si son golpeados por el jugador
    this.physics.add.collider(this.player, this.enemicGroup, golpearJugador, null, this);

    //Actualizar barra de vida de los goblins
    this.enemicGroup.children.iterate(function (enemic) {
        if (enemic && enemic.healthBar) {
            updateEnemyHealthBar(enemic);
        }
    });

}

/**
 * Funcion para bajar la vida i elimianr un golbin al pegarle con el arma
 */
function golpearGoblin(arma, goblin) {
    if (this.arma.visible) {
        // Reducir la vida del goblin al golpearlo con el arma
        goblin.vida -= 10;
        console.log(goblin.vida);
        if (goblin.vida <= 0) {
            // Si la vida del goblin llega a cero o menos, eliminarloS
            goblin.destroy();
            goblin.healthBar.destroy();
        }else{
            updateEnemyHealthBar(enemic);    
        }
        this.arma.visible = false;
    }
}

/**
 * Funcion para bajar la vida del jugador cuandole golpea un goblin
 */
function golpearJugador(player, goblin){

    if(this.player.isImmortal) return;
    player.vida -= 10;
    console.log('Vida del jugador',player.vida);
    
    this.textoVida.setText('Vida: ' + player.vida);

    this.player.setTint(0xff0000);
    this.player.isImmortal = true; 

    //3 segundos de inmortalidad
    this.time.delayedCall(3000, () => {
        this.player.isImmortal = false;
        this.player.clearTint();
    }, [], this);

    //si la vida baja a 0, sale pantalla de game over
    if(player.vida <= 0){
        player.setTint(0xff0000);
        player.setVelocity(0, 0);
        player.vida = 0;
        this.physics.pause();  // Pausar la física del juego
        player.anims.stop();  // Detener las animaciones del jugador

        this.textoFinal.setVisible(true);
        this.boton_reiniciar.setVisible(true);
    }


}
