//variables de la raqueta
let racketPosition; //posición
let racketLength = 100; //Tamaño de la raqueta
let racketSpeed = 6; //rapidez de la raqueta

//variables de la bola
let position; //posición
let velocity; //velocidad
let r = 6; //radio
let speed = 7.5; //rapidez
let score = 0; //puntaje


function setup() {
    //crea el tablero del juego
    //Crea un lienzo de dibujo de 810 píxeles de ancho y 500 píxeles de alto.
    createCanvas(810, 500);

    // Inicializar la posición de la paddle
    //Inicializa la variable racketPosition con un nuevo vector con las coordenadas x = ancho/2 y y = alto - 70.
    racketPosition = createVector(width / 2, height - 70);

    //Inicializar la posición de la bola
    //Inicializa la variable position con un nuevo vector con las coordenadas x = ancho/2 y y = 0.
    position = createVector(width / 2, 0);

    // Calcular la velocidad aleatoria inicial
    //Inicializa la variable velocity con un nuevo vector aleatorio de 2 dimensiones.
    velocity = p5.Vector.random2D();

    //Multiplica el vector velocity por el valor de la variable speed.
    velocity.mult(speed);

}

function draw() {


    // Dibujar la raqueta

    //Pinta el fondo del lienzo de negro.
    background(0);

    //Establece el color de relleno de los objetos en blanco en este caso la raqueta.
    fill(255);

    //Dibuja un rectángulo (la raqueta) con las dimensiones definidas por las variables racketLength y 10 en la posición definida por la variable racketPosition.
    rect(racketPosition.x - racketLength / 2, racketPosition.y, racketLength, 10);


    //Dibujar la pelota

    //Elimina el trazo de los objetos dibujados.
    noStroke();

    //Establece el color de relleno de los objetos en una tonalidad de naranja.
    fill(245, 150, 34);

    //Dibuja una elipse (la pelota) con el diámetro definido por la variable r en la posición definida por la variable position.
    ellipse(position.x, position.y, r * 2, r * 2);

    //Dibujar el tablero que suma uno cada vez que colisiona con la raqueta

    //Establece el color de relleno de los objetos en blanco.
    fill(255);

    //Establece el tamaño de la fuente de texto en 24 píxeles.
    textSize(24);

    //Alinea el texto en el centro horizontal y vertical.
    textAlign(CENTER, CENTER);

    //Dibuja el texto "Score: " seguido del valor de la variable score en el centro del lienzo y a 50 píxeles de distancia del borde superior
    text('Score: ' + score, width / 2, 50);

    //Actualiza la posición de la pelota sumando el vector velocity a la variable position.
    position.add(velocity);


    // Mover la raqueta según la velocidad

    // Verifica si la tecla de flecha izquierda está siendo presionada.
    if (keyIsDown(LEFT_ARROW)) {
        //Validación adicional para que la raqueta no se salga del tablero
        if (racketPosition.x - racketSpeed > racketLength / 2) {
            // Desplaza la raqueta hacia la izquierda a la velocidad definida por la variable racketSpeed.
            racketPosition.x -= racketSpeed;
        } else {
            //Desplaza la raqueta hacia la derecha hasta el centro del lienzo.
            racketPosition.x = racketLength / 2;
        }
    }

    // Verifica si la tecla de flecha derecha está siendo presionada.
    if (keyIsDown(RIGHT_ARROW)) {
        //Validación adicional para que la raqueta no se salga del tablero
        if (racketPosition.x + racketSpeed <= width - racketLength / 2) {
            //Validación adicional para que la raqueta no se salga del tablero
            racketPosition.x += racketSpeed;
        } else {
            //Desplaza la raqueta hacia la izquierda hasta el centro del lienzo.
            racketPosition.x = width - racketLength / 2;
        }
    }

    //Aumnetar la velocidad de la pelota a medida que pase el tiempo siempre y cuando no pierda
    // Verifica si el contador de fotogramas es divisible por 60.
    if (frameCount % 60 === 0) {
        speed += 0.1;
        velocity.setMag(speed);
    }

    // Si la bola toca el suelo, reiniciar la posición y velocidad

    // Verifica si la pelota ha tocado el borde inferior del lienzo.
    if (position.y > height - r) {
        //Reinicia la posición de la pelota en el centro del lienzo y a una altura de 0.
        position = createVector(width / 2, 0);
        //Genera un nuevo vector de velocidad aleatorio para la pelota.
        velocity = p5.Vector.random2D();
        //Actualiza la magnitud del vector velocity con el nuevo valor de la velocidad.
        velocity.mult(speed);
        //Reinicia el valor de la variable score a 0.
        score = 0;
        //Reinicia el valor de la variable speed a 7.5.
        speed = 7.5;
    }

    // Rebotar la bola en las paredes del tablero

    //Derecha

    // Verifica si la pelota ha tocado el borde derecho del lienzo.
    if (position.x > width - r) {
        // Colisión con el borde derecho del tablero
        position.x = width - r; // Ajustar la posición horizontal al borde derecho
        velocity.x *= -1; // Revertir la velocidad horizontal de la pelota
    }

    // Arriba

    //Verifica si la pelota hatocado el borde superior del lienzo.
    if (position.y < r) {
        // Colisión con el borde superior del tablero
        position.y = r; // Ajustar la posición vertical al borde superior
        velocity.y *= -1; // Revertir la velocidad vertical de la pelota
    }

    //Rebote cuando colsiona con la raqueta

    //Verifica si la pelota ha tocado la raqueta.
    if (position.y + r > racketPosition.y &&
        position.y - r < racketPosition.y + 10 &&
        position.x - r < racketPosition.x + racketLength / 2 &&
        position.x + r > racketPosition.x - racketLength / 2) {
        // Cambia la dirección de la velocidad de la bola en el eje Y
        velocity.y *= -1;
        // Aumenta el puntaje
        score++;
    }

}