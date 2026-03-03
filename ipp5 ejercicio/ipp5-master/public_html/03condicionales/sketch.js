var posX = 10;
var posY = 10;
var velocidadX = 4;
var velocidadY = 3;

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(0, 180, 0);
  ellipse(posX, posY, 20, 20);
  posX = posX + velocidadX;
  posY = posY + velocidadY;
}