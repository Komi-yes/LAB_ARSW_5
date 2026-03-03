var pos = 300;

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(220, 180, 200);
  pos = pos + 1;
  ellipse(pos, pos, 100, 100);
  ellipse(pos-200, pos-200 , 50, 50);
}