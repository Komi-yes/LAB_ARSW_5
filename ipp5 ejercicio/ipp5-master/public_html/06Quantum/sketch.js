var tamanoBolas = 60;

//Variables pelota 1
var posX1 = 10;
var posY1 = 10;
var velocidadX1 = Math.floor((Math.random() * 10) + 1);
var velocidadY1 = Math.floor((Math.random() * 10) + 1);

//Variables pelota 2
var posX2 = 160;
var posY2 = 160;
var velocidadX2 = Math.floor((Math.random() * 10) + 1);
var velocidadY2 = Math.floor((Math.random() * 10) + 1);

function setup() {
  createCanvas(600, 400);
}

function draw() {
  // Colorea la mesa
  background(0, 180, 0);
  
  //Actualiza las posiciones
  posX1 = posX1 + velocidadX1;
  posY1 = posY1 + velocidadY1;
  posX2 = posX2 + velocidadX2;
  posY2 = posY2 + velocidadY2;
  
  //Actualiza las velocidades si hay colisión con los bordes
  if(posX1>=600){velocidadX1 = velocidadX1 * -1;}
  if(posX1<=0){velocidadX1 = velocidadX1 * -1;}
  if(posY1>=400){velocidadY1 = velocidadY1 * -1;}
  if(posY1<=0){velocidadY1 = velocidadY1 * -1;}
  
  if(posX2>=600){velocidadX2 = velocidadX2 * -1;}
  if(posX2<=0){velocidadX2 = velocidadX2 * -1;}
  if(posY2>=400){velocidadY2 = velocidadY2 * -1;}
  if(posY2<=0){velocidadY2 = velocidadY2 * -1;}
  
  //Cambia el color de relleno de las bolas
  fill(255,255,255);
  
  //Actualiza las velocidades si hay colisión entre pelotas
  //Usted debe completar esto
  if((Math.abs(posX2 - posX1) <= tamanoBolas) && (Math.abs(posY2 - posY1) <= tamanoBolas) )
  {
      fill(0,0,0); 
  }
  
  //Pinta las bolas
  ellipse(posX1, posY1, tamanoBolas, tamanoBolas);
  ellipse(posX2, posY2, tamanoBolas, tamanoBolas);
  
}