function preload(){
    this.load.image("tiles", "assets/tilemap.png");
    this.load.tilemapTiledJSON('map', "assets/prova_2.json");


    this.load.spritesheet("personatge", "assets/sprite_walk.png", { 
        frameWidth: 48, frameHeight: 64 });

    /*this.load.spritesheet("player", "assets/lidia.png", { 
        frameWidth: 64, frameHeight: 64 });*/

    this.load.spritesheet("goblin", "assets/goblinsword.png",{
        frameWidth: 64, frameHeight: 64});
    

        this.load.plugin('rexvirtualjoystickplugin', 
        'https://cdn.jsdelivr.net/npm/phaser3-rex-plugins@1.1.39/dist/rexvirtualjoystickplugin.min.js', true);
}