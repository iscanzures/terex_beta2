var groun, groundImage, invibleGround;
var trex, trex_running, trex_collide, trex_down;
var edges;
var tero, tero_fly;
var cloud, cloudImage;
var cloud, cloudImage,  obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var gameState="START"; 
var gameOver, restart, gameOverImg, restartImg;
var teroGroup;
var dn = 1;
var luna, lunaImg;
function preload(){
 trex_running =        loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collide = loadAnimation("trex_collided.png");
  trex_down = loadAnimation("trex_down1.png","trex_down2.png");
  tero_fly =        loadAnimation("tero1.png","tero2.png");
 groundImage = loadImage("ground2.png");
cloudImage = loadImage("cloud.png");
   obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  lunaImg = loadImage("luna.png");
}

function setup() {
  createCanvas(windowWidth, 200);
   //grupos
  cloudGroup = new Group();
  obsGroup = new Group();
  teroGroup = new Group();
  //create a trex sprite
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
   trex.setCollider("circle", 0,0,40);
  trex.addAnimation("collided",trex_collide);
   trex.addAnimation("down",trex_down);
  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50
  //tero
 
   luna = createSprite(width+50,120,20,20);
    luna.addImage(lunaImg);
  luna.scale=0.04;
  //ground
  ground = createSprite(width,180,width,20);
  //comentario para probar el cambio
  ground.addImage(groundImage);
  groundInvisible = createSprite(200,193,400,10);
  groundInvisible.visible = false;
  //ground.velocityX = -3;
  //edges
  edges=createEdgeSprites();
  score =0;
  
  //restart & gameOver
   gameOver = createSprite(width/2,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  gameOver.visible=false;
  restart.visible=false;
}

function draw() {
  if(dn===1){
      background("#9b9b9b ");
     }
   if(dn===2){
      night();
     }
 
 // console.log(getFrameRate());
     fill("black");
    stroke("black");
    text("Score: "+score, width-100,80);
   
  
   //infinite World
  if(ground.x<0){
     ground.x = ground.width/2;
     }
  if((touches.length > 0 ||keyDown("space"))&&gameState==="START"){
     gameState="PLAY";
    touches = [];
     }
  
  if(gameState==="PLAY"){
      ground.velocityX=-(3+score/1000);
      score = score + Math.round((frameCount/100));
    console.log(frameCount);
        //tero
    if(frameCount%1000===0 ){
       
      tero();
    }
    
     if(frameCount%1500===0 ){
       dn=2;
    }
      //jumping the trex on space key press
      if((touches.length > 0 ||keyDown("space"))&& trex.y>=100) {
          trex.velocityY = -10;
        touches = [];
        }
      if(keyWentDown(DOWN_ARROW)){
          trex.changeAnimation("down",trex_down);
         trex.scale = 0.35;
         }
      if(keyWentUp(DOWN_ARROW)){
        
          trex.changeAnimation("running",trex_running);
         trex.scale = 0.5;
         }
      trex.velocityY = trex.velocityY + 0.8
  
        //call spawnsClouds
        spawnClouds();
        obstacles();
    
   
    
     if(trex.isTouching(obsGroup)||trex.isTouching(teroGroup)){
        gameState="END";
       
        }
  }
  
  if(gameState==="END"){
     ground.velocityX=0;
     trex.velocityY = 0;
    
    trex.changeAnimation("collided",trex_collide);
     obsGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
     obsGroup.setVelocityXEach(0);
     cloudGroup.setVelocityXEach(0);
    
     gameOver.visible = true;
    restart.visible = true;
   
     if(touches.length > 0 || mousePressedOver(restart)) {
        touches = [];
      reset();
    }
    
  }
    //console.log(frameCount/60);
     //stop trex from falling down 
  trex.collide(groundInvisible);
  drawSprites();
}

function reset(){
  trex.changeAnimation("running", trex_running)
  gameState = "PLAY";
  gameOver.visible = false;
  restart.visible = false;
  
  obsGroup.destroyEach();
  cloudGroup.destroyEach();
  score = 0;
}

function spawnClouds(){
  if(frameCount%60===0){
    cloud = createSprite(width,10,40,10);
    cloud.addImage(cloudImage);
   // console.log(random(10,60));
    cloud.y = Math.round(random(10,60));
    cloud.scale= 0.7;
    cloud.velocityX = -3;
    //Ajuste profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime=300;
    cloudGroup.add(cloud);
  }
 
}

function obstacles(){
  if (frameCount % 120 === 0) {
    obstacle = createSprite(width,165,10,40);
   obstacle.velocityX = -(3+score/1000);
    //obstacle.velocityX = -(6+score/100); 
    var rand = Math.round(random(1,6));
    //console.log(rand);
    switch(rand){
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default: 
        break;
    }
    //scale & lifetime
    obstacle.scale=0.5;
    obstacle.lifetime=300; 
    
    //add Group
   obsGroup.add(obstacle);
    }
}

function tero(){
  //sacar estos aleatorios
  var tero = createSprite(width,0,20,50);
  tero.addAnimation("fly", tero_fly);
  tero.scale=1.3;
  tero.velocityX=-2.3;
  tero.velocityY=0.4;
  teroGroup.add(tero);
}

function night(){
    background("black");
   
    luna.velocityX=-3;
    luna.velocityY=-1;
    if(luna.x<width/2){
       luna.velocityY=0.5;
       }
    if(luna.x<0){
       dn=1;
      luna.x=width;
      luna.velocityX=0;
      luna.velocityY=0;
       }
}