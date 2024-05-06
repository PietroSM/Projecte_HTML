function update(){

    //console.log("update");
    let vX=0, vY=0;

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-400);
        this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(400);
        this.player.anims.play('right', true);
    } else{
        this.player.setVelocityX(0);
        this.player.anims.play('waiting', true);
    }

    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-400);
        this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(400);
        this.player.anims.play('down', true);
    }
    else{
        this.player.setVelocityY(0);
    }

}