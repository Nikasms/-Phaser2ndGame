//Створили конфігурацію гри
var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: game,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{ //завантажили ресурси 

 this.load.image('fon', 'assets/fon.png');

}

function create ()
{
    this.add.image(0, 0, 'fon').setOrigin(0,0);

}


function update ()
{
    
}