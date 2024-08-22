const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas para adaptarse al tamaño del dispositivo
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuración del juego
const ANCHO = canvas.width;
const ALTO = canvas.height;
const VELOCIDAD = 5;
const ALTO_OBSTACULO = 30;
const ANCHO_OBSTACULO = 50;
const ESPACIADO_OBSTACULO = 300;
const SALTO = -19; // Aumenta el salto para hacerlo más alto
const GRAVEDAD = 1;
const DINO_ALTO = 50;
const DINO_ANCHO = 50;
const PUNTOS_PARA_MENSAJE = 10;

let dino_x = 50;
let dino_y = ALTO - DINO_ALTO;
let gravedad_actual = 0;
let obstaculos = [];
let puntos = 0;
let mensaje_mostrado = false;
let juegoPausado = false;
let animacion;

// Cargar imagenes
const dinoImg = new Image();
dinoImg.src = 'C:\\Users\\USUARIO\\Downloads\\WhatsApp Image 2024-08-21 at 11.49.02 PM.png';

const fondoImg = new Image();
fondoImg.src = 'C:\\Users\\USUARIO\\Documents\\FONDO GAMER.png';

// Función para dibujar texto en el canvas
function dibujarTexto(texto, color, x, y) {
    ctx.font = '55px Arial';
    ctx.fillStyle = color;
    ctx.fillText(texto, x, y);
}

// Función para dibujar la imagen del dinosaurio
function dibujarDino(x, y) {
    ctx.drawImage(dinoImg, x, y, DINO_ANCHO, DINO_ALTO);
}

// Función para crear un nuevo obstáculo
function crearObstaculo() {
    const alto = Math.floor(Math.random() * (70 - 20 + 1)) + 20;
    return [ANCHO, ALTO - alto, ANCHO_OBSTACULO, alto];
}

// Manejar eventos de teclado
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && dino_y === ALTO - DINO_ALTO) {
        gravedad_actual = SALTO;
    }
});

document.getElementById('stop').addEventListener('click', function() {
    juegoPausado = true;
    cancelAnimationFrame(animacion);  // Detener la animación
});

document.getElementById('play').addEventListener('click', function() {
    if (juegoPausado) {
        juegoPausado = false;
        loop();  // Reanudar la animación
    }
});

function loop() {
    if (juegoPausado) return;

    // Dibujar fondo
    ctx.clearRect(0, 0, ANCHO, ALTO); // Limpiar pantalla antes de dibujar el fondo
    ctx.drawImage(fondoImg, 0, 0, ANCHO, ALTO);

    // Movimiento de obstáculos
    obstaculos.forEach(obs => obs[0] -= VELOCIDAD);
    if (obstaculos.length === 0 || obstaculos[obstaculos.length - 1][0] < ANCHO - ESPACIADO_OBSTACULO) {
        obstaculos.push(crearObstaculo());
    }

    // Eliminar obstáculos fuera de la pantalla
    obstaculos = obstaculos.filter(obs => obs[0] > -ANCHO_OBSTACULO);

    // Actualizar puntos y verificar si el obstáculo ha sido pasado
    if (obstaculos.length > 0 && obstaculos[0][0] + ANCHO_OBSTACULO < dino_x) {
        puntos += 1;
        obstaculos.shift();
    }

    // Mostrar mensaje "20% free" después de pasar 10 bloques
    if (puntos >= PUNTOS_PARA_MENSAJE && !mensaje_mostrado) {
        ctx.clearRect(0, 0, ANCHO, ALTO);
        dibujarTexto('20% FREE', 'white', ANCHO / 2 - 100, ALTO / 2 - 30);
        mensaje_mostrado = true;
        setTimeout(() => loop(), 2000);
        return;
    }

    // Movimiento del dinosaurio
    gravedad_actual += GRAVEDAD;
    dino_y += gravedad_actual;
    if (dino_y > ALTO - DINO_ALTO) {
        dino_y = ALTO - DINO_ALTO;
        gravedad_actual = 0;
    }

    // Comprobar colisiones
    for (const obs of obstaculos) {
        if (dino_x + DINO_ANCHO > obs[0] && dino_x < obs[0] + obs[2]) {
            if (dino_y + DINO_ALTO > obs[1]) {
                ctx.clearRect(0, 0, ANCHO, ALTO);
                dibujarTexto('¡PERDISTE!', 'white', ANCHO / 2 - 150, ALTO / 2 - 30);
                setTimeout(() => location.reload(), 2000);
                return;
            }
        }
    }

    // Dibujar obstáculos
    ctx.fillStyle = 'purple'; // Cambia el color de los bloques a morado
    obstaculos.forEach(obs => ctx.fillRect(obs[0], obs[1], obs[2], obs[3]));

    // Dibujar el dinosaurio
    dibujarDino(dino_x, dino_y);

    // Actualizar pantalla
    animacion = requestAnimationFrame(loop);
}

loop();
