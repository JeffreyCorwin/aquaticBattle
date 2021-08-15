const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var canvas, angle, KingOfSea, ground, cannon, fish;
var crabs = [];
var fishs = [];
var score = 0;
var fishAnimation = [];
var fishspritedata, fishspritesheet;
var merms = [];

var brokenfishAnimation = [];
var brokenfishspritedata, brokenfishspritesheet;

var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;

var bgMusic, shootMusic, splashMusic, laughMusic; 

var  c3;
var  coral3;

var muteButton, unmute;

var hand;

var isGameOver = false;

var isLaughing = false;

var glittery_star;

var canH, canW;



function preload() {
  backgroundImg = loadImage("./assets/bg1.jpg");

  fishspritedata = loadJSON("assets/lionFishEating/lionFishEating.json");
  fishspritesheet = loadImage("assets/lionFishEating/lionFishEating.png");

  brokenfishspritedata = loadJSON("assets/lionFishRun (1)/lionFishRun.json");
  brokenfishspritesheet = loadImage("assets/lionFishRun (1)/lionFishRun.png");

  

  bgMusic = loadSound("assets/BgMusic.mp3");
  shootMusic = loadSound("assets/CrabSound.mp3");
  splashMusic = loadSound("assets/CrabSound.mp3");
  laughMusic = loadSound("assets/pirate_laugh.mp3");

  
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth + 80, displayHeight);
  }else{
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth , windowHeight);
  }
  engine = Engine.create();
  world = engine.world;

  bgMusic.play();
  bgMusic.setVolume(0.1);
  angle = -PI / 4;
  ground = new Ground(0, canH - 1, canW * 2, 1);
  KingOfSea = new seaKing(180, 550, 300, 210);
  cannon = new Cannon(270, 500, 60, 20, angle);
  
  glittery_star = new star(230, 490, 90, 90);
  
 

  var fishFrames = fishspritedata.frames;
  for (var i = 0; i < fishFrames.length; i++) {
    var pos = fishFrames[i].position;
    var img = fishspritesheet.get(pos.x, pos.y, pos.w, pos.h);
    fishAnimation.push(img);
  }

  var brokenfishFrames = brokenfishspritedata.frames;
  for (var i = 0; i < brokenfishFrames.length; i++) {
    var pos = brokenfishFrames[i].position;
    var img = brokenfishspritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenfishAnimation.push(img);
  }

  unmute = createImg('assets/unmuteButton.png');
  unmute.position(1300, height/4);
  unmute.size(50, 50);
  unmute.mouseClicked(mute);
  

  

  rectMode(CENTER);
}

function draw() {
  background(189);

  

  image(backgroundImg, 0, 0, canW, canH);

  cannon.display();
  KingOfSea.display();
 

  
  
  
  ground.display();


 glittery_star.display();

  showfishs();

  

  for (var i = 0; i < crabs.length; i++) {
    showcrabs(crabs[i], i);
    for (var j = 0; j < fishs.length; j++) {
      if (crabs[i] !== undefined && fishs[j] !== undefined) {
        var collision = Matter.SAT.collides(crabs[i].body, fishs[j].body);
        if (collision.collided) {
          if (!fishs[j].isBroken && !crabs[i].isSink) {
            score += 5;
            fishs[j].remove(j);
            j--;
          }

          Matter.World.remove(world, crabs[i].body);
          crabs.splice(i, 1);
          i--;
        }
      }
    }
  }

  

  fill("#6d4c41");
  textSize(40);
  text(`Score:${score}`, canW - 200, 50);
  textAlign(CENTER, CENTER);

  Engine.update(engine);
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var crab1 = new crabCannon(cannon.x, cannon.y);
    crab1.trajectory = [];
    Matter.Body.setAngle(crab1.body, cannon.angle);
    crabs.push(crab1);
  }
}



  


function showcrabs(crab, index) {
  crab.display();
  crab.animate();
  if (crab.body.position.x >= canW || crab.body.position.y >= canH - 50) {
    if (!crab.isSink) {
      splashMusic.play();
      crab.remove(index);
    }
  }
}


function showfishs() {
  if (fishs.length > 0) {
    if (
      fishs.length < 4 &&
      fishs[fishs.length - 1].body.position.x < canW - 300
    ) {
      var positions = [-40, -60, -70, -120, -300, -250, -184, -540, 224, -455, 543];
      var position = random(positions);
      var fish = new Fish(
        canW,
        canH - 100,
        170,
        170,
        position,
        fishAnimation
      );

      fishs.push(fish);
    }

    for (var i = 0; i < fishs.length; i++) {
      Matter.Body.setVelocity(fishs[i].body, {
        x: -0.9,
        y: 0
      });

      fishs[i].display();
      fishs[i].animate();
      var collision = Matter.SAT.collides(KingOfSea.body, fishs[i].body);
      if (collision.collided && !fishs[i].isBroken) {
        if(!isLaughing && !laughMusic.isPlaying()){
          laughMusic.play();
          isLaughing = true;
        }
        isGameOver = true;       
        gameOver();
      }

     

    }
  } else {
    var fish = new Fish(canW, canH - 60, 170, 170, -60, fishAnimation);
    fishs.push(fish);
  }
}

function mute(){
  if(bgMusic.isPlaying()){
    bgMusic.stop();
  }else{
    bgMusic.play();
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW && !isGameOver) {
    shootMusic.play();
    shootMusic.setVolume(0.1);
    crabs[crabs.length - 1].shoot();
  }
}

function gameOver() {
  swal(
    {
      title: "Game Over!!!",
      text: "Thanks for playing!!",
      imageUrl:
        "https://raw.githubusercontent.com/JeffreyCorwin/fabricMC/main/lionFishEating-5.png.png",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}
