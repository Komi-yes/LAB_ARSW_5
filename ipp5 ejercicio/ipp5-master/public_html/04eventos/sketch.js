function setup() {
  createCanvas(640, 480);
}

function draw() {
  if (mouseIsPressed === true) {
    fill(0,0,0);
  } 
  if (mouseIsPressed === false) {
    fill(255,255,255);
  }
  ellipse(200, 200, 20, 20);
}