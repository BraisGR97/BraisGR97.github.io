// script.js

const buttons = document.querySelectorAll('.square-button');
const contents = document.querySelectorAll('.content');
const playButton = document.querySelector('.play-button');

// Frases por botón (ajustar frases si es necesario)
const phrases = {
    '1': ['Frase 11A', 'Frase 1B', 'Frase 1C', 'Frase 1D'],
    '2': ['Frase 2A', 'Frase 2B', 'Frase 2C', 'Frase 2D'],
    '3': ['Slap', 'Kiss', 'Shot', 'Selfie'],
    '4': ['Frase 4A', 'Frase 4B', 'Frase 4C', 'Frase 4D'],
    '5': ['Frase 5A', 'Frase 5B', 'Frase 5C', 'Frase 5D']
};

// Manejar clic en botones
function handleButtonClick(event) {
    const buttonValue = event.target.dataset.value;

    // Deseleccionar todos los botones y ocultar todo el contenido
    buttons.forEach(button => button.classList.remove('selected'));
    contents.forEach(content => content.classList.remove('active'));

    // Seleccionar el botón clicado y mostrar el contenido correspondiente
    event.target.classList.add('selected');
    document.querySelector(`.content[data-button="${buttonValue}"]`).classList.add('active');
}

// Añadir el evento de clic a cada botón
buttons.forEach(button => button.addEventListener('click', handleButtonClick));

// Obtener una frase aleatoria de la lista correspondiente al botón seleccionado
function getRandomPhrase(buttonValue) {
    const buttonPhrases = phrases[buttonValue];
    const randomIndex = Math.floor(Math.random() * buttonPhrases.length);
    return buttonPhrases[randomIndex];
}

// Manejar clic en el botón de play
function handlePlayClick() {
    let changesRemaining = 30; // Número de cambios
    const interval = setInterval(() => {
        if (changesRemaining > 0) {
            // Obtener el botón seleccionado
            const selectedButton = document.querySelector('.square-button.selected');
            if (selectedButton) {
                const buttonValue = selectedButton.dataset.value;
                // Cambiar el texto en la pantalla
                const displayText = document.querySelector(`.content[data-button="${buttonValue}"] .display-text`);
                displayText.textContent = getRandomPhrase(buttonValue);
            }
            changesRemaining--;
        } else {
            clearInterval(interval); // Detener el intervalo cuando se acaben los cambios
            alert('Felicidades Disfrútalo'); // Mostrar ventana emergente al terminar
        }
    }, 200); // Cambiar el texto cada 500 ms (ajustable)
}

// Añadir el evento de clic al botón de play
playButton.addEventListener('click', handlePlayClick);

// Inicializar la vista con el botón 3 seleccionado por defecto
document.querySelector('.square-button[data-value="3"]').click();
