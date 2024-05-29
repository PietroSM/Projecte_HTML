/**
 * Funcion compartida que va actualizando la bara de vida de los enemigos
 */
window.updateEnemyHealthBar = function(enemic) {
    if (!enemic || !enemic.healthBar) return;

    const barWidth = 50;
    const barHeight = 5;
    const barOffsetY = 80;

    // Borrar el gráfico anterior
    enemic.healthBar.clear();

    // Fondo de la barra
    enemic.healthBar.fillStyle(0x000000, 1);
    enemic.healthBar.fillRect(enemic.x - barWidth / 2, 
        enemic.y - barOffsetY, barWidth, barHeight);

    // Parte verde de la barra de vida
    enemic.healthBar.fillStyle(0x00ff00, 1);
    enemic.healthBar.fillRect(enemic.x - barWidth / 2, 
        enemic.y - barOffsetY, barWidth * (enemic.vida / enemic.maxVida), barHeight);
};

/**
 * Funcion para crear el mundo, donde cargamos las diferentes capas de mapa
 * y asignamos que las paredes tienen colision
 */
function createWorld(){

    //Obtenemos el mapa
    map = this.make.tilemap({key: "map"});

    //Asignamos el tamanyo de la pantalla
    let scale_2 =1.75*(Math.max(screenWidth/map.widthInPixels, 
        screenHeight/map.heightInPixels));
    worldWidth = map.widthInPixels * scale_2;
    worldHeight = map.heightInPixels * scale_2;

    //Cargarmos el tileset del mapa
    let tileset = map.addTilesetImage("tilemap","tiles");

    //cargamos las capas del mapa
    this.belowLayer = map.createLayer("Piso", tileset, 0, 0)
        .setScale(scale_2).setDepth(1);
    this.pared = map.createLayer("Pared", tileset, 0, 0)
        .setScale(scale_2).setDepth(2);

    //Asignamos la colission con los pixeles que estan en true en el tilemap
    this.pared.setCollisionByProperty({ colision: true });
    emptyTiles = this.pared
        .filterTiles(tile => (tile.index === -1 || !tile.collides));
}

/**
 * Funcion para asginar el movimiento al player
 */
function createAnimations() {
    const anims = this.anims;

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

/**
 * Funcion que crea el player en el mapa
 */
function createPLayer(){

    //Definimos donde aparecera el player al iniciar el juego
    const spawnPoint = map.findObject("spawn", obj => obj.name == "spawn");


    //Obtenemos la escala para el player
    map = this.make.tilemap({key: "map"});
    let scale_2 =1.75*(Math.max(screenWidth/map.widthInPixels, 
        screenHeight/map.heightInPixels));

    //Generamos el jugador con unas dimensiones y unas colisiones.
    this.player = this.physics.add
        .sprite(spawnPoint.x * scale_2, spawnPoint.y * scale_2, "personatge")
        .setSize(33, 55).setOffset(8, 8).setCollideWorldBounds(true).setDepth(2)
        .setScale(scale_2*0.75);
    
    //Asignamos vida al player y un atributo booleano diciendo si es inmortal
    this.player.vida = 100;
    this.player.isImmortal = false; 

    //Damos collision al player con la pared
    this.physics.add.collider(this.player, this.pared);

    //asignamos una camara que siga al player
    const camera = this.cameras.main;
    const world = this.physics.world;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, worldWidth, worldHeight);
    world.setBounds(0, 0, worldWidth, worldHeight);

    //Asignamos el movimiento del player con las flechas
    this.cursors = this.input.keyboard.createCursorKeys();
}

/**
 * Funcion que crea un array de enemigos goblin
 */
