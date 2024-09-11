document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.square-button');
    const backgroundImage = document.getElementById('backgroundImage');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover la clase 'selected' de todos los botones y ocultar todas las listas
            buttons.forEach(btn => btn.classList.remove('selected'));
            document.querySelectorAll('.list').forEach(list => list.style.display = 'none');
            
            // Agregar la clase 'selected' al botón clicado
            button.classList.add('selected');
            
            // Cambiar la imagen de fondo según el botón clicado
            const imageUrl = button.getAttribute('data-image');
            backgroundImage.style.backgroundImage = `url('${imageUrl}')`;

            // Mostrar la lista asociada al botón clicado
            const listId = button.getAttribute('data-list');
            const list = document.getElementById(listId);
            if (list) {
                list.style.display = 'block';
            }
        });
    });

    // Establecer el botón 3 como seleccionado por defecto
    const defaultButton = document.querySelector('.square-button:nth-child(3)');
    if (defaultButton) {
        defaultButton.classList.add('selected');
        const defaultImage = defaultButton.getAttribute('data-image');
        backgroundImage.style.backgroundImage = `url('${defaultImage}')`;

        const defaultList = document.getElementById(defaultButton.getAttribute('data-list'));
        if (defaultList) {
            defaultList.style.display = 'block';
        }
    }
});
