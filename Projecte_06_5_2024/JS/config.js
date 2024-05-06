const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const config = {
    type: Phaser.CANVAS,
    width: screenWidth,
    height: screenHeight,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player, map, inputKeys,scale = 1.75, cursors,pared, enemic;
let joyStick = joyStick2 = { up: false, down: false, left: false, right: false };
const game = new Phaser.Game(config);