function createEnemigo(){

    //Definimos la escala de los enemigos
    map = this.make.tilemap({key: "map"});
    let scale_2 =1.75*(Math.max(screenWidth/map.widthInPixels, screenHeight/map.heightInPixels));

    //Definimos una zona donde pueden aparecer los enemigos
    let areaGenerarEnemic = new Phaser.Geom.Rectangle(100*scale_2, 100*scale_2, 
        500*scale_2, 500*scale_2);

    //Creamos un grupo de enemigos
    this.enemicGroup = this.physics.add.group();

    //Generamos 20 enemigos y los vamos guardando en el grupo
    for (let i = 0; i < 20; i++) {

        //Coordenadas aleatorias donde van a aparecer
        let x = Phaser.Math.Between(areaGenerarEnemic.x, areaGenerarEnemic.right);
        let y = Phaser.Math.Between(areaGenerarEnemic.y, areaGenerarEnemic.bottom);

        //Creamos el enemigo
        let enemic = this.enemicGroup.create(x, y, 'goblin').setDepth(2)
            .setScale(scale_2 * 0.75).setSize(40, 60);

        //Atributos de vida y vida maxima
        enemic.vida = 1000;
        enemic.maxVida = 1000;

        //Definimos las colissiones del goblin
        this.physics.add.collider(enemic, this.pared);
        this.physics.add.collider(enemic, this.player);

        //collisionen entre ellos
        this.physics.add.collider(enemic, this.enemicGroup);

        //Le asignamos una barra de vida
        enemic.healthBar = this.add.graphics().setDepth(10);
        updateEnemyHealthBar(enemic);

    }
    //Definimos que tengan colision con la pared
    this.physics.add.collider(this.enemicGroup, this.pared);
}

/**
 * Funcion para asginar el movimeinto del los enemigos goblin
 */
function createAnimationsEnemic() {
    const anims = this.anims;
    anims.create({
        key: "leftG", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('goblin', { start: 34, end: 41 }),
    });
    anims.create({
        key: "rightG", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('goblin', { start: 11, end: 18 }),
    });
    anims.create({
        key: "upG", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('goblin', { start: 22, end: 29 }),
    });
    anims.create({
        key: "downG", frameRate: 10, repeat: -1,
        frames: this.anims.generateFrameNumbers('goblin', { start: 0, end: 7 }),
    });
    anims.create({
        key: "waitingG", frameRate: 3, repeat: -1,
        frames: this.anims.generateFrameNumbers('goblin', { start: 6, end: 6 }),
    });
}

/**
 * Funcion para definir la arma del player
 */
function createArma(){

    //Tamanyo del arma
    let scale_2 =1.75*(Math.max(screenWidth/map.widthInPixels, 
        screenHeight/map.heightInPixels));

    //Asignamos la arma al lado del player
    this.arma = this.physics.add.image(this.player.x + 30, this.player.y, 'arma')
        .setScale(scale_2).setDepth(2);

    //Definimos que cuando se presione el espacio, aparezca el arma
    this.input.keyboard.on('keydown-SPACE', function () {
        this.arma.visible = true;
    }, this);
    this.input.keyboard.on('keyup-SPACE', function () {
        this.arma.visible = false;
    }, this);
}

/**
 * Funcion que crea el boton de reinicio
 */
function crearBotonReinicio(){

    //Tamanyo del boton
    let scale_2 =1.75*(Math.max(screenWidth/map.widthInPixels, 
    screenHeight/map.heightInPixels));

    //creamos el bootn
    this.boton_reiniciar = this.add.image(this.cameras.main.width / 2, 
        this.cameras.main.height / 2 + 300, 'botonReiniciar')
        .setScale(scale_2 * 0.10).setScrollFactor(0).setDepth(11).setVisible(false)
        .setInteractive();

    //Anyadimos funcion al boton, que cuando se presione, se reinicie la escena
    this.boton_reiniciar.once('pointerdown', () => {
        this.scene.restart();
    });
}

/**
 * Funcion para crear el texto con la vida del player
 */
function createVidaPlayer(){
    this.textoVida = this.add.text(16, 16, 'Vida: 100', 
        { fontSize: '32px', fill: '#fff' });
    this.textoVida.setScrollFactor(0);
    this.textoVida.setDepth(10);
}

/**
 * Funcion para crear la imagen de game Oover
 */
function createImagenGameOver(){
    this.textoFinal = this.add.image(this.cameras.main.width / 2, 
        this.cameras.main.height / 3, 'gameOver');

    this.textoFinal.setScrollFactor(0);
    this.textoFinal.setDepth(10);
    this.textoFinal.setVisible(false);
}


function create(){
    createWorld.call(this);
    createAnimations.call(this);
    createPLayer.call(this);
    createAnimationsEnemic.call(this);
    
    createEnemigo.call(this);
    createArma.call(this);
    crearBotonReinicio.call(this);
    
    createVidaPlayer.call(this);
    createImagenGameOver.call(this);
}
