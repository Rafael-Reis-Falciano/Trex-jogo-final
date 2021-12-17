var trex, trex_running, edges;
var groundImage;
var solo;
var invisivel;
var nuvem, nuvemImagem;
var pontos = 0;
var cacto, cactoImagem1, cactoImagem2, cactoImagem3, cactoImagem4, cactoImagem5, cactoImagem6;
var grupoCactos, grupoNuvens;
var JOGANDO = 1;
var FIM = 0;
var estadoJogo = JOGANDO;
var gameOver, gameOverImagem;
var reiniciar, reiniciarImagem;
var trexMortoImagem;
var somPulo, somMorte, somCheckpoint;


function preload()
{
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  nuvemImagem = loadImage("cloud.png");
  cactoImagem1 = loadImage("obstacle1.png");
  cactoImagem2 = loadImage("obstacle2.png");
  cactoImagem3 = loadImage("obstacle3.png");
  cactoImagem4 = loadImage("obstacle4.png");
  cactoImagem5 = loadImage("obstacle5.png");
  cactoImagem6 = loadImage("obstacle6.png");
  trexMortoImagem = loadAnimation("trex_collided.png");
  reiniciarImagem = loadImage("restart.png");
  gameOverImagem = loadImage("gameOver.png");
  somPulo = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somCheckpoint = loadSound("checkPoint.mp3");
}

function setup()
{
  createCanvas(windowWidth, windowHeight);

  //criando o trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("morreu", trexMortoImagem);
  edges = createEdgeSprites();

  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50;

  solo = createSprite (width/2, height-50, width + 50, 10);
  solo.addImage ("chão", groundImage);
  solo.x = solo.width/2;

  invisivel = createSprite (width/2, height-40, width + 50, 10);
  invisivel.visible = false;

  grupoCactos = new Group();
  grupoNuvens = new Group();

  trex.setCollider("circle", 0, 0, 40);
  trex.debug = false;

  gameOver = createSprite(width/2, height/2);
  reiniciar = createSprite(width/2, height/2 + 50);
  gameOver.addImage(gameOverImagem);
  reiniciar.addImage(reiniciarImagem);
  gameOver.scale = 1
  reiniciar.scale = 0.5
}


function draw()
{
  //definir a cor do plano de fundo 
  background("white");

  text (" pontos " + pontos, width - 120, height/4);

  if (estadoJogo == JOGANDO)
  {
    //registrando a posição y do trex
    console.log(trex.y)

    gameOver.visible = false
    reiniciar.visible = false

    pontos = pontos + Math.round(frameCount/60);

    //pular quando tecla de espaço for pressionada
    if((keyDown("space") || touches.length > 0) && trex.y >= height-73)
    {
      trex.velocityY = -8;
      somPulo.play();
      touches = [];
    }
  
    solo.velocityX = -10 - pontos/1000;
    trex.velocityY = trex.velocityY + 0.5;

    if (solo.x < 0)
    {
      solo.x = solo.width/2;
    }
  
    //chama a função das nuvens e cactos
    gerarNuvens();
    gerarCactos();
    
    //console.log (frameCount)

    if (grupoCactos.isTouching (trex))
    {
      estadoJogo = FIM;
      somMorte.play();
    }

    if (pontos % 500 == 0 && pontos > 0)
    {
      somCheckpoint.play();
    }

  }
  else if (estadoJogo == FIM)
  {
    solo.velocityX = 0;
    trex.velocityY = 0;
    grupoCactos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);
    trex.changeAnimation("morreu", trexMortoImagem)
    gameOver.visible = true
    reiniciar.visible = true
    if (mousePressedOver(reiniciar) || touches.lenght > 0)
    {
      console.log("reiniciar");
      reiniciando();
      touches = [];
    }
  }

  //impedir que o trex caia
  trex.collide(invisivel);

  drawSprites();
}

function gerarNuvens()
{
  if (frameCount % 30 == 0)
  {
    nuvem = createSprite (width+50, 50);
    grupoNuvens.add(nuvem);
    nuvem.velocityX = -10 - pontos/1000;
    nuvem.addImage (nuvemImagem);
    nuvem.scale = 1.3;

    nuvem.y = Math.round (random(height/3, height/4));

    //console.log(trex.depth);
    //console.log(nuvem.depth);

    trex.depth = nuvem.depth +1;

    nuvem.lifetime = 700
  }

}

function gerarCactos()
{
  if (frameCount % 50 == 0)
  {
    cacto = createSprite(width + 20, height - 70);
    cacto.velocityX = -10 - pontos/1000;

    var cactosPosicao = Math.round (random (1,6));

    switch (cactosPosicao)
    {
      case 1: cacto.addImage (cactoImagem1);
              break;
      case 2: cacto.addImage (cactoImagem2);
              break;
      case 3: cacto.addImage (cactoImagem3);
              break;
      case 4: cacto.addImage (cactoImagem4);
              break;
      case 5: cacto.addImage (cactoImagem5);
              break;
      case 6: cacto.addImage (cactoImagem6);
              break;
      default: break;
    }
    
    grupoCactos.add(cacto);

    cacto.lifetime = 700;
    cacto.scale = 0.5;
  }


}

function reiniciando()
{
  estadoJogo = JOGANDO;
  grupoCactos.destroyEach();
  grupoNuvens.destroyEach();
  pontos = 0;
  trex.changeAnimation("running", trex_running);

}













