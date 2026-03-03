//Inicializamos la posición de la esfera
let spherePos = { x: 0, y: 0, z: 0 };
//Inicializamos la velocidad de la esfera
let sphereSpeed = p5.Vector.random3D().mult(0.9);
// Establecemos el tamaño de la caja
let boxSize = 70;
function setup() {
  // Creamos un canvas de 600x600 pixeles en modo 3D
  createCanvas(600, 600, WEBGL);
  // Establecemos la perspectiva de la cámara
  // El primer parámetro es el ángulo de visión (FOV), que controla la anchura del volumen de visualización
  // El segundo parámetro es la relación de aspecto del lienzo, que es el ancho dividido por la altura
  // El tercer parámetro es el plano de recorte cercano, que es la distancia de la cámara al plano de recorte cercano
  // El cuarto parámetro es el plano de recorte lejano, que es la distancia de la cámara al plano de recorte lejano
  perspective(PI/12, 1, 5*sqrt(3), 500*sqrt(3));
}

function draw() {
  // Establecemos el fondo de color gris
  background(200);
  // Habilitamos los controles de cámara para orbitar alrededor del origen
  // Esto permite al usuario controlar la cámara arrastrando el ratón en el lienzo
  orbitControl();

  // Giramos la escena alrededor de los ejes X e Y
  // Esto se hace para agregar algo de movimiento a la escena y hacerla más interesante de ver
  rotateX(frameCount * 0.001);
  rotateX(frameCount * 0.001);
  rotateY(frameCount * 0.001);

  // Actualizamos la posición de la esfera
  // Esto se hace agregando el vector de velocidad a la posición actual de la esfera
  // El vector de velocidad se calcula aleatoriamente al principio del programa y se mantiene constante
  // La esfera rebota en la caja cuando choca con ella, pero la velocidad no se ve afectada por la colisión
  spherePos.x += sphereSpeed.x;
  spherePos.y += sphereSpeed.y;
  spherePos.z += sphereSpeed.z;

  // Verificamos si la esfera colisiona con la caja
  // Esto se hace comprobando la distancia entre la esfera y las caras de la caja
  // Si la distancia es menor que el radio de la esfera, entonces se detecta una colisión
  // Cuando se detecta una colisión, se calcula el vector normal de la cara y se actualiza la velocidad de la esfera para rebotar en la cara
  let collision = false;
  // Iteramos sobre las 6 caras del cubo
  for (let i = -1; i <= 1; i += 2) {
    for (let j = -1; j <= 1; j += 2) {
      for (let k = -1; k <= 1; k += 2) {
        // Iteramos sobre las 6 caras del cubo
        let storeFaceCollision = {x: i * boxSize / 2, y: j * boxSize / 2, z: k * boxSize / 2};
        // Calculamos la distancia entre el centro de la esfera y la cara del cubo
        let dx = spherePos.x - storeFaceCollision.x;
        let dy = spherePos.y - storeFaceCollision.y;
        let dz = spherePos.z - storeFaceCollision.z;
        let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Verificamos si la esfera colisiona con la cara del cubo
        if (distance <= 10) {
          // Calculamos el vector normal de la cara del cubo
          let normal = {x: i, y: j, z: k};
          // Calculamos la nueva velocidad de la esfera después de la colisión
          // Esto se hace reflejando el vector de velocidad en el plano normal a la cara de la caja
          // La reflexión se calcula como 2 * (normal . velocidad) * normal - velocidad
          let newSpeed = sphereSpeed.copy();
          newSpeed.sub(normal.mult(2 * dot(sphereSpeed, normal)));
          // Actualizar la velocidad de la esfera
          sphereSpeed = newSpeed;
          collision = true;
          break;
        }
      }
      // Si la esfera colisionó con una cara del cubo, salimos del ciclo
      if (collision) break;
    }
    // Si la esfera colisionó con una cara del cubo, salimos del ciclo
    if (collision) break;
  }



  //Pintar caja transparente y darle color a la esfera
  noFill(); // no fill color
  box(boxSize);
  fill(87, 35, 100);

  //Pintar la esfera dentro del cubo
  push();
  //Inicializar en el centro del cubo
  translate(spherePos.x, spherePos.y, spherePos.z);
  // pintar la esfera
  sphere(7);
  pop();

}