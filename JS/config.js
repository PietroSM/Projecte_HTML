const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


let belowLayer, pared,direccionPlayer;

let player, map, inputKeys,scale = 1.75, cursors, enemic,enemicGroup,arma;
let textoFinal,boton_reiniciar, healthBar;
let joyStick = joyStick2 = { up: false, down: false, left: false, right: false };
const game = new Phaser.Game(config);
