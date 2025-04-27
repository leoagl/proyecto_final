// Menú móvil
document.addEventListener('DOMContentLoaded', function() {
    // Menú móvil
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;

    menuToggle.addEventListener('click', () => {
        if (menuOpen) {
            mobileMenu.style.display = 'none';
            // Restaurar las barras del menú
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        } else {
            mobileMenu.style.display = 'block';
            // Animar las barras del menú a una X
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        }
        menuOpen = !menuOpen;
    });

    // Cerrar el menú móvil cuando se hace clic en un enlace
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.style.display = 'none';
            menuOpen = false;
            // Restaurar las barras del menú
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Actualizar el año actual en el footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Mostrar/ocultar filtros en móvil
    const toggleFilters = document.getElementById('toggleFilters');
    const filtersBody = document.getElementById('filtersBody');
    const filterHeader = document.querySelector('.filter-header');

    function toggleFiltersVisibility() {
        filtersBody.classList.toggle('open');

        // Cambiar el icono
        const icon = toggleFilters.querySelector('i');
        if (filtersBody.classList.contains('open')) {
            icon.classList.remove('fa-sliders-h');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-sliders-h');
        }
    }

    toggleFilters.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFiltersVisibility();
    });

    filterHeader.addEventListener('click', (e) => {
        // Solo activar si estamos en móvil
        if (window.innerWidth <= 992) {
            toggleFiltersVisibility();
        }
    });

    // Cambiar vista de cuadrícula a lista
    const viewOptions = document.querySelectorAll('.view-option');
    const booksContainer = document.getElementById('booksContainer');

    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Quitar clase activa de todas las opciones
            viewOptions.forEach(opt => opt.classList.remove('active'));

            // Añadir clase activa a la opción seleccionada
            option.classList.add('active');

            // Cambiar la vista
            const viewType = option.getAttribute('data-view');
            if (viewType === 'grid') {
                booksContainer.classList.remove('books-list');
                booksContainer.classList.add('books-grid');
            } else {
                booksContainer.classList.remove('books-grid');
                booksContainer.classList.add('books-list');
            }
        });
    });

    // Slider de rango para años
    const yearMinRange = document.getElementById('yearMinRange');
    const yearMaxRange = document.getElementById('yearMaxRange');
    const yearMin = document.getElementById('yearMin');
    const yearMax = document.getElementById('yearMax');

    yearMinRange.addEventListener('input', () => {
        const minVal = parseInt(yearMinRange.value);
        const maxVal = parseInt(yearMaxRange.value);

        if (minVal > maxVal) {
            yearMinRange.value = maxVal;
            yearMin.textContent = maxVal;
        } else {
            yearMin.textContent = minVal;
        }
    });

    yearMaxRange.addEventListener('input', () => {
        const minVal = parseInt(yearMinRange.value);
        const maxVal = parseInt(yearMaxRange.value);

        if (maxVal < minVal) {
            yearMaxRange.value = minVal;
            yearMax.textContent = minVal;
        } else {
            yearMax.textContent = maxVal;
        }
    });

    // Botones de acción para filtros
    const resetFiltersBtn = document.getElementById('resetFilters');
    const applyFiltersBtn = document.getElementById('applyFilters');

    resetFiltersBtn.addEventListener('click', () => {
        // Restablecer checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checkbox.name === 'availability' && checkbox.value === 'disponible';
        });

        // Restablecer radio buttons
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.checked = false;
        });

        // Restablecer sliders
        yearMinRange.value = 1950;
        yearMaxRange.value = 2023;
        yearMin.textContent = 1950;
        yearMax.textContent = 2023;

        // Restablecer búsqueda
        document.getElementById('searchInput').value = '';

        // Simular aplicación de filtros
        simulateLoading();
    });

    applyFiltersBtn.addEventListener('click', () => {
        // Simular aplicación de filtros
        simulateLoading();
    });

    // Simular carga de resultados
    function simulateLoading() {
        // Mostrar estado de carga
        booksContainer.innerHTML = '<div class="loading-message"><i class="fas fa-spinner fa-spin"></i> Cargando resultados...</div>';

        // Simular tiempo de carga
        setTimeout(() => {
            // Restaurar contenido original (en una aplicación real, aquí se cargarían los nuevos resultados)
            location.reload();
        }, 1000);
    }

    // Botones "Ver más"
    const showMoreButtons = document.querySelectorAll('.show-more');
    showMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterOptions = this.previousElementSibling;
            const hiddenOptions = filterOptions.querySelectorAll('.filter-option.hidden');

            // Si no hay opciones ocultas, no hacer nada
            if (hiddenOptions.length === 0) {
                return;
            }

            // Mostrar las opciones ocultas
            hiddenOptions.forEach(option => {
                option.classList.remove('hidden');
            });

            // Cambiar el texto del botón
            this.textContent = 'Ver menos';

            // Cambiar el comportamiento del botón
            this.removeEventListener('click', arguments.callee);
            this.addEventListener('click', function() {
                // Ocultar las opciones adicionales
                const allOptions = filterOptions.querySelectorAll('.filter-option');
                for (let i = 5; i < allOptions.length; i++) {
                    allOptions[i].classList.add('hidden');
                }

                // Restaurar el texto y comportamiento original
                this.textContent = 'Ver más';
                this.removeEventListener('click', arguments.callee);
                showMoreButtons.forEach(btn => {
                    if (btn === this) {
                        btn.addEventListener('click', arguments.callee.caller);
                    }
                });
            });
        });
    });

    // Paginación
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                // Quitar clase activa de todos los botones
                paginationButtons.forEach(btn => btn.classList.remove('active'));

                // Añadir clase activa al botón seleccionado
                if (!this.querySelector('i')) {
                    this.classList.add('active');
                }

                // Simular carga de página
                simulateLoading();
            });
        }
    });

    // Botones de acción de libros
    const bookActionButtons = document.querySelectorAll('.book-actions button');
    bookActionButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                const action = this.textContent.trim();
                const bookTitle = this.closest('.book-card').querySelector('.book-title').textContent;

                if (this.classList.contains('btn-outline')) {
                    // Botón de guardar
                    this.innerHTML = '<i class="fas fa-heart"></i> Guardado';
                    this.classList.add('saved');
                    alert(`"${bookTitle}" ha sido añadido a tus favoritos.`);
                } else {
                    // Botón de leer o reservar
                    if (action.includes('Leer')) {
                        alert(`Abriendo "${bookTitle}" para lectura.`);
                        // Aquí se redigiría a la página de lectura
                    } else if (action.includes('Reservar')) {
                        this.innerHTML = '<i class="fas fa-check"></i> Reservado';
                        this.disabled = true;
                        alert(`Has reservado "${bookTitle}". Te notificaremos cuando esté disponible.`);
                    }
                }
            });
        }
    });

    // Ordenar resultados
    const sortSelect = document.getElementById('sortBy');
    sortSelect.addEventListener('change', () => {
        // Simular ordenamiento
        simulateLoading();
    });

    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');

    searchBtn.addEventListener('click', () => {
        if (searchInput.value.trim() !== '') {
            simulateLoading();
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            simulateLoading();
        }
    });

    // Inicialización
    // Inicializar la vista de filtros en móvil
    if (window.innerWidth <= 992) {
        filtersBody.style.display = 'none';
    } else {
        filtersBody.classList.add('open');
    }

    // Añadir animación de entrada a las tarjetas de libros
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
});