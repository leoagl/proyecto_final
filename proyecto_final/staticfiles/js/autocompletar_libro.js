document.addEventListener('DOMContentLoaded', function () {
    const tituloInput = document.querySelector('#id_titulo');

    if (tituloInput) {
        tituloInput.addEventListener('blur', function () {
            const titulo = tituloInput.value.trim();
            if (titulo.length > 2) {
                fetch(`/libros/api/googlebooks/?titulo=${encodeURIComponent(titulo)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.exito) {
                            document.querySelector('#id_autor').value = data.autor || '';
                            document.querySelector('#id_editorial').value = data.editorial || '';
                            document.querySelector('#id_año_publicacion').value = data.año_publicacion || '';
                            document.querySelector('#id_ISBN').value = data.ISBN || '';
                        } else {
                            console.log('No se encontró información');
                        }
                    });
            }
        });
    }
});
