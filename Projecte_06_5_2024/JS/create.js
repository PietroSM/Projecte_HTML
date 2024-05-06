function createWorld(){
    map = this.make.tilemap({key: "map"});

    let scale_2 =1.75*(Math.max(screenWidth/map.widthInPixels, screenHeight/map.heightInPixels));
    worldWidth = map.widthInPixels * scale_2;
    worldHeight = map.heightInPixels * scale_2;

    console.log(scale_2);


    let tileset = map.addTilesetImage("tilemap","tiles");



    let belowLayer = map.createLayer("Piso", tileset, 0, 0).setScale(scale_2).setDepth(1);
    this.pared = map.createLayer("Pared", tileset, 0, 0).setScale(scale_2).setDepth(2);

    
    this.pared.setCollisionByProperty({ colision: true });

    emptyTiles = this.pared.filterTiles(tile => (tile.index === -1 || !tile.collides));
}



function createAnimations() {
    const anims = this.anims;
    // Player
    anims.create({
        key: "left", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('personatge', { start: 9, end: 11 }),
    });
    anims.create({
        key: "right", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('personatge', { start: 3, end: 5 }),
    });
    anims.create({
        key: "up", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('personatge', { start: 0, end: 2 }),
    });
    anims.create({
        key: "down", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('personatge', { start: 6, end: 8 }),
    });
    anims.create({
        key: "waiting", frameRate: 3, repeat: -1,
        frames: this.anims.generateFrameNumbers('personatge', { start: 7, end: 7 }),
    });
}



function createPLayer(){

    const spawnPoint = map.findObject("spawn", obj => obj.name == "spawn");


    map = this.make.tilemap({key: "map"});

    let scale_2 =1.75*(Math.max(screenWidth/map.widthInPixels, screenHeight/map.heightInPixels));



    console.log(spawnPoint.x * this.scale);

    //To-do, arreglar lo del spawn point
    this.player = this.physics.add.sprite(spawnPoint.x * scale_2, spawnPoint.y * scale_2, "personatge").setSize(16, 32)
    .setOffset(24, 32).setCollideWorldBounds(true).setDepth(2).setScale(scale_2*0.75);
    
    //this.player.setPosition(spawnPoint.x, spawnPoint.y);

    this.physics.add.collider(this.player, this.pared);

    //seguir a la persona
    const camera = this.cameras.main;
    const world = this.physics.world;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, worldWidth, worldHeight);
    world.setBounds(0, 0, worldWidth, worldHeight);


    //cursors = this.input.keyboard.createCursorKeys();
    this.cursors = this.input.keyboard.createCursorKeys();
}

function createEnemic(){


    map = this.make.tilemap({key: "map"});

    let scale_2 =1.75*(Math.max(screenWidth/map.widthInPixels, screenHeight/map.heightInPixels));

    let areaGenerarEnemic = new Phaser.Geom.Rectangle(100*scale_2, 100*scale_2, 
        500*scale_2, 500*scale_2);

// Crear un grupo para los goblins
    this.enemicGroup = this.physics.add.group();

    for (let i = 0; i < 10; i++) {
        let x = Phaser.Math.Between(areaGenerarEnemic.x, areaGenerarEnemic.right);
        let y = Phaser.Math.Between(areaGenerarEnemic.y, areaGenerarEnemic.bottom);

        // Afegir fisiques
        console.log("creat");
        let enemic = this.enemicGroup.create(x, y, 'goblin').setDepth(2).setScale(scale_2 * 0.75);
        this.physics.add.collider(enemic, this.pared);
        this.physics.add.collider(enemic, this.player);
    }

}

function createAnimationsEnemic() {
    const anims = this.anims;
    // Enemic
    anims.create({
        key: "left", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('goblin', { start: 34, end: 41 }),
    });
    anims.create({
        key: "right", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('goblin', { start: 11, end: 18 }),
    });
    anims.create({
        key: "up", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('goblin', { start: 22, end: 29 }),
    });
    anims.create({
        key: "down", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('goblin', { start: 0, end: 7 }),
    });
    anims.create({
        key: "waiting", frameRate: 3, repeat: -1,
        frames: this.anims.generateFrameNumbers('goblin', { start: 6, end: 6 }),
    });
}



function create(){
    createWorld.call(this);
    createAnimations.call(this);
    createPLayer.call(this);
    createAnimationsEnemic.call(this);
    createEnemic.call(this);

}
