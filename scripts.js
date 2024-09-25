let isSpinning = false; // Indica si el marcador está girando
let currentRotation = 0; // Rastro de la rotación actual
let acceleration = 0; // Velocidad inicial
const maxSpeed = 1; // Velocidad máxima (1 vuelta por segundo)
const accelerationTime = 3000; // Tiempo de aceleración en ms
const initialSpinDuration = 3000; // Duración fija de 3 segundos a máxima velocidad
let spinDuration = 0; // Duración del giro
let previousTimestamp; // Timestamp para el control del tiempo
const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');

function drawCircle() {
    const radius = 150;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00'];
    const segments = colors.length;
    const angle = (2 * Math.PI) / segments;

    // Dibujar los segmentos
    for (let i = 0; i < segments; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle * i, angle * (i + 1));
        ctx.fillStyle = colors[i];
        ctx.fill();
    }
}

function showList(listNumber) {
    const allLists = document.querySelectorAll('.phrase-list');
    allLists.forEach(list => list.classList.remove('active'));

    const selectedList = document.getElementById(`list${listNumber}`);
    selectedList.classList.add('active');
}

function startGame() {
    if (!isSpinning) {
        isSpinning = true;
        currentRotation = 0; // Reiniciar la rotación
        acceleration = 0; // Reiniciar la aceleración
        spinDuration = Math.random() * (10000 - 5000) + 5000; // Duración aleatoria entre 5 y 10 segundos
        drawCircle(); // Dibuja el círculo

        // Comienza el aumento de velocidad
        requestAnimationFrame(accelerate);
    }
}

function accelerate(timestamp) {
    const marker = document.querySelector('.marker');
    const timeElapsed = timestamp - (previousTimestamp || timestamp);
    previousTimestamp = timestamp;

    // Aumentar la aceleración hasta 1 vuelta por segundo en 3 segundos
    if (acceleration < maxSpeed) {
        acceleration += (maxSpeed / (accelerationTime / 16.67)); // 60 fps
    }

    // Actualizar la rotación del marcador
    currentRotation += (acceleration / maxSpeed) * (timeElapsed / 1000); // Incrementar rotación normalizada
    marker.style.transform = `translate(-50%, -150px) rotate(${currentRotation * 360}deg)`; // Actualizar rotación en grados

    // Verificar si se ha alcanzado la velocidad máxima
    if (acceleration < maxSpeed) {
        requestAnimationFrame(accelerate);
    } else {
        // Mantener el giro durante el tiempo aleatorio a velocidad máxima
        spinDuration -= timeElapsed; // Disminuir el tiempo de giro
        if (spinDuration > 0) {
            currentRotation += (maxSpeed) * (timeElapsed / 1000); // Incrementar rotación a velocidad máxima
            marker.style.transform = `translate(-50%, -150px) rotate(${currentRotation * 360}deg)`; // Actualizar rotación en grados
            requestAnimationFrame(maintainSpin);
        } else {
            stopGame(); // Detener el juego
        }
    }
}

function maintainSpin(timestamp) {
    const marker = document.querySelector('.marker');
    const timeElapsed = timestamp - (previousTimestamp || timestamp);
    previousTimestamp = timestamp;

    // Mantener la rotación a velocidad máxima
    currentRotation += (maxSpeed) * (timeElapsed / 1000); // Incrementar rotación a velocidad máxima
    marker.style.transform = `translate(-50%, -150px) rotate(${currentRotation * 360}deg)`; // Actualizar rotación en grados

    // Comprobar si ya ha pasado el tiempo de giro
    if (spinDuration > 0) {
        spinDuration -= timeElapsed; // Disminuir el tiempo de giro
        requestAnimationFrame(maintainSpin);
    } else {
        stopGame(); // Detener el juego
    }
}

function stopGame() {
    isSpinning = false; // Marcar como detenido
    const color = getColorUnderMarker();
    alert(`Gana el "${color}"`); // Muestra el color ganador
}

function getColorUnderMarker() {
    const markerX = canvas.width / 2 + Math.sin(currentRotation * 2 * Math.PI) * 150; // Calcular la posición X del marcador
    const markerY = canvas.height / 2 - Math.cos(currentRotation * 2 * Math.PI) * 150; // Calcular la posición Y del marcador
    const pixelData = ctx.getImageData(markerX, markerY, 1, 1).data; // Obtener datos de un píxel
    const [r, g, b] = pixelData;

    // Lógica para determinar el color basado en RGB
    if (r > g && r > b) return 'Rojo';
    if (g > r && g > b) return 'Verde';
    if (b > r && b > g) return 'Azul';
    return 'Amarillo'; // Para el color amarillo
}

// Inicializa el círculo al cargar la página
drawCircle();
