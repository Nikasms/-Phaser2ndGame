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

var enemy;
var enemyCount = 3;
var enemyText;
var score = 0;
var playerSpeed = 1000;
var scoreText;
var gameOver = false;
var stars;
var bombs;
var cursors;
var lifeText;
var player;
var life = 5;
var game = new Phaser.Game(config);
var worldWight = config.width * 5;

function preload() {
  //завантажили асети

  this.load.image("fon", "assets/fon.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.image("platform", "assets/platform.png");
  this.load.image("stone", "assets/stone.png");
  this.load.image("bush", "assets/bush.png");
  this.load.image("sigh", "assets/sigh.png");
  this.load.image("13", "assets/13.png");
  this.load.image("14", "assets/14.png");
  this.load.image("15", "assets/15.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.image("star", "assets/star.png");
  this.load.image("enemy","assets/skeleton.png");


}

function create() {
   // створено фон плиткою

  this.add.tileSprite(0, 0, worldWight, 1080, "fon")
  .setOrigin(0, 0)
  .setScale(1)
  .setDepth(0);
 
  //додаємо платформи
  platforms = this.physics.add.staticGroup();

  // додємо землю на всю ширину
  for (var x = 0; x < worldWight; x = x + 400) {
    //console.log(x);

    platforms
      .create(x, 1080 - 100, "platform")
      .setOrigin(0, 0)
      .refreshBody();
  }

  // розміщення об'єктів по розмірах
  objects = this.physics.add.staticGroup();

  for (var x = 0; x <= worldWight; x = x + Phaser.Math.Between(400, 500)) {
    objects
      .create((x = x + Phaser.Math.Between(200, 500)), 980, "sigh")
      .setScale(Phaser.Math.FloatBetween(0.5, 2))
      .setDepth(Phaser.Math.Between(0, 2))
      .setOrigin(0, 1)
      .refreshBody();
    objects
      .create((x = x + Phaser.Math.Between(200, 600)), 980, "stone")
      .setScale(Phaser.Math.FloatBetween(0.5, 2))
      .setDepth(Phaser.Math.Between(0, 2))
      .setOrigin(0, 1)
      .refreshBody();
    objects
      .create((x = x + Phaser.Math.Between(300, 700)), 980, "bush")
      .setScale(Phaser.Math.FloatBetween(0.5, 2))
      .setDepth(Phaser.Math.Between(0, 2))
      .setOrigin(0, 1)
      .refreshBody();
  }

 
  //літаючі платфоми
  for (var x = 0; x < worldWight; x = x + Phaser.Math.Between(256, 600)) {
    var y = Phaser.Math.Between(200, 950);
    platforms.create(x, y, "13");
    var i;
    for (i = 1; i <= Phaser.Math.Between(1, 4); i++) {
      platforms.create(x + 128 * i, y, "14");
    }
    platforms.create(x + 128 * i, y, "15");
  }
  

  //Додаємо рахунок
  scoreText = this.add.text(100, 100, "Score: 0", {
    fontSize: "36px",
    fill: "#FFF",
  });
  scoreText.setOrigin(0, 0).setDepth(10).setScrollFactor(0);

  //Додаємо життя
  lifeText = this.add.text(1600, 80, showLife(), {
    fontSize: "35px",
    fill: "#FFF",
  });
  lifeText.setOrigin(0, 0).setDepth(10).setScrollFactor(0);

  //Кнопка перезапуску гри
  var resetButton = this.add
    .text(100, 50, "reset", { fontSize: "40px", fill: "#ccc" })
    .setInteractive()
    .setScrollFactor(0);
    
  resetButton.on("pointerdown", function () {
    console.log("restart");
    refreshBody();
  });

  
  


  //Додали зірочки
  stars = this.physics.add.group({
    key: "star",
    repeat: 111,
    setXY: { x: 12, y: 0, stepX: 90 },
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // додали бомбочки
    bombs = this.physics.add.group({
    key: "bomb",
    repeat: 15,
    setXY: { x: 0, y: 0, stepX: 250 },
  });
  bombs.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.5));
  });

   
  //Зіткнення зірочок з платформою
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);

 

  // додали курсор
  cursors = this.input.keyboard.createCursorKeys();

  // створюємо гравця
  player = this.physics.add.sprite(1500, 600, "dude");
  player.setBounce(0.4);
  player.setCollideWorldBounds(false);
 // player.setDepth(Phaser.Math.Between(2));

 this.physics.add.collider(player, bombs, hitBomb , null, this);
 this.physics.add.overlap(player, stars, collectStar, null, this);

  // колізія гравця з платформою
  this.physics.add.collider(player, platforms);

  // налаштування камери
  this.cameras.main.setBounds(0, 0, worldWight, 1080);
  this.physics.world.setBounds(0, 0, worldWight, 1080);

  //слідування камери за гравцем
  this.cameras.main.startFollow(player);

  


  

  

  // ходіння гравця в різні сторони

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  
}

function update() {

// керування
if (cursors.left.isDown) {
  player.setVelocityX(-playerSpeed);

  player.anims.play('left', true);
}
else if (cursors.right.isDown) {
  player.setVelocityX(playerSpeed);

  player.anims.play('right', true);
}
else {
  player.setVelocityX(0);

  player.anims.play('turn');
}

if (cursors.up.isDown && player.body.touching.down) {
  player.setVelocityY(-530);
}


}

//Додали збираня зірок
function collectStar(player, star) {
  star.disableBody(true, true);
  score += 10;
  scoreText.setText("Score: " + score);

  var x = Phaser.Math.Between(0, config.width);
  var y = Phaser.Math.Between(0, config.height);
  var bomb = bombs.create(x, y, "bomb");
  bomb.setScale(1);
  bomb.setBounce(1);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
  }
}
//Колізія гравця і бомб
var isHitByBomb = false;

function hitBomb(player, bomb) {
  if (isHitByBomb) {
    return;
  }
  isHitByBomb = true;

  life = life - 1;
  lifeText.setText(showLife());

  var direction = bomb.x < player.x ? 1 : -1;
  bomb.setVelocityX(300 * direction);

  player.setTint(0xff0000);

  this.time.addEvent({
    delay: 1000,
    callback: function () {
      player.clearTint();
      isHitByBomb = false;

      if (life === 0) {
        gameOver = true;
        this.physics.pause();
        player.anims.play("turn");
      }
    },
    callbackScope: this,
    loop: false,
  });
}

//Формування смуги життя
function showLife() {
  var lifeLine = "";

  for (var i = 0; i < life; i++) {
    lifeLine = lifeLine + "💖";
  }

  return lifeLine;
}

//перезапуск гри
  function refreshBody ()
  {
    console.log ('game over')
    location.reload()
  }

  // function showLife() {
  //   var lifeLine = "";
  
  //   for (var i = 0; i < life; i++) {
  //     lifeLine = lifeLine + "💖";
  //   }
  
  //   return lifeLine;
  // }