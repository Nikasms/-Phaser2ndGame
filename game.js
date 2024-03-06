//Створили конфігурацію гри
var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  //parent: game,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
var player;
var game = new Phaser.Game(config);
var worldWight = 9600;
function preload() {
  //завантажили ресурси

  this.load.image("fon", "assets/fon.jpg");

  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });

  this.load.image("platform", "assets/platform.png");
  // додали пеньок
  this.load.image("crate", "assets/crate.png");
  //додали грибок
  this.load.image("mushroom", "assets/mushroom.png");
  //додали знак
  this.load.image("sigh", "assets/sigh.png");
  this.load.image("13", "assets/13.png");
  this.load.image("14", "assets/14.png");
  this.load.image("15", "assets/15.png");
  
}

function create() {
  //this.add.image(0, 0, 'fon').setOrigin(0,0);
  //this.add.image(0, 0, "fon").setOrigin(0, 0);
  // створено фон плиткою
  this.add.tileSprite(0, 0, worldWight, 1000, "fon").setOrigin(0, 0);

  //додаємо платформи
  platforms = this.physics.add.staticGroup();
// додємо землю на всю ширину
  for (var x = 0; x < worldWight; x = x + 400) {
    console.log(x);
   
    platforms
      .create(x, 1080 - 128, "platform")
      .setOrigin(0, 0)
      .refreshBody();
  }


  objects = this.physics.add.staticGroup();
  for (var x = 0; x <= worldWight; x = x + Phaser.Math.Between(400, 500)) {
   objects
   .create(x = x + Phaser.Math.Between(300, 500), 960, 'sigh')
   .setScale(Phaser.Math.FloatBetween(0.5, 2))
   .setDepth(Phaser.Math.Between(0,2)) 
   .setOrigin(0, 1)
   .refreshBody();
    objects.create(x = x + Phaser.Math.Between(100, 600), 960, 'crate')
    .setScale(Phaser.Math.FloatBetween(0.5, 2))
    .setDepth(Phaser.Math.Between(0,2)) 
    .setOrigin(0, 1)
    .refreshBody();
    objects.create(x = x + Phaser.Math.Between(100, 700), 960, 'mushroom')
    .setScale(Phaser.Math.FloatBetween(0.5, 2))
    .setDepth(Phaser.Math.Between(0,2)) 
    .setOrigin(0, 1)
    .refreshBody();
    
  }

//літаючі платфоми
for (var x = 0; x < worldWight; x = x + Phaser.Math.Between(256, 500)){
  var y = Phaser.Math.Between(128, 970)
  platforms.create(x,y, '13')
  var i
  for (i = 1; i<=Phaser.Math.Between(1,3); i++){
    platforms.create(x + 128 * i, y ,  '14')
  }
  platforms.create(x + 128 * i,y, '15')
}








  

  // створюємо гравця
  player = this.physics.add.sprite(950, 600, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(false);

  this.physics.add.collider(player, platforms);
// налаштування камери
     this.cameras.main.setBounds(0, 0, worldWight, 1080);
    this.physics.world.setBounds(0, 0, worldWight, 1080);
    //слідування камери за гравцем
   this.cameras.main.startFollow(player);
// ходіння гравця в різні сторони
   
this.anims.create({
  key: 'left',
  frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
  frameRate: 10,
  repeat: -1
});

this.anims.create({
  key: 'turn',
  frames: [ { key: 'dude', frame: 4 } ],
  frameRate: 20
});

this.anims.create({
  key: 'right',
  frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
  frameRate: 10,
  repeat: -1
});
}

function update() { 
    cursors = this.input.keyboard.createCursorKeys();
    
  // рух гравця, в різні сторони
  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);
  
      player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);
  
      player.anims.play('right', true);
  }
  else
  {
      player.setVelocityX(0);
  
      player.anims.play('turn');
  }
  
  if (cursors.up.isDown && player.body.touching.down)
  {
      player.setVelocityY(-330);
  }

}
