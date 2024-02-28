//Створили конфігурацію гри
var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: game,
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
}

function create() {
  //this.add.image(0, 0, 'fon').setOrigin(0,0);
  //this.add.image(0, 0, "fon").setOrigin(0, 0);
  this.add.tileSprite(0, 0, worldWight, 1000, "fon").setOrigin(0, 0);

  //
  platforms = this.physics.add.staticGroup();

  for (var x = 0; x < worldWight; x = x + 450) {
    console.log(x);
    platforms
      .create(x, 1080 - 128, "platform")
      .setOrigin(0, 0)
      .refreshBody();
  }

  // 
  player = this.physics.add.sprite(1000, 600, "dude");
  player.setBounce(0, 2);
  player.setColliderWorldBounds(false);

  this.physics.add.collider(player, platforms);

  //   //
  //   this.camera.main.setBounds(0, 0, worldWight, 1080);
  //   this.physics.world.setBounds(0, 0, worldWight, 1080);
  //   this.camera.maim.startFollow(player);
}

function update() {}
