document.addEventListener('DOMContentLoaded', function () {
    const tituloInput = document.querySelector('#id_titulo');
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'google-results-container';
    tituloInput.parentNode.insertBefore(resultsContainer, tituloInput.nextSibling);

    // Estilos para el contenedor
    resultsContainer.style.marginBottom = '10px';
    resultsContainer.style.border = '1px solid #555';
    resultsContainer.style.padding = '10px';
    resultsContainer.style.backgroundColor = '#333';
    resultsContainer.style.color = '#eee';

    function clearResults() {
        resultsContainer.innerHTML = '';
    }

    function populateForm(book) {
        document.querySelector('#id_autor').value = book.autor || '';
        document.querySelector('#id_editorial').value = book.editorial || '';
        document.querySelector('#id_año_publicacion').value = book.año_publicacion || '';
        document.querySelector('#id_ISBN').value = book.ISBN || '';
        document.querySelector('#id_portada_url').value = book.portada || '';
        clearResults();
    }

    if (tituloInput) {
        tituloInput.addEventListener('blur', function () {
            const titulo = tituloInput.value.trim();
            clearResults();

            if (titulo.length > 2) {
                    fetch(`/libros/api/googlebooks/?titulo=${encodeURIComponent(titulo)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.exito && data.resultados && data.resultados.length > 0) {
                            const titleHeader = document.createElement('h3');
                            titleHeader.textContent = 'Selecciona un libro:';
                            titleHeader.style.color = '#eee';
                            resultsContainer.appendChild(titleHeader);

                            data.resultados.forEach(book => {
                                const resultDiv = document.createElement('div');
                                resultDiv.style.borderBottom = '1px solid #555';
                                resultDiv.style.padding = '5px';
                                resultDiv.style.cursor = 'pointer';
                                resultDiv.style.color = '#eee';

                                const titleElement = document.createElement('strong');
                                titleElement.textContent = book.titulo;
                                resultDiv.appendChild(titleElement);
                                if (book.autor) {
                                    resultDiv.appendChild(document.createTextNode(` - ${book.autor}`));
                                }

                                resultDiv.addEventListener('click', function () {
                                    populateForm(book);
                                });
                                resultsContainer.appendChild(resultDiv);
                            });
                        } else if (data && data.exito) {
                            const noResults = document.createElement('p');
                            noResults.textContent = 'No se encontraron resultados para este título.';
                            noResults.style.color = '#eee';
                            resultsContainer.appendChild(noResults);
                        } else {
                            console.log('Error al buscar información:', data ? data.error : 'Error desconocido');
                        }
                    });
            }
        });
    }
});