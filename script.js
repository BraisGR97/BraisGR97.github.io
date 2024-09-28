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

// Pre-cargar imágenes
const imagePaths = ['0.png', '4.png', '2.png', '1.png', '3.png', '5.png'];
const images = [];

imagePaths.forEach((path, index) => {
    const img = new Image();
    img.src = path;
    images[index] = img;
});

// Mostrar imagen por defecto al cargar la página
window.onload = () => {
    const backgroundContainer = document.querySelector('.background-container');
    backgroundContainer.style.backgroundImage = "url('0.png')"; // Imagen por defecto al cargar la página
}

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
    const backgroundContainer = document.querySelector('.background-container');

    // Ocultar todas las listas
    allLists.forEach(list => list.classList.remove('active'));

    // Mostrar la lista correspondiente al botón seleccionado
    const selectedList = document.getElementById(`list${listNumber}`);
    selectedList.classList.add('active');

    // Cambiar la imagen del contenedor dependiendo del botón seleccionado
    switch (listNumber) {
        case 1:
            backgroundContainer.style.backgroundImage = "url('4.png')";
            break;
        case 2:
            backgroundContainer.style.backgroundImage = "url('2.png')";
            break;
        case 3:
            backgroundContainer.style.backgroundImage = "url('1.png')";
            break;
        case 4:
            backgroundContainer.style.backgroundImage = "url('3.png')";
            break;
        case 5:
            backgroundContainer.style.backgroundImage = "url('5.png')";
            break;
        default:
            backgroundContainer.style.display = 'none';  // Ocultar la imagen si no es válido
    }
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

    // Calcular el color inmediatamente antes de detener la animación
    const color = getColorUnderMarker(); 

    // Detener la rotación justo en la posición final sin permitir movimientos adicionales
    const marker = document.querySelector('.marker');
    marker.style.transform = `translate(-50%, -150px) rotate(${currentRotation * 360}deg)`; // Asegurarse que la rotación final se mantiene

    setTimeout(() => {
        alert(`Gana el "${color}"`); // Mostrar el mensaje con el color ganador
    }, 100); // Pequeño retardo para asegurarse que el cálculo es correcto
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
        // Detener el juego directamente aquí para evitar cualquier cambio posterior
        stopGame(); // Llamar a la función para detener el juego
    }
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
